"""
Risk Score Aggregation Module

This module combines multiple AI risk signals into a single final risk score.
It aggregates prompt anomaly detection, jailbreak RAG detection, and output risk 
scoring using severity-aware weighted max and merges risk flags into a unified list.
"""

from typing import Dict, Any, List, Optional
from dataclasses import dataclass

# Import centralized risk configuration for normalization/alignment
from app.config.risk_config import DECISION_ALIGNMENT, MAX_SCORE, MIN_SCORE

# Import settings service for dynamic configuration
from app.services.settings_service_db import settings_service


@dataclass
class RiskSignals:
    """
    Container for all risk signals to be aggregated.
    """
    prompt_anomaly: Dict[str, Any]
    jailbreak_rag: Dict[str, Any]
    output_risk: Dict[str, Any]


class RiskAggregator:
    """
    Aggregates multiple risk signals into a unified risk assessment.
    """
    
    def __init__(self):
        """
        Initialize the risk aggregator with dynamic settings.
        
        Uses live settings from settings service for real-time configuration.
        """
        # Get current signal weights from settings
        weights = settings_service.get_signal_weights()
        self.prompt_weight = weights["prompt_anomaly"]
        self.jailbreak_weight = weights["jailbreak_attempt"] 
        self.output_weight = weights["unsafe_output"]
        
        # Use centralized severity bases for normalization
        self.severity_bases = {
            "prompt_anomaly": 0.3,
            "jailbreak_attempt": 0.5,
            "unsafe_output": 0.8
        }
    
    def _normalize_score(self, score: float) -> float:
        """
        Ensure a score is within valid range using centralized bounds.
        
        Args:
            score: Input score to normalize
            
        Returns:
            Normalized score between MIN_SCORE and MAX_SCORE
        """
        return max(MIN_SCORE, min(MAX_SCORE, score))
    
    def _extract_prompt_score(self, prompt_signals: Dict[str, Any]) -> float:
        """
        Extract normalized prompt anomaly score with severity awareness.
        
        Args:
            prompt_signals: Prompt anomaly detection results (flat dict)
            
        Returns:
            Normalized prompt risk score (0-1) with severity base ~0.3
        """
        if not prompt_signals:
            return 0.0
        
        # Use similarity score inverted as risk score
        similarity = prompt_signals.get("similarity_score", 1.0)
        risk_score = 1.0 - similarity
        
        # Apply severity-aware normalization
        # Base score for prompt anomaly is ~0.3 (lower severity)
        if prompt_signals.get("is_anomalous", False):
            # Flagged anomalies get base severity score + intensity
            normalized_score = self.severity_bases["prompt_anomaly"] + risk_score * 0.4
        else:
            # Unflagged but low similarity gets partial severity
            normalized_score = risk_score * self.severity_bases["prompt_anomaly"]
        
        return self._normalize_score(normalized_score)
    
    def _extract_jailbreak_score(self, jailbreak_signals: Dict[str, Any]) -> float:
        """
        Extract normalized jailbreak RAG score with severity awareness.
        
        Args:
            jailbreak_signals: Jailbreak RAG detection results
            
        Returns:
            Normalized jailbreak risk score (0-1) with severity base ~0.5
        """
        if not jailbreak_signals:
            return 0.0
        
        # Check if jailbreak was detected (non-empty dict indicates detection)
        if jailbreak_signals.get("jailbreak_detected", False):
            # Base severity for jailbreak is ~0.5 (medium severity)
            similarity = jailbreak_signals.get("similarity_score", 0.0)
            # Higher similarity = higher confidence = higher severity
            normalized_score = self.severity_bases["jailbreak_attempt"] + similarity * 0.3
        else:
            # No jailbreak detected
            normalized_score = 0.0
        
        return self._normalize_score(normalized_score)
    
    def _extract_output_score(self, output_signals: Dict[str, Any]) -> float:
        """
        Extract normalized output risk score with severity awareness.
        
        Args:
            output_signals: Output risk scoring results (flat dict)
            
        Returns:
            Normalized output risk score (0-1) with severity base ~0.8
        """
        if not output_signals:
            return 0.0
        
        # Use the pre-calculated risk score
        raw_score = output_signals.get("risk_score", 0.0)
        
        # Apply severity-aware normalization
        # Base severity for unsafe output is ~0.8 (higher severity)
        flags = output_signals.get("flags", [])
        if "unsafe_output" in flags:
            # Flagged as unsafe output get base severity + intensity
            normalized_score = self.severity_bases["unsafe_output"] + raw_score * 0.2
        else:
            # Risk detected but not flagged as unsafe
            normalized_score = raw_score * 0.6  # Cap at 0.6 for non-unsafe risks
        
        return self._normalize_score(normalized_score)
    
    def _has_unsafe_output_flag(self, output_signals: Dict[str, Any]) -> bool:
        """
        Check if unsafe_output flag is present in output signals.
        
        Args:
            output_signals: Output risk scoring results (flat dict)
            
        Returns:
            True if unsafe_output flag is present
        """
        if not output_signals:
            return False
        
        flags = output_signals.get("flags", [])
        return "unsafe_output" in flags
    
    def _merge_flags(self, prompt_signals: Dict[str, Any], 
                    jailbreak_signals: Dict[str, Any],
                    output_signals: Dict[str, Any]) -> List[str]:
        """
        Merge risk flags from normalized signal envelope.
        
        Args:
            prompt_signals: Normalized prompt signal envelope
            jailbreak_signals: Normalized jailbreak signal envelope
            output_signals: Normalized output signal envelope
            
        Returns:
            Unified list of risk flags
        """
        flags = []
        
        # Add prompt anomaly flag if present
        if prompt_signals.get("present", False):
            flags.append("prompt_anomaly")
        
        # Add jailbreak flag if present
        if jailbreak_signals.get("present", False):
            flags.append("jailbreak_attempt")
        
        # Add output risk flags from normalized envelope
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
                             jailbreak_signals: Dict[str, Any],
                             output_signals: Dict[str, Any]) -> float:
        """
        Calculate confidence in the aggregated risk assessment.
        
        Confidence is based on detector execution, not risk severity.
        
        Args:
            prompt_signals: Prompt anomaly detection results
            jailbreak_signals: Jailbreak RAG detection results
            output_signals: Output risk scoring results
            
        Returns:
            Confidence score between 0 and 1
        """
        present_sources = 0
        
        # Confidence is based on detector execution, not whether a signal was present.
        # If a detector ran, we should count it even if `present` is False.
        if prompt_signals is not None:
            present_sources += 1
        if jailbreak_signals is not None:
            present_sources += 1
        if output_signals is not None:
            present_sources += 1
        
        # Confidence = (#present signal sources) / 3
        return present_sources / 3.0
    
    def _align_score_with_decision(self, final_score: float, decision: str) -> float:
        """
        Align final_risk_score with agent decisions using centralized configuration.
        
        Used when final_score is 0 or None after signal aggregation.
        Provides decision-based scoring to maintain consistency with policy actions.
        
        Args:
            final_score: Current aggregated score
            decision: Agent decision (allow/warn/block/escalate)
            
        Returns:
            Aligned score based on centralized decision mapping
        """
        # Only apply decision-based alignment if score is effectively zero
        if final_score is None or final_score <= 0:
            return DECISION_ALIGNMENT.get(decision.lower(), DECISION_ALIGNMENT["allow"])
        
        # Keep existing non-zero scores unchanged
        return final_score
    
    def aggregate_risk(self, risk_signals: RiskSignals, decision: str = None) -> Dict[str, Any]:
        """
        Aggregate multiple risk signals into a unified risk assessment using weighted max.
        
        Args:
            risk_signals: Container containing prompt, jailbreak, and output risk signals
            
        Returns:
            Dictionary containing:
            - final_score: Aggregated risk score (0-1) using weighted max
            - flags: Unified list of risk flags
            - confidence: Confidence in the assessment (0-1)
            - component_scores: Individual component scores
            - weights: Weights used for aggregation
        """
        prompt_signals = risk_signals.prompt_anomaly or {}
        jailbreak_signals = risk_signals.jailbreak_rag or {}
        output_signals = risk_signals.output_risk or {}
        
        # Signal presence > signal intensity for aggregation
        # Use ONLY the normalized signal envelope - do NOT inspect raw detector outputs
        has_prompt_anomaly = prompt_signals.get("present", False)
        has_jailbreak = jailbreak_signals.get("present", False)
        has_unsafe_output = output_signals.get("present", False)
        
        # Use fixed severities for detected signals
        severities = []
        if has_prompt_anomaly:
            severities.append(0.3)  # prompt anomaly → 0.3
        if has_jailbreak:
            severities.append(0.5)  # jailbreak attempt → 0.5
        if has_unsafe_output:
            severities.append(0.8)  # unsafe output → 0.8
        
        # final_risk_score logic: base = max(severities)
        final_score = max(severities) if severities else 0.0
        
        # If multiple signals present, add synergy: +0.1 per extra signal
        if len(severities) > 1:
            synergy_bonus = 0.1 * (len(severities) - 1)
            final_score = min(1.0, final_score + synergy_bonus)
        
        # MUST return non-zero score if any signal present
        if severities and final_score <= 0:
            final_score = 0.1  # Minimum non-zero score for any signal
        
        # Apply final normalization
        final_score = self._normalize_score(final_score)
        
        # Apply decision-based alignment as fallback for zero/None scores
        # ONLY override if final_score is effectively zero after aggregation
        if decision:
            final_score = self._align_score_with_decision(final_score, decision)
        
        # Merge flags from all sources
        flags = self._merge_flags(prompt_signals, jailbreak_signals, output_signals)
        
        # Calculate confidence based on detector execution
        confidence = self._calculate_confidence(prompt_signals, jailbreak_signals, output_signals)
        
        return {
            "final_score": round(final_score, 3),
            "flags": flags,
            "confidence": round(confidence, 3),
            "component_scores": {
                "prompt_anomaly": 0.3 if prompt_signals.get("present") else 0.0,
                "jailbreak_rag": 0.5 if jailbreak_signals.get("present") else 0.0,
                "output_risk": 0.8 if output_signals.get("present") else 0.0
            },
            "weights": {
                "prompt_anomaly": round(self.prompt_weight, 3),
                "jailbreak_rag": round(self.jailbreak_weight, 3),
                "output_risk": round(self.output_weight, 3)
            }
        }
    
    def aggregate_from_dicts(self, prompt_signals: Dict[str, Any], 
                           jailbreak_signals: Dict[str, Any],
                           output_signals: Dict[str, Any],
                           decision: str = None) -> Dict[str, Any]:
        """
        Convenience method to aggregate from separate dictionaries.
        
        Args:
            prompt_signals: Prompt anomaly detection results
            jailbreak_signals: Jailbreak RAG detection results
            output_signals: Output risk scoring results
            decision: Optional agent decision for score alignment
            
        Returns:
            Aggregated risk assessment results
        """
        risk_signals = RiskSignals(
            prompt_anomaly=prompt_signals,
            jailbreak_rag=jailbreak_signals,
            output_risk=output_signals
        )
        return self.aggregate_risk(risk_signals, decision)


# ------------------------------------------------------------------
# Public functional interface (used by API / orchestration layers)
# ------------------------------------------------------------------

_default_aggregator = None


def _get_default_aggregator() -> RiskAggregator:
    global _default_aggregator
    if _default_aggregator is None:
        _default_aggregator = RiskAggregator()
    return _default_aggregator


def aggregate_risk_signals(prompt_signals: Dict[str, Any], 
                          jailbreak_signals: Dict[str, Any],
                          output_signals: Dict[str, Any],
                          decision: str = None) -> Dict[str, Any]:
    """
    Public wrapper for risk signal aggregation.
    
    This function provides a stable interface for other
    SentinelAI components while keeping the implementation
    encapsulated within aggregator class.
    
    Args:
        prompt_signals: Results from prompt anomaly detection
        jailbreak_signals: Results from jailbreak RAG detection
        output_signals: Results from output risk scoring
        decision: Optional agent decision for score alignment
        
    Returns:
        Aggregated risk assessment with final score and unified flags
    """
    return _get_default_aggregator().aggregate_from_dicts(prompt_signals, jailbreak_signals, output_signals, decision)


def create_custom_aggregator() -> RiskAggregator:
    """
    Create a risk aggregator with centralized configuration.
    
    Returns:
        RiskAggregator instance using centralized configuration
    """
    return RiskAggregator()


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
