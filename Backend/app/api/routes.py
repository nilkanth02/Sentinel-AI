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
from app.signals.registry import SignalRegistry
from app.agent.reasoner import RiskReasoner
from app.policy.engine import PolicyEngine
from app.actions.executor import ActionExecutor

# Create router instance
router = APIRouter()

# Create and configure signal registry
signal_registry = SignalRegistry()
signal_registry.register("prompt_anomaly", detect_prompt_anomaly, "prompt")
signal_registry.register("output_risk", score_output_risk, "output")

# Create agentic pipeline components
risk_reasoner = RiskReasoner()
policy_engine = PolicyEngine()
action_executor = ActionExecutor()


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
    # Step 1: Run prompt signal detectors
    prompt_signals = signal_registry.run_detectors("prompt", prompt=request.prompt)
    
    # Step 2: Run output signal detectors
    output_signals = signal_registry.run_detectors("output", text=request.response)
    
    # Debug print to show signal propagation
    print(f"DEBUG: prompt_signals = {prompt_signals}")
    print(f"DEBUG: output_signals = {output_signals}")
    
    # Step 3: Use aggregator to combine signals into unified assessment
    aggregated_result = aggregate_risk_signals(
        prompt_signals=prompt_signals,
        output_signals=output_signals
    )
    
    # Debug print to show merged flags
    print(f"DEBUG: merged flags = {aggregated_result['flags']}")
    
    # Step 4: Use risk reasoner to analyze aggregated results
    risk_summary = risk_reasoner.analyze_aggregated_result(
        final_risk_score=aggregated_result["final_score"],
        flags=aggregated_result["flags"],
        confidence=aggregated_result.get("confidence", 1.0)
    )
    
    # Step 5: Use policy engine to make decision
    policy_decision = policy_engine.evaluate(risk_summary)
    
    # Step 6: Use action executor to carry out decision
    action_result = action_executor.execute(policy_decision)
    
    # Step 7: Log the analysis result to database (non-blocking)
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
        # Logging failure should not break API response
        print(f"Failed to log risk event: {e}")
    
    # Step 8: Return final analysis results with decision and action
    return AnalyzeResponse(
        final_risk_score=aggregated_result["final_score"],
        flags=aggregated_result["flags"],
        confidence=aggregated_result.get("confidence"),
        decision=policy_decision.action.value,
        action_taken=action_result.action.value,
        decision_reason=policy_decision.explanation
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

