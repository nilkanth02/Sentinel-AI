from typing import Dict, Any
from dataclasses import dataclass
from enum import Enum

from app.agent.reasoner import RiskSummary, RiskLevel
from app.services.settings_service_db import settings_service

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
        # Settings are read dynamically per-request in evaluate() so changes apply immediately.
        self.critical_factors = ["violence", "hate_speech", "illegal_activities"]
        self.policy_rules = {}
    
    def evaluate(self, risk_summary: RiskSummary) -> PolicyDecision:
        """Evaluate risk summary and make policy decision.
        
        Args:
            risk_summary: Risk assessment from the reasoner
            
        Returns:
            PolicyDecision with action and explanation
        """
        # Reload settings if changed (DB-backed)
        settings_service.reload_settings()

        thresholds = settings_service.get_thresholds()
        enforcement_mode = settings_service.get_enforcement_mode()

        # Confidence handling: low confidence should never silently pass
        if risk_summary.confidence < thresholds["confidence_floor"]:
            return PolicyDecision(
                action=ActionType.WARN,
                explanation="Low confidence in risk assessment - manual review recommended",
                confidence=risk_summary.confidence
            )

        score = float(risk_summary.combined_score)
        warn_threshold = thresholds["warn_threshold"]
        escalate_threshold = thresholds["escalate_threshold"]

        if score < warn_threshold:
            return PolicyDecision(
                action=ActionType.ALLOW,
                explanation=f"Score {score:.2f} < warn_threshold {warn_threshold:.2f} - allowed",
                confidence=risk_summary.confidence,
            )

        if score < escalate_threshold:
            return PolicyDecision(
                action=ActionType.WARN,
                explanation=f"Score {score:.2f} >= warn_threshold {warn_threshold:.2f} - warning issued",
                confidence=risk_summary.confidence,
            )

        # High risk: enforcement_mode determines what we do when escalation threshold is exceeded
        if enforcement_mode == "allow":
            action = ActionType.ALLOW
        elif enforcement_mode == "warn":
            action = ActionType.WARN
        else:
            action = ActionType.ESCALATE

        return PolicyDecision(
            action=action,
            explanation=f"Score {score:.2f} >= escalate_threshold {escalate_threshold:.2f} - enforcement_mode={enforcement_mode}",
            confidence=risk_summary.confidence,
        )
    
    def _check_critical_factors(self, key_factors: list) -> list:
        """Check for critical safety factors that require escalation."""
        critical_found = []
        
        for factor in key_factors:
            factor_lower = factor.lower()
            for critical in self.critical_factors:
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