from pydantic import BaseModel
from typing import List, Optional, Dict


class AnalyzeRequest(BaseModel):
    prompt: str
    response: str


class AnalyzeResponse(BaseModel):
    final_risk_score: float
    flags: List[str]
    confidence: Optional[float] = None
