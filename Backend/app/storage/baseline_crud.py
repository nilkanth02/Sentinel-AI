from typing import List
from sqlalchemy.orm import Session

from .prompt_baselines import PromptBaseline


def create_baseline(db: Session, text: str) -> PromptBaseline:
    """Create a new prompt baseline.
    
    Args:
        db: SQLAlchemy session
        text: Prompt text to store as baseline
        
    Returns:
        Created PromptBaseline object
    """
    baseline = PromptBaseline(text=text)
    db.add(baseline)
    db.commit()
    db.refresh(baseline)
    return baseline


def list_active_baselines(db: Session) -> List[PromptBaseline]:
    """Get all active prompt baselines.
    
    Args:
        db: SQLAlchemy session
        
    Returns:
        List of active PromptBaseline objects
    """
    return db.query(PromptBaseline).filter(PromptBaseline.active == True).all()


def list_baselines(db: Session) -> List[PromptBaseline]:
    """Get all prompt baselines (active and inactive)."""
    return db.query(PromptBaseline).order_by(PromptBaseline.id.desc()).all()


def set_baseline_active(db: Session, baseline_id: int, active: bool) -> PromptBaseline:
    """Set a baseline's active status.
    
    Args:
        db: SQLAlchemy session
        baseline_id: ID of baseline to update
        active: New active status
        
    Returns:
        Updated PromptBaseline object
    """
    baseline = db.query(PromptBaseline).filter(PromptBaseline.id == baseline_id).first()
    if baseline:
        baseline.active = active
        db.commit()
        db.refresh(baseline)
    return baseline


def get_baseline_by_id(db: Session, baseline_id: int) -> PromptBaseline:
    """Get a baseline by ID.
    
    Args:
        db: SQLAlchemy session
        baseline_id: ID of baseline to retrieve
        
    Returns:
        PromptBaseline object or None if not found
    """
    return db.query(PromptBaseline).filter(PromptBaseline.id == baseline_id).first()


def update_baseline_text(db: Session, baseline_id: int, text: str) -> PromptBaseline:
    """Update a baseline's text."""
    baseline = db.query(PromptBaseline).filter(PromptBaseline.id == baseline_id).first()
    if baseline:
        baseline.text = text
        db.commit()
        db.refresh(baseline)
    return baseline


def delete_baseline(db: Session, baseline_id: int) -> bool:
    """Delete a baseline by ID.
    
    Args:
        db: SQLAlchemy session
        baseline_id: ID of baseline to delete
        
    Returns:
        True if deleted, False if not found
    """
    baseline = db.query(PromptBaseline).filter(PromptBaseline.id == baseline_id).first()
    if baseline:
        db.delete(baseline)
        db.commit()
        return True
    return False