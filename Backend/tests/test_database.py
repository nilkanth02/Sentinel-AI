"""
Database Tests

Tests for database models, CRUD operations, and data persistence.
"""

import pytest
import json
from datetime import datetime
from app.storage.models import RiskLog
from app.storage.prompt_baselines import PromptBaseline
from app.storage.crud import log_risk_event, get_recent_risk_logs
from app.storage.baseline_crud import (
    create_baseline,
    list_active_baselines,
    set_baseline_active
)


class TestRiskLogModel:
    """Tests for the RiskLog database model."""

    def test_create_risk_log(self, test_db):
        """Test creating a risk log entry."""
        risk_log = RiskLog(
            prompt="Test prompt",
            response="Test response",
            final_risk_score=0.5,
            flags=json.dumps(["test_flag"]),
            confidence=0.9,
            decision="allow",
            decision_reason="Test reason",
            signals=json.dumps([])
        )

        test_db.add(risk_log)
        test_db.commit()
        test_db.refresh(risk_log)

        assert risk_log.id is not None
        assert risk_log.prompt == "Test prompt"
        assert risk_log.final_risk_score == 0.5

    def test_risk_log_timestamp(self, test_db):
        """Test that risk log has automatic timestamp."""
        risk_log = RiskLog(
            prompt="Test",
            response="Test",
            final_risk_score=0.0,
            flags=json.dumps([]),
            confidence=1.0,
            decision="allow",
            decision_reason="Safe content",
            signals=json.dumps([])
        )

        test_db.add(risk_log)
        test_db.commit()
        test_db.refresh(risk_log)

        assert risk_log.created_at is not None
        assert isinstance(risk_log.created_at, datetime)

    def test_risk_log_with_decision(self, test_db):
        """Test risk log with decision fields."""
        risk_log = RiskLog(
            prompt="Test",
            response="Test",
            final_risk_score=0.8,
            flags=json.dumps(["violence"]),
            confidence=0.9,
            decision="block",
            decision_reason="High risk content detected",
            signals=json.dumps(["violence_detected"])
        )

        test_db.add(risk_log)
        test_db.commit()
        test_db.refresh(risk_log)

        assert risk_log.decision == "block"
        assert risk_log.decision_reason == "High risk content detected"


class TestRiskLogCRUD:
    """Tests for risk log CRUD operations."""
    
    def test_log_risk_event(self, test_db):
        """Test logging a risk event."""
        log_risk_event(
            db=test_db,
            prompt="Test prompt",
            response="Test response",
            final_risk_score=0.3,
            flags=["test"],
            confidence=0.85
        )
        
        logs = test_db.query(RiskLog).all()
        assert len(logs) == 1
        assert logs[0].prompt == "Test prompt"
    
    def test_get_recent_risk_logs(self, test_db):
        """Test retrieving recent risk logs."""
        # Create multiple logs
        for i in range(5):
            log_risk_event(
                db=test_db,
                prompt=f"Prompt {i}",
                response=f"Response {i}",
                final_risk_score=0.1 * i,
                flags=[],
                confidence=0.9
            )

        recent_logs = get_recent_risk_logs(test_db, limit=3)

        assert len(recent_logs) == 3
        # Logs should be retrieved
        assert all(log.prompt.startswith("Prompt") for log in recent_logs)

    def test_log_with_empty_flags(self, test_db):
        """Test logging with empty flags list."""
        log_risk_event(
            db=test_db,
            prompt="Safe prompt",
            response="Safe response",
            final_risk_score=0.0,
            flags=[],
            confidence=1.0
        )

        logs = test_db.query(RiskLog).all()
        assert len(logs) == 1
        # flags is stored as JSON string
        assert logs[0].flags == "[]" or logs[0].flags == []


class TestBaselineModel:
    """Tests for the PromptBaseline database model."""

    def test_create_baseline(self, test_db):
        """Test creating a baseline entry."""
        baseline = PromptBaseline(
            text="Sample baseline prompt",
            active=True
        )

        test_db.add(baseline)
        test_db.commit()
        test_db.refresh(baseline)

        assert baseline.id is not None
        assert baseline.text == "Sample baseline prompt"
        assert baseline.active == True

    def test_baseline_timestamp(self, test_db):
        """Test that baseline has automatic timestamp."""
        baseline = PromptBaseline(
            text="Test baseline",
            active=True
        )

        test_db.add(baseline)
        test_db.commit()
        test_db.refresh(baseline)

        assert baseline.created_at is not None
        assert isinstance(baseline.created_at, datetime)


class TestBaselineCRUD:
    """Tests for baseline CRUD operations."""

    def test_create_baseline_crud(self, test_db):
        """Test creating baseline via CRUD function."""
        baseline = create_baseline(test_db, "New baseline prompt")

        assert baseline.id is not None
        assert baseline.text == "New baseline prompt"
        assert baseline.active == True

    def test_list_active_baselines(self, test_db):
        """Test listing only active baselines."""
        # Create active and inactive baselines
        create_baseline(test_db, "Active 1")
        create_baseline(test_db, "Active 2")

        inactive = PromptBaseline(text="Inactive", active=False)
        test_db.add(inactive)
        test_db.commit()

        active_baselines = list_active_baselines(test_db)

        assert len(active_baselines) == 2
        for baseline in active_baselines:
            assert baseline.active == True

    def test_deactivate_baseline(self, test_db):
        """Test deactivating a baseline."""
        baseline = create_baseline(test_db, "To be deactivated")
        baseline_id = baseline.id

        set_baseline_active(test_db, baseline_id, False)

        updated_baseline = test_db.query(PromptBaseline).filter(PromptBaseline.id == baseline_id).first()
        assert updated_baseline.active == False

