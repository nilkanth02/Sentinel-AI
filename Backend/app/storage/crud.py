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
):
    """Log a risk analysis event to the database."""
    try:
        risk_log = RiskLog(
            prompt=prompt,
            response=response,
            final_risk_score=final_risk_score,  # ✅ correct DB field
            flags=json.dumps(flags),        # store as JSON string
            confidence=confidence,
        )
        db.add(risk_log)
        db.commit()
        db.refresh(risk_log)
        return risk_log
    except Exception:
        db.rollback()
        raise


def get_recent_risk_logs(db: Session, limit: int = 50):
    """Fetch recent risk logs from the database."""
    return (
        db.query(RiskLog)
        .order_by(RiskLog.created_at.desc())
        .limit(limit)
        .all()
    )
