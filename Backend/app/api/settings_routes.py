"""Legacy compatibility routes for settings.

Settings are now persisted in the DB and served via `settings_service_db`.
This module remains to avoid breaking older imports.
"""

from fastapi import APIRouter, HTTPException
from typing import Dict, Any

from app.services.settings_service_db import settings_service

router = APIRouter()


@router.get("/settings")
async def get_settings() -> Dict[str, Any]:
    return settings_service.get_settings()


@router.put("/settings")
async def update_settings(settings_data: Dict[str, Any]) -> Dict[str, Any]:
    try:
        return settings_service.update_settings(settings_data)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/settings/default")
async def get_default_settings() -> Dict[str, Any]:
    # Same defaults as DB seeding
    return {
        "warn_threshold": 0.3,
        "escalate_threshold": 0.7,
        "confidence_floor": 0.5,
        "signal_weights": {
            "prompt_anomaly": 0.3,
            "jailbreak_attempt": 0.4,
            "unsafe_output": 0.3,
        },
        "enforcement_mode": "warn",
        "version": 1,
    }
