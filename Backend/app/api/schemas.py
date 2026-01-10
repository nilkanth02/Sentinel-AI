from pydantic import BaseModel
from typing import List

class AnalyzeRequest(BaseModel):
    prompt: str
    response: str

class AnalyzeResponse(BaseModel):
    risk_score: float
    flags: List[str]
