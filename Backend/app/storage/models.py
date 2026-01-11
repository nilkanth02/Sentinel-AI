from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from sqlalchemy.sql import func
from .db import Base


class RiskLog(Base):
    __tablename__ = "risk_logs"

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    prompt = Column(Text)
    response = Column(Text)
    final_risk_score = Column(Float)
    flags = Column(Text)  # JSON string storing risk flags
    confidence = Column(Float, nullable=True)