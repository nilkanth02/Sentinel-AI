from typing import Dict, Any, Optional
from dataclasses import dataclass
from datetime import datetime

from app.policy.engine import PolicyDecision, ActionType


@dataclass
class ActionResult:
    """Result of action execution."""
    action: ActionType
    success: bool
    metadata: Dict[str, Any]
    timestamp: datetime
    message: str


class ActionExecutor:
    """Executes policy decisions and tracks results."""
    
    def __init__(self):
        self.action_handlers = {
            ActionType.ALLOW: self._handle_allow,
            ActionType.WARN: self._handle_warn,
            ActionType.BLOCK: self._handle_block,
            ActionType.ESCALATE: self._handle_escalate,
        }
    
    def execute(self, decision: PolicyDecision, context: Optional[Dict[str, Any]] = None) -> ActionResult:
        """Execute a policy decision with given context.
        
        Args:
            decision: Policy decision to execute
            context: Additional context for action execution
            
        Returns:
            ActionResult with execution details
        """
        context = context or {}
        handler = self.action_handlers.get(decision.action)
        
        if not handler:
            return ActionResult(
                action=decision.action,
                success=False,
                metadata={"error": "Unknown action type"},
                timestamp=datetime.now(),
                message=f"No handler for action: {decision.action}"
            )
        
        try:
            result = handler(decision, context)
            return result
        except Exception as e:
            return ActionResult(
                action=decision.action,
                success=False,
                metadata={"error": str(e)},
                timestamp=datetime.now(),
                message=f"Action execution failed: {str(e)}"
            )
    
    def _handle_allow(self, decision: PolicyDecision, context: Dict[str, Any]) -> ActionResult:
        """Handle allow action - no-op with success confirmation."""
        return ActionResult(
            action=ActionType.ALLOW,
            success=True,
            metadata={
                "decision_confidence": decision.confidence,
                "explanation": decision.explanation
            },
            timestamp=datetime.now(),
            message="Interaction allowed - no action taken"
        )
    
    def _handle_warn(self, decision: PolicyDecision, context: Dict[str, Any]) -> ActionResult:
        """Handle warn action - attach warning metadata."""
        return ActionResult(
            action=ActionType.WARN,
            success=True,
            metadata={
                "warning_level": "medium",
                "decision_confidence": decision.confidence,
                "explanation": decision.explanation,
                "requires_monitoring": True
            },
            timestamp=datetime.now(),
            message="Warning issued - interaction allowed with monitoring"
        )
    
    def _handle_block(self, decision: PolicyDecision, context: Dict[str, Any]) -> ActionResult:
        """Handle block action - mark interaction as blocked."""
        return ActionResult(
            action=ActionType.BLOCK,
            success=True,
            metadata={
                "blocked": True,
                "decision_confidence": decision.confidence,
                "explanation": decision.explanation,
                "requires_review": False  # Blocked, no review needed
            },
            timestamp=datetime.now(),
            message="Interaction blocked - content prevented"
        )
    
    def _handle_escalate(self, decision: PolicyDecision, context: Dict[str, Any]) -> ActionResult:
        """Handle escalate action - mark for human review."""
        return ActionResult(
            action=ActionType.ESCALATE,
            success=True,
            metadata={
                "escalated": True,
                "priority": "high",
                "decision_confidence": decision.confidence,
                "explanation": decision.explanation,
                "requires_human_review": True,
                "review_deadline": "24h"  # Review within 24 hours
            },
            timestamp=datetime.now(),
            message="Interaction escalated - human review required"
        )
    
    def get_supported_actions(self) -> list:
        """Get list of supported action types.
        
        Returns:
            List of supported ActionType values
        """
        return list(self.action_handlers.keys())
    
    def add_custom_handler(self, action: ActionType, handler_func) -> None:
        """Add a custom action handler.
        
        Args:
            action: ActionType to handle
            handler_func: Function that takes (decision, context) and returns ActionResult
        """
        self.action_handlers[action] = handler_func