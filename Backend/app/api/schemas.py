from pydantic import BaseModel
from typing import List, Optional, Dict
from datetime import datetime


class AnalyzeRequest(BaseModel):
    prompt: str
    response: str


class AnalyzeResponse(BaseModel):
    final_risk_score: float
    flags: List[str]
    confidence: Optional[float] = None
    decision: Optional[str] = None
    action_taken: Optional[str] = None
    decision_reason: Optional[str] = None


class RiskLogResponse(BaseModel):
    id: int
    created_at: datetime
    final_risk_score: float
    flags: List[str]
    confidence: Optional[float] = None
    
    class Config:
        from_attributes = True
