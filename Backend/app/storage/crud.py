from sqlalchemy.orm import Session
from app.storage.models import RiskLog
import json
from typing import List, Optional


def log_risk_event(
    db: Session,
    prompt: str,
    response: str,
    final_risk_score: float,
    flags: List[str],
    confidence: Optional[float] = None,
    decision: str = None,
    decision_reason: str = None,
    signals: List[str] = None,
):
    """Log a risk analysis event to the database with full audit information."""
    try:
        risk_log = RiskLog(
            prompt=prompt,
            response=response,
            final_risk_score=final_risk_score,  # Keep existing field
            flags=json.dumps(flags),        # Legacy field
            confidence=confidence,            # Keep existing field
            # created_at is auto-managed by database
            decision=decision or "unknown",  # New audit field
            decision_reason=decision_reason or "No reason provided",  # New audit field
            signals=json.dumps(signals or []),  # New audit field - as JSON
        )
        db.add(risk_log)
        db.commit()
        db.refresh(risk_log)
        return risk_log
    except Exception as e:
        # On failure: rollback and re-raise
        db.rollback()
        raise e


def get_recent_risk_logs(db: Session, limit: int = 50):
    """Fetch recent risk logs from the database."""
    return (
        db.query(RiskLog)
        .order_by(RiskLog.created_at.desc())
        .limit(limit)
        .all()
    )
