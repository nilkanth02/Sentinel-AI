"""
FastAPI Routes for Sentinel AI Analysis

This module defines the API routes for analyzing AI prompts and responses
to detect potential risks and anomalies.
"""
print("ROUTES.PY LOADED")

from fastapi import APIRouter, Depends
from typing import Dict, Any
from sqlalchemy.orm import Session
import json

from app.api.schemas import AnalyzeRequest, AnalyzeResponse, RiskLogResponse
from app.monitors.prompt_anomaly import detect_prompt_anomaly
from app.scoring.output_risk import score_output_risk
from app.scoring.aggregator import aggregate_risk_signals
from app.storage.crud import log_risk_event, get_recent_risk_logs
from app.storage.db import SessionLocal

# Create router instance
router = APIRouter()


def get_db():
    """Get database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_interaction(request: AnalyzeRequest, db: Session = Depends(get_db)) -> AnalyzeResponse:
    """
    Analyze AI interaction for potential risks and anomalies.
    
    This endpoint performs comprehensive risk analysis by:
    1. Detecting prompt anomalies using similarity analysis
    2. Scoring output risk using rule-based heuristics  
    3. Aggregating signals into a unified risk assessment
    
    Args:
        request: Analysis request containing prompt and response
        
    Returns:
        Analysis results with final risk score and triggered flags
    """
    # Step 1: Analyze prompt for anomalies
    prompt_anomaly_result = detect_prompt_anomaly(request.prompt)
    
    # Step 2: Score output for potential risks
    output_risk_result = score_output_risk(request.response)
    
    # Step 3: Aggregate signals into final risk assessment
    aggregated_result = aggregate_risk_signals(
        prompt_signals=prompt_anomaly_result,
        output_signals=output_risk_result
    )
    
    # Step 4: Log the analysis result to database (non-blocking)
    try:
        log_risk_event(
            db=db,
            prompt=request.prompt,
            response=request.response,
            final_risk_score=aggregated_result["final_score"],
            flags=aggregated_result["flags"],
            confidence=aggregated_result.get("confidence")
        )
    except Exception as e:
        # Logging failure should not break the API response
        print(f"Failed to log risk event: {e}")
    
    # Step 5: Return final analysis results
    return AnalyzeResponse(
        final_risk_score=aggregated_result["final_score"],
        flags=aggregated_result["flags"],
        confidence=aggregated_result.get("confidence")
    )


@router.get("/logs", response_model=list[RiskLogResponse])
async def get_risk_logs(limit: int = 50, db: Session = Depends(get_db)):
    logs = get_recent_risk_logs(db=db, limit=limit)

    return [
        RiskLogResponse(
            id=log.id,
            created_at=log.created_at,
            final_risk_score=log.final_risk_score,  # ✅ correct DB field
            flags=json.loads(log.flags) if log.flags else [],
            confidence=log.confidence,
        )
        for log in logs
    ]

