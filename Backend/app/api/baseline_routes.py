from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.storage.baseline_crud import (
    create_baseline, 
    list_active_baselines, 
    set_baseline_active,
    get_baseline_by_id
)
from app.storage.db import SessionLocal
from pydantic import BaseModel

# Pydantic schemas
class BaselineCreate(BaseModel):
    text: str

class BaselineResponse(BaseModel):
    id: int
    text: str
    active: bool
    
    class Config:
        from_attributes = True

class BaselineUpdate(BaseModel):
    active: bool

# Create router
router = APIRouter(prefix="/baselines", tags=["baselines"])

def get_db():
    """Get database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=BaselineResponse)
async def add_baseline(baseline: BaselineCreate, db: Session = Depends(get_db)):
    """Add a new prompt baseline."""
    created = create_baseline(db, baseline.text)
    return created

@router.get("/", response_model=List[BaselineResponse])
async def list_baselines(db: Session = Depends(get_db)):
    """List all active prompt baselines."""
    baselines = list_active_baselines(db)
    return baselines

@router.patch("/{id}", response_model=BaselineResponse)
async def update_baseline_status(id: int, update: BaselineUpdate, db: Session = Depends(get_db)):
    """Activate or deactivate a baseline."""
    baseline = set_baseline_active(db, id, update.active)
    if not baseline:
        raise HTTPException(status_code=404, detail="Baseline not found")
    return baseline