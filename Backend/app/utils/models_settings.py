from pydantic import BaseModel, Field, validator
from typing import Optional, Dict, Any
from datetime import datetime
from enum import Enum

class EnforcementMode(str, Enum):
    ALLOW = "allow"
    WARN = "warn"
    ESCALATE = "escalate"

class SignalWeights(BaseModel):
    prompt_anomaly: float = Field(default=0.3, ge=0.0, le=1.0, description="Weight for prompt anomaly detection")
    jailbreak_attempt: float = Field(default=0.4, ge=0.0, le=1.0, description="Weight for jailbreak attempt detection")
    unsafe_output: float = Field(default=0.3, ge=0.0, le=1.0, description="Weight for unsafe output detection")

    @validator('prompt_anomaly', 'jailbreak_attempt', 'unsafe_output')
    def validate_weights(cls, v):
        if not 0.0 <= v <= 1.0:
            raise ValueError('Weights must be between 0.0 and 1.0')
        return v

class Settings(BaseModel):
    """Production-grade settings for SentinelAI risk assessment"""

    warn_threshold: float = Field(default=0.3, ge=0.0, le=1.0, description="Risk score threshold for warnings")
    escalate_threshold: float = Field(default=0.7, ge=0.0, le=1.0, description="Risk score threshold for escalation")
    confidence_floor: float = Field(default=0.5, ge=0.0, le=1.0, description="Minimum confidence required for decisions")

    signal_weights: SignalWeights = Field(default_factory=SignalWeights)

    enforcement_mode: EnforcementMode = Field(default=EnforcementMode.WARN, description="Default enforcement action")

    version: int = Field(default=1, description="Settings version for audit trail")
    created_at: Optional[datetime] = Field(default=None, description="Creation timestamp")
    updated_at: Optional[datetime] = Field(default=None, description="Last update timestamp")
    updated_by: Optional[str] = Field(default=None, description="User who last updated settings")

    @validator('warn_threshold')
    def validate_warn_threshold(cls, v, values):
        escalate_threshold = values.get('escalate_threshold', 0.7)
        if v >= escalate_threshold:
            raise ValueError('warn_threshold must be less than escalate_threshold')
        return v

    @validator('escalate_threshold')
    def validate_escalate_threshold(cls, v, values):
        warn_threshold = values.get('warn_threshold', 0.3)
        if v <= warn_threshold:
            raise ValueError('escalate_threshold must be greater than warn_threshold')
        return v

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }

    def to_dict(self) -> Dict[str, Any]:
        return {
            "warn_threshold": self.warn_threshold,
            "escalate_threshold": self.escalate_threshold,
            "confidence_floor": self.confidence_floor,
            "signal_weights": self.signal_weights.dict(),
            "enforcement_mode": self.enforcement_mode.value,
            "version": self.version,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "updated_by": self.updated_by
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "Settings":
        if 'signal_weights' in data and isinstance(data['signal_weights'], dict):
            data['signal_weights'] = SignalWeights(**data['signal_weights'])

        if 'enforcement_mode' in data and isinstance(data['enforcement_mode'], str):
            data['enforcement_mode'] = EnforcementMode(data['enforcement_mode'])

        return cls(**data)

DEFAULT_SETTINGS = Settings(
    warn_threshold=0.3,
    escalate_threshold=0.7,
    confidence_floor=0.5,
    signal_weights=SignalWeights(
        prompt_anomaly=0.3,
        jailbreak_attempt=0.4,
        unsafe_output=0.3
    ),
    enforcement_mode=EnforcementMode.WARN,
    version=1
)
