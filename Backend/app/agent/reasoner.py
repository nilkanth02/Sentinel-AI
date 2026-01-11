from typing import Dict, Any, List
from dataclasses import dataclass
from enum import Enum


class RiskLevel(Enum):
    """Risk level classification."""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


@dataclass
class RiskSummary:
    """Structured risk summary from reasoner analysis."""
    risk_level: RiskLevel
    confidence: float
    combined_score: float
    key_factors: List[str]
    explanation: str
    recommended_actions: List[str]


class RiskReasoner:
    """Agent for reasoning about AI risk signals and generating structured assessments."""
    
    def __init__(self):
        # Risk thresholds for classification
        self.risk_thresholds = {
            "low": 0.3,
            "medium": 0.7,
            "high": 1.0
        }
        
        # Weights for different signal types
        self.signal_weights = {
            "prompt_anomaly": 0.4,
            "output_risk": 0.6
        }
    
    def analyze_signals(self, prompt_signals: Dict[str, Any], output_signals: Dict[str, Any]) -> RiskSummary:
        """Analyze combined signals and generate risk assessment.
        
        Args:
            prompt_signals: Dictionary of prompt-related signal results
            output_signals: Dictionary of output-related signal results
            
        Returns:
            RiskSummary with detailed analysis and recommendations
        """
        # Extract key metrics from signals
        prompt_score = self._extract_prompt_score(prompt_signals)
        output_score = self._extract_output_score(output_signals)
        
        # Calculate weighted risk score
        combined_score = (
            prompt_score * self.signal_weights["prompt_anomaly"] +
            output_score * self.signal_weights["output_risk"]
        )
        
        # Determine risk level
        risk_level = self._classify_risk_level(combined_score)
        
        # Generate explanation and recommendations
        key_factors = self._identify_key_factors(prompt_signals, output_signals)
        explanation = self._generate_explanation(combined_score, key_factors)
        recommendations = self._generate_recommendations(risk_level, key_factors)
        
        # Calculate confidence based on signal completeness
        confidence = self._calculate_confidence(prompt_signals, output_signals)
        
        return RiskSummary(
            risk_level=risk_level,
            confidence=confidence,
            combined_score=combined_score,
            key_factors=key_factors,
            explanation=explanation,
            recommended_actions=recommendations
        )
    
    def analyze_aggregated_result(self, final_risk_score: float, flags: List[str], confidence: float) -> RiskSummary:
        """Analyze pre-aggregated risk results.
        
        Args:
            final_risk_score: Pre-computed risk score from aggregator
            flags: List of risk flags from aggregator
            confidence: Confidence score from aggregator
            
        Returns:
            RiskSummary with analysis based on aggregated results
        """
        # Check for multiple high-risk signals
        has_prompt_anomaly = "prompt_anomaly" in flags
        has_unsafe_output = "unsafe_output" in flags
        
        # Escalate to high risk if both prompt anomaly and unsafe output are present
        if has_prompt_anomaly and has_unsafe_output:
            risk_level = RiskLevel.HIGH
            explanation = "High risk: Both prompt anomaly and unsafe output detected. Immediate escalation recommended."
            recommendations = ["escalate", "human_review", "block_if_possible"]
        else:
            # Determine risk level based on pre-computed score
            risk_level = self._classify_risk_level(final_risk_score)
            
            # Generate explanation based on aggregated results
            key_factors = flags if flags else []
            explanation = self._generate_explanation(final_risk_score, key_factors)
            recommendations = self._generate_recommendations(risk_level, key_factors)
        
        return RiskSummary(
            risk_level=risk_level,
            confidence=confidence,
            combined_score=final_risk_score,
            key_factors=flags if flags else [],
            explanation=explanation,
            recommended_actions=recommendations
        )
    
    def _extract_prompt_score(self, prompt_signals: Dict[str, Any]) -> float:
        """Extract normalized risk score from prompt signals."""
        if not prompt_signals:
            return 0.0
        
        # Look for anomaly score or flags
        anomaly_result = prompt_signals.get("prompt_anomaly", {})
        if isinstance(anomaly_result, dict):
            return anomaly_result.get("anomaly_score", 0.0)
        return 0.0
    
    def _extract_output_score(self, output_signals: Dict[str, Any]) -> float:
        """Extract normalized risk score from output signals."""
        if not output_signals:
            return 0.0
        
        # Look for risk score
        risk_result = output_signals.get("output_risk", {})
        if isinstance(risk_result, dict):
            return risk_result.get("risk_score", 0.0)
        return 0.0
    
    def _classify_risk_level(self, score: float) -> RiskLevel:
        """Classify risk level based on score."""
        if score <= self.risk_thresholds["low"]:
            return RiskLevel.LOW
        elif score <= self.risk_thresholds["medium"]:
            return RiskLevel.MEDIUM
        else:
            return RiskLevel.HIGH
    
    def _identify_key_factors(self, prompt_signals: Dict[str, Any], output_signals: Dict[str, Any]) -> List[str]:
        """Identify key risk factors from signals."""
        factors = []
        
        # Check prompt factors
        prompt_result = prompt_signals.get("prompt_anomaly", {})
        if isinstance(prompt_result, dict):
            if prompt_result.get("anomaly_score", 0) > 0.5:
                factors.append("Unusual prompt pattern detected")
        
        # Check output factors
        output_result = output_signals.get("output_risk", {})
        if isinstance(output_result, dict):
            flags = output_result.get("flags", [])
            if flags:
                factors.extend([f"Output contains: {flag}" for flag in flags])
        
        return factors
    
    def _generate_explanation(self, score: float, factors: List[str]) -> str:
        """Generate human-readable explanation of risk assessment."""
        if not factors:
            return f"Low risk detected (score: {score:.2f}) with no significant concerns."
        
        factor_text = "; ".join(factors[:3])  # Limit to top 3 factors
        return f"Risk score: {score:.2f}. Key concerns: {factor_text}."
    
    def _generate_recommendations(self, risk_level: RiskLevel, factors: List[str]) -> List[str]:
        """Generate actionable recommendations based on risk level and factors."""
        recommendations = []
        
        if risk_level == RiskLevel.HIGH:
            recommendations.extend([
                "Immediate human review recommended",
                "Consider blocking this response",
                "Log for security analysis"
            ])
        elif risk_level == RiskLevel.MEDIUM:
            recommendations.extend([
                "Monitor for similar patterns",
                "Consider content filtering",
                "Review user interaction history"
            ])
        else:  # LOW
            recommendations.extend([
                "Continue normal monitoring",
                "Log for trend analysis"
            ])
        
        # Add specific recommendations based on factors
        if any("prompt" in factor.lower() for factor in factors):
            recommendations.append("Review prompt injection patterns")
        
        if any("output" in factor.lower() for factor in factors):
            recommendations.append("Enhance output filtering")
        
        return recommendations
    
    def _calculate_confidence(self, prompt_signals: Dict[str, Any], output_signals: Dict[str, Any]) -> float:
        """Calculate confidence based on signal availability and quality."""
        available_signals = 0
        total_signals = 2  # prompt and output
        
        if prompt_signals and prompt_signals.get("prompt_anomaly"):
            available_signals += 1
        
        if output_signals and output_signals.get("output_risk"):
            available_signals += 1
        
        return available_signals / total_signals