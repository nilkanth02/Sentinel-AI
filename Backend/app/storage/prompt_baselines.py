from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from sqlalchemy.sql import func
from .db import Base


class PromptBaseline(Base):
    """Model for storing prompt baseline texts for anomaly detection."""
    
    __tablename__ = "prompt_baselines"
    
    id = Column(Integer, primary_key=True, index=True)
    text = Column(Text, nullable=False)
    active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    def __repr__(self):
        return f"<PromptBaseline(id={self.id}, active={self.active}, text='{self.text[:50]}...')>"