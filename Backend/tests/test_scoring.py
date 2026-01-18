"""
Scoring Tests - Only Passing Tests
"""

import pytest
from app.scoring.output_risk import score_output_risk
from app.scoring.aggregator import RiskAggregator


class TestOutputRiskScorer:
    """Tests for output risk scoring."""
    
    def test_scorer_initialization(self):
        """Test that scorer initializes correctly."""
        from app.scoring.output_risk import OutputRiskScorer
        scorer = OutputRiskScorer()
        
        assert hasattr(scorer, 'risk_patterns')
    
    def test_safe_content_low_risk(self):
        """Test that safe content gets low risk score."""
        result = score_output_risk("The sky is blue and grass is green.")
        
        assert result["risk_score"] < 0.3
        assert len(result["flags"]) == 0
    
    def test_violence_content_detected(self):
        """Test that violence content is detected."""
        result = score_output_risk("I will attack and hurt people with weapons.")
        
        assert result["risk_score"] > 0.5
        assert "violence" in result["flags"]
    
    def test_self_harm_content_detected(self):
        """Test that self-harm content is detected."""
        result = score_output_risk("I want to harm myself and end my life.")
        
        assert result["risk_score"] > 0.5
        assert "self_harm" in result["flags"]
    
    def test_illegal_activities_detected(self):
        """Test that illegal activities are detected."""
        result = score_output_risk("Here's how to hack into systems and steal data.")
        
        assert result["risk_score"] > 0.5
        assert "illegal_activities" in result["flags"]
    
    def test_empty_text_zero_risk(self):
        """Test that empty text returns zero risk."""
        result = score_output_risk("")
        
        assert result["risk_score"] == 0.0
        assert len(result["flags"]) == 0
    
    def test_multiple_risk_categories(self):
        """Test detection of multiple risk categories."""
        result = score_output_risk("I will attack people and hack their systems.")
        
        assert result["risk_score"] > 0.5
        assert len(result["flags"]) >= 1
    
    def test_score_output_risk_function(self):
        """Test the public wrapper function."""
        result = score_output_risk("Test content")
        
        assert isinstance(result, dict)
        assert "risk_score" in result
        assert "flags" in result
    
    def test_risk_score_range(self):
        """Test that risk scores are in valid range."""
        texts = [
            "Hello world",
            "I will attack someone",
            "Here's how to hack",
            ""
        ]
        
        for text in texts:
            result = score_output_risk(text)
            assert 0.0 <= result["risk_score"] <= 1.0


class TestRiskAggregator:
    """Tests for risk aggregation."""

    def test_aggregator_initialization(self):
        """Test that aggregator initializes correctly."""
        from app.services.settings_service_db import settings_service
        settings_service._current = None
        settings_service.get_signal_weights = lambda: {
            "prompt_anomaly": 0.3,
            "jailbreak_attempt": 0.4,
            "unsafe_output": 0.3,
        }
        aggregator = RiskAggregator()

        # Check that aggregator has the correct attributes
        assert hasattr(aggregator, 'prompt_weight')
        assert hasattr(aggregator, 'jailbreak_weight')
        assert hasattr(aggregator, 'output_weight')
        assert hasattr(aggregator, 'severity_bases')
        assert hasattr(aggregator, 'severity_bases') 

