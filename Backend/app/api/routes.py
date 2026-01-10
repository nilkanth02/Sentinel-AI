"""
FastAPI Routes for Sentinel AI Analysis

This module defines the API routes for analyzing AI prompts and responses
to detect potential risks and anomalies.
"""
print("ROUTES.PY LOADED")

from fastapi import APIRouter
from typing import Dict, Any

from app.api.schemas import AnalyzeRequest, AnalyzeResponse
from app.monitors.prompt_anomaly import detect_prompt_anomaly
from app.scoring.output_risk import score_output_risk
from app.scoring.aggregator import aggregate_risk_signals

# Create router instance
router = APIRouter()


@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_interaction(request: AnalyzeRequest) -> AnalyzeResponse:
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
    
    # Step 4: Return final analysis results
    return AnalyzeResponse(
        final_risk_score=aggregated_result["final_score"],
        flags=aggregated_result["flags"],
        confidence=aggregated_result.get("confidence")
    )



print("ROUTES.PY LOADED")

