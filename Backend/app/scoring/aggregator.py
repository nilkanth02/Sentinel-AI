"""
Risk Score Aggregation Module

This module combines multiple AI risk signals into a single final risk score.
It aggregates prompt anomaly detection and output risk scoring using weighted
averaging and merges risk flags into a unified list.
"""

from typing import Dict, Any, List, Optional
from dataclasses import dataclass


@dataclass
class RiskSignals:
    """
    Container for all risk signals to be aggregated.
    """
    prompt_anomaly: Dict[str, Any]
    output_risk: Dict[str, Any]


class RiskAggregator:
    """
    Aggregates multiple risk signals into a unified risk assessment.
    """
    
    def __init__(self, 
                 prompt_weight: float = 0.4,
                 output_weight: float = 0.6):
        """
        Initialize the risk aggregator with configurable weights.
        
        Args:
            prompt_weight: Weight for prompt anomaly signals (0-1)
            output_weight: Weight for output risk signals (0-1)
            
        Note:
            Weights should sum to 1.0. Default weights favor output risk
            since harmful content in outputs is typically more critical
            than unusual prompts. This can be adjusted based on use case.
        """
        # Normalize weights to ensure they sum to 1.0
        total_weight = prompt_weight + output_weight
        if total_weight == 0:
            raise ValueError("Weights cannot both be zero")
            
        self.prompt_weight = prompt_weight / total_weight
        self.output_weight = output_weight / total_weight
        
        # Validate weights are reasonable
        if not (0 <= self.prompt_weight <= 1 and 0 <= self.output_weight <= 1):
            raise ValueError("Weights must be between 0 and 1")
    
    def _normalize_score(self, score: float) -> float:
        """
        Ensure a score is within valid range [0, 1].
        
        Args:
            score: Input score to normalize
            
        Returns:
            Normalized score between 0 and 1
        """
        return max(0.0, min(1.0, score))
    
    def _extract_prompt_score(self, prompt_signals: Dict[str, Any]) -> float:
        """
        Extract normalized prompt anomaly score.
        
        Args:
            prompt_signals: Prompt anomaly detection results
            
        Returns:
            Normalized prompt risk score (0-1)
        """
        if not prompt_signals:
            return 0.0
        
        # Use similarity score inverted as risk score
        # Lower similarity = higher risk
        similarity = prompt_signals.get("similarity_score", 1.0)
        risk_score = 1.0 - similarity
        
        # Boost score if explicitly flagged as anomalous
        if prompt_signals.get("is_anomalous", False):
            risk_score = max(risk_score, 0.5)  # Minimum 0.5 for flagged anomalies
        
        return self._normalize_score(risk_score)
    
    def _extract_output_score(self, output_signals: Dict[str, Any]) -> float:
        """
        Extract normalized output risk score.
        
        Args:
            output_signals: Output risk scoring results
            
        Returns:
            Normalized output risk score (0-1)
        """
        if not output_signals:
            return 0.0
        
        # Use the pre-calculated risk score
        return self._normalize_score(output_signals.get("risk_score", 0.0))
    
    def _merge_flags(self, prompt_signals: Dict[str, Any], 
                    output_signals: Dict[str, Any]) -> List[str]:
        """
        Merge risk flags from both signal sources.
        
        Args:
            prompt_signals: Prompt anomaly detection results
            output_signals: Output risk scoring results
            
        Returns:
            Unified list of risk flags
        """
        flags = []
        
        # Add prompt anomaly flag if present
        if prompt_signals.get("is_anomalous", False):
            flags.append("prompt_anomaly")
        
        # Add output risk flags
        output_flags = output_signals.get("flags", [])
        flags.extend(output_flags)
        
        # Remove duplicates while preserving order
        seen = set()
        unique_flags = []
        for flag in flags:
            if flag not in seen:
                seen.add(flag)
                unique_flags.append(flag)
        
        return unique_flags
    
    def _calculate_confidence(self, prompt_signals: Dict[str, Any], 
                             output_signals: Dict[str, Any]) -> float:
        """
        Calculate confidence in the aggregated risk assessment.
        
        Args:
            prompt_signals: Prompt anomaly detection results
            output_signals: Output risk scoring results
            
        Returns:
            Confidence score between 0 and 1
        """
        factors = []
        
        # Check if we have valid data from each source
        if prompt_signals and "similarity_score" in prompt_signals:
            factors.append(1.0)
        else:
            factors.append(0.0)
            
        if output_signals and "risk_score" in output_signals:
            factors.append(1.0)
        else:
            factors.append(0.0)
        
        # Average the availability factors
        return sum(factors) / len(factors)
    
    def aggregate_risk(self, risk_signals: RiskSignals) -> Dict[str, Any]:
        """
        Aggregate multiple risk signals into a unified risk assessment.
        
        Args:
            risk_signals: Container containing prompt and output risk signals
            
        Returns:
            Dictionary containing:
            - final_score: Aggregated risk score (0-1)
            - flags: Unified list of risk flags
            - confidence: Confidence in the assessment (0-1)
            - component_scores: Individual component scores
            - weights: Weights used for aggregation
        """
        prompt_signals = risk_signals.prompt_anomaly or {}
        output_signals = risk_signals.output_risk or {}
        
        # Extract individual component scores
        prompt_score = self._extract_prompt_score(prompt_signals)
        output_score = self._extract_output_score(output_signals)
        
        # Calculate weighted average
        final_score = (prompt_score * self.prompt_weight + 
                      output_score * self.output_weight)
        
        # Apply final normalization
        final_score = self._normalize_score(final_score)
        
        # Merge flags from both sources
        flags = self._merge_flags(prompt_signals, output_signals)
        
        # Calculate confidence
        confidence = self._calculate_confidence(prompt_signals, output_signals)
        
        return {
            "final_score": round(final_score, 3),
            "flags": flags,
            "confidence": round(confidence, 3),
            "component_scores": {
                "prompt_anomaly": round(prompt_score, 3),
                "output_risk": round(output_score, 3)
            },
            "weights": {
                "prompt_anomaly": round(self.prompt_weight, 3),
                "output_risk": round(self.output_weight, 3)
            }
        }
    
    def aggregate_from_dicts(self, prompt_signals: Dict[str, Any], 
                           output_signals: Dict[str, Any]) -> Dict[str, Any]:
        """
        Convenience method to aggregate from separate dictionaries.
        
        Args:
            prompt_signals: Prompt anomaly detection results
            output_signals: Output risk scoring results
            
        Returns:
            Aggregated risk assessment results
        """
        risk_signals = RiskSignals(
            prompt_anomaly=prompt_signals,
            output_risk=output_signals
        )
        return self.aggregate_risk(risk_signals)


# ------------------------------------------------------------------
# Public functional interface (used by API / orchestration layers)
# ------------------------------------------------------------------

_default_aggregator = RiskAggregator()


def aggregate_risk_signals(prompt_signals: Dict[str, Any], 
                          output_signals: Dict[str, Any]) -> Dict[str, Any]:
    """
    Public wrapper for risk signal aggregation.
    
    This function provides a stable interface for other
    SentinelAI components while keeping the implementation
    encapsulated within the aggregator class.
    
    Args:
        prompt_signals: Results from prompt anomaly detection
        output_signals: Results from output risk scoring
        
    Returns:
        Aggregated risk assessment with final score and unified flags
    """
    return _default_aggregator.aggregate_from_dicts(prompt_signals, output_signals)


def create_custom_aggregator(prompt_weight: float, 
                           output_weight: float) -> RiskAggregator:
    """
    Create a custom risk aggregator with specified weights.
    
    Args:
        prompt_weight: Weight for prompt anomaly signals
        output_weight: Weight for output risk signals
        
    Returns:
        Configured RiskAggregator instance
    """
    return RiskAggregator(prompt_weight=prompt_weight, output_weight=output_weight)


# ------------------------------------------------------------------
# Example usage and testing
# ------------------------------------------------------------------

# if __name__ == "__main__":
#     # Test cases
#     test_cases = [
#         # Normal case - low risk
#         {
#             "prompt": {"similarity_score": 0.9, "is_anomalous": False},
#             "output": {"risk_score": 0.1, "flags": []}
#         },
#         # Anomalous prompt but safe output
#         {
#             "prompt": {"similarity_score": 0.3, "is_anomalous": True},
#             "output": {"risk_score": 0.0, "flags": []}
#         },
#         # Normal prompt but risky output
#         {
#             "prompt": {"similarity_score": 0.8, "is_anomalous": False},
#             "output": {"risk_score": 0.7, "flags": ["violence"]}
#         },
#         # Both risky
#         {
#             "prompt": {"similarity_score": 0.2, "is_anomalous": True},
#             "output": {"risk_score": 0.8, "flags": ["hate_speech", "violence"]}
#         }
#     ]
    
#     for i, case in enumerate(test_cases, 1):
#         result = aggregate_risk_signals(case["prompt"], case["output"])
#         print(f"Test Case {i}:")
#         print(f"Final Score: {result['final_score']}")
#         print(f"Flags: {result['flags']}")
#         print(f"Component Scores: {result['component_scores']}")
#         print("-" * 50)
