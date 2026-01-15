from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.storage.baseline_crud import (
    create_baseline, 
    list_active_baselines, 
    list_baselines,
    set_baseline_active,
    get_baseline_by_id,
    delete_baseline,
    update_baseline_text,
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
    active: bool | None = None
    text: str | None = None

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
async def list_baselines_route(include_inactive: bool = False, db: Session = Depends(get_db)):
    """List prompt baselines.

    By default returns active baselines only. Use include_inactive=true to return all.
    """
    baselines = list_baselines(db) if include_inactive else list_active_baselines(db)
    return baselines

@router.get("/{id}", response_model=BaselineResponse)
async def get_baseline(id: int, db: Session = Depends(get_db)):
    baseline = get_baseline_by_id(db, id)
    if not baseline:
        raise HTTPException(status_code=404, detail="Baseline not found")
    return baseline

@router.patch("/{id}", response_model=BaselineResponse)
async def update_baseline(id: int, update: BaselineUpdate, db: Session = Depends(get_db)):
    """Update a baseline (active and/or text)."""
    baseline = get_baseline_by_id(db, id)
    if not baseline:
        raise HTTPException(status_code=404, detail="Baseline not found")

    if update.text is not None:
        baseline = update_baseline_text(db, id, update.text)
        if not baseline:
            raise HTTPException(status_code=404, detail="Baseline not found")

    if update.active is not None:
        baseline = set_baseline_active(db, id, update.active)
        if not baseline:
            raise HTTPException(status_code=404, detail="Baseline not found")

    return baseline

@router.delete("/{id}")
async def delete_baseline_route(id: int, db: Session = Depends(get_db)):
    deleted = delete_baseline(db, id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Baseline not found")
    return {"success": True}