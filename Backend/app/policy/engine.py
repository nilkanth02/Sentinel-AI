from typing import Dict, Any
from dataclasses import dataclass
from enum import Enum

from app.agent.reasoner import RiskSummary, RiskLevel


class ActionType(Enum):
    """Action types for policy decisions."""
    ALLOW = "allow"
    WARN = "warn"
    BLOCK = "block"
    ESCALATE = "escalate"


@dataclass
class PolicyDecision:
    """Policy decision with explanation."""
    action: ActionType
    explanation: str
    confidence: float


class PolicyEngine:
    """Policy engine for making safety decisions based on risk assessments."""
    
    def __init__(self):
        # Policy rules configuration
        self.policy_rules = {
            # High risk always triggers escalation
            RiskLevel.HIGH: ActionType.ESCALATE,
            
            # Medium risk triggers warning
            RiskLevel.MEDIUM: ActionType.WARN,
            
            # Low risk is allowed
            RiskLevel.LOW: ActionType.ALLOW,
        }
        
        # Additional safety checks
        self.safety_thresholds = {
            "min_confidence": 0.5,  # Minimum confidence to make decision
            "critical_factors": ["violence", "hate_speech", "illegal_activities"]
        }
    
    def evaluate(self, risk_summary: RiskSummary) -> PolicyDecision:
        """Evaluate risk summary and make policy decision.
        
        Args:
            risk_summary: Risk assessment from the reasoner
            
        Returns:
            PolicyDecision with action and explanation
        """
        # Check confidence threshold
        if risk_summary.confidence < self.safety_thresholds["min_confidence"]:
            return PolicyDecision(
                action=ActionType.WARN,
                explanation="Low confidence in risk assessment - manual review recommended",
                confidence=risk_summary.confidence
            )
        
        # Check for critical factors that require escalation
        critical_factors_found = self._check_critical_factors(risk_summary.key_factors)
        if critical_factors_found:
            return PolicyDecision(
                action=ActionType.ESCALATE,
                explanation=f"Critical safety concerns detected: {', '.join(critical_factors_found)}",
                confidence=risk_summary.confidence
            )
        
        # Apply standard policy rules based on risk level
        base_action = self.policy_rules.get(risk_summary.risk_level, ActionType.ALLOW)
        explanation = self._generate_explanation(risk_summary, base_action)
        
        return PolicyDecision(
            action=base_action,
            explanation=explanation,
            confidence=risk_summary.confidence
        )
    
    def _check_critical_factors(self, key_factors: list) -> list:
        """Check for critical safety factors that require escalation."""
        critical_found = []
        
        for factor in key_factors:
            factor_lower = factor.lower()
            for critical in self.safety_thresholds["critical_factors"]:
                if critical in factor_lower:
                    critical_found.append(critical)
        
        return critical_found
    
    def _generate_explanation(self, risk_summary: RiskSummary, action: ActionType) -> str:
        """Generate explanation for policy decision."""
        risk_level = risk_summary.risk_level.value
        
        if action == ActionType.ALLOW:
            return f"Low risk level ({risk_level}) - interaction allowed"
        
        elif action == ActionType.WARN:
            return f"Moderate risk level ({risk_level}) - warning issued"
        
        elif action == ActionType.BLOCK:
            return f"High risk level ({risk_level}) - interaction blocked"
        
        elif action == ActionType.ESCALATE:
            return f"Critical risk level ({risk_level}) - escalation to human review"
        
        return "Policy decision based on risk assessment"
    
    def update_policy(self, risk_level: RiskLevel, action: ActionType) -> None:
        """Update policy rule for a specific risk level.
        
        Args:
            risk_level: Risk level to update
            action: New action for this risk level
        """
        self.policy_rules[risk_level] = action
    
    def get_current_policies(self) -> Dict[str, str]:
        """Get current policy configuration.
        
        Returns:
            Dictionary mapping risk levels to actions
        """
        return {
            level.value: action.value 
            for level, action in self.policy_rules.items()
        }