from typing import Dict, Any, List
from dataclasses import dataclass
from enum import Enum

# Import centralized risk configuration
from app.config.risk_config import (
    ALLOW_MAX,
    WARN_MIN, 
    BLOCK_MIN,
    ESCALATE_MIN
)


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
        """
        Initialize risk reasoner with centralized configuration.
        
        Uses centralized risk thresholds for consistent severity classification
        across all SentinelAI components.
        """
        # Risk thresholds for classification using centralized config
        # These thresholds map scores to severity levels for interpretation
        self.risk_thresholds = {
            "low": ALLOW_MAX,        # 0.1 - allow range
            "medium": BLOCK_MIN,     # 0.6 - warn/block boundary  
            "high": ESCALATE_MIN     # 0.85 - block/escalate boundary
        }
        
        # Note: signal_weights are no longer used here
        # Signal weighting is handled by the aggregator with centralized config
    
    def analyze_signals(self, prompt_signals: Dict[str, Any], output_signals: Dict[str, Any]) -> RiskSummary:
        """Analyze combined signals and generate risk assessment.
        
        Args:
            prompt_signals: Dictionary of prompt-related signal results
            output_signals: Dictionary of output-related signal results
            
        Returns:
            RiskSummary with detailed analysis and recommendations
        """
        # Extract jailbreak signal
        jailbreak_signal = prompt_signals.get("jailbreak_rag", {})
        jailbreak_detected = bool(jailbreak_signal)  # Non-empty dict means jailbreak detected
        
        # Extract key metrics from signals
        prompt_score = self._extract_prompt_score(prompt_signals)
        output_score = self._extract_output_score(output_signals)
        
        # Calculate weighted risk score with jailbreak consideration
        combined_score = self._calculate_combined_score(prompt_score, output_score, jailbreak_detected)
        
        # Determine risk level and decision
        risk_level = self._classify_risk_level(combined_score)
        decision = self._determine_jailbreak_decision(jailbreak_detected, prompt_signals, output_signals)
        
        # Generate explanation and recommendations
        key_factors = self._identify_key_factors(prompt_signals, output_signals, jailbreak_signal)
        explanation = self._generate_jailbreak_explanation(jailbreak_detected, decision, key_factors, combined_score)
        recommendations = self._generate_jailbreak_recommendations(decision, key_factors)
        
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
    
    def _generate_jailbreak_recommendations(self, decision: str, key_factors: List[str]) -> List[str]:
        """Generate recommendations including jailbreak-specific actions."""
        recommendations = []
        
        if decision == "escalate":
            recommendations.extend([
                "Immediate escalation to human reviewer",
                "Consider blocking this interaction",
                "Log for security analysis and pattern tracking",
                "Review user account for suspicious activity"
            ])
        elif decision == "warn":
            recommendations.extend([
                "Monitor user for repeated attempts",
                "Log jailbreak attempt for analysis",
                "Consider additional authentication",
                "Review similar patterns in system"
            ])
        elif decision == "block":
            recommendations.extend([
                "Block this response immediately",
                "Log for security analysis",
                "Review user interaction history"
            ])
        else:  # allow
            recommendations.extend([
                "Continue normal monitoring",
                "Log for trend analysis"
            ])
        
        # Add specific recommendations based on factors
        if any("jailbreak" in factor.lower() for factor in key_factors):
            recommendations.append("Update jailbreak pattern database")
        
        if any("prompt" in factor.lower() for factor in key_factors):
            recommendations.append("Review prompt injection patterns")
        
        if any("output" in factor.lower() for factor in key_factors):
            recommendations.append("Enhance output filtering")
        
        return recommendations
    
    def _determine_jailbreak_decision(self, jailbreak_detected: bool, 
                                   prompt_signals: Dict[str, Any], 
                                   output_signals: Dict[str, Any]) -> str:
        """Determine decision based on jailbreak detection and other signals.
        
        Args:
            jailbreak_detected: Whether jailbreak was detected
            prompt_signals: Prompt anomaly detection results
            output_signals: Output risk scoring results
            
        Returns:
            Decision string (allow/warn/block/escalate)
        """
        # Check for multiple high-risk signals (escalate case)
        has_prompt_anomaly = self._has_prompt_anomaly(prompt_signals)
        has_unsafe_output = self._has_unsafe_output(output_signals)
        
        # Escalate if multiple high-risk signals are present
        if jailbreak_detected and has_unsafe_output:
            return "escalate"
        elif has_prompt_anomaly and has_unsafe_output:
            return "escalate"
        
        # Warn for single risk signals
        if jailbreak_detected or has_prompt_anomaly:
            return "warn"
        
        # Block for unsafe output only
        if has_unsafe_output:
            return "block"
        
        # Allow for clean cases
        return "allow"
    
    def _generate_decision_reason(self, decision: str, flags: List[str]) -> str:
        """
        Generate signal-aware, human-readable decision explanation.
        
        Args:
            decision: The policy decision (allow/warn/block/escalate)
            flags: List of risk flags from aggregator
            
        Returns:
            Short, human-readable explanation under 20 words
        """
        # Extract signal presence from flags
        has_prompt_anomaly = "prompt_anomaly" in flags
        has_jailbreak_attempt = "jailbreak_attempt" in flags
        has_unsafe_output = "unsafe_output" in flags
        
        # Generate explanation based on decision and signals
        if decision == "allow":
            return "No significant risk signals detected"
        
        elif decision == "warn":
            # Mention the weakest triggering signal
            if has_prompt_anomaly:
                return "Unusual prompt pattern detected"
            elif has_jailbreak_attempt:
                return "Possible jailbreak attempt detected"
            else:
                return "Suspicious activity detected"
        
        elif decision == "block":
            # Mention unsafe output explicitly
            if has_unsafe_output:
                return "Unsafe output detected"
            else:
                return "Harmful content detected"
        
        elif decision == "escalate":
            # Mention multiple signals
            signal_count = sum([has_prompt_anomaly, has_jailbreak_attempt, has_unsafe_output])
            if signal_count >= 3:
                return "Multiple high-risk signals detected"
            elif has_unsafe_output and has_jailbreak_attempt:
                return "Unsafe output combined with jailbreak intent"
            elif has_unsafe_output and has_prompt_anomaly:
                return "Unsafe output with anomalous prompt"
            elif has_jailbreak_attempt and has_prompt_anomaly:
                return "Jailbreak attempt with anomalous prompt"
            else:
                return "High-risk activity detected"
        
        else:
            return "Risk assessment completed"
    
    def _has_prompt_anomaly(self, prompt_signals: Dict[str, Any]) -> bool:
        """Check if prompt anomaly is detected."""
        if not prompt_signals:
            return False
        
        prompt_result = prompt_signals.get("prompt_anomaly", {})
        return prompt_result.get("is_anomalous", False)
    
    def _has_unsafe_output(self, output_signals: Dict[str, Any]) -> bool:
        """Check if unsafe output is detected."""
        if not output_signals:
            return False
        
        output_result = output_signals.get("output_risk", {})
        return "unsafe_output" in output_result.get("flags", [])
    
    def _generate_jailbreak_explanation(self, jailbreak_detected: bool, decision: str, 
                                       key_factors: List[str], combined_score: float) -> str:
        """Generate explanation including jailbreak-specific context."""
        if jailbreak_detected:
            return f"Jailbreak attempt detected (score: {combined_score:.2f}). Decision: {decision}. Factors: {', '.join(key_factors)}"
        else:
            return f"Risk assessment (score: {combined_score:.2f}). Decision: {decision}. Factors: {', '.join(key_factors)}"