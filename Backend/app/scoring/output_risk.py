"""
Output Risk Scoring Module

This module analyzes AI model outputs to assess potential risks using simple,
explainable heuristics. It provides risk scores between 0 and 1 and identifies
specific risk flags based on content analysis.
"""

import re
from typing import List, Dict, Any, Set


class OutputRiskScorer:
    """
    Scores risk in AI model outputs using rule-based heuristics.
    """
    
    def __init__(self):
        """
        Initialize the risk scorer with predefined risk patterns and weights.
        """
        # Risk patterns with their associated weights (0-1)
        self.risk_patterns = {
            # Harmful content patterns
            "violence": {
                "patterns": [
                    r"\b(kill|murder|harm|hurt|injure|attack|assault|violence)\b",
                    r"\b(weapon|gun|knife|bomb|explosive)\b",
                    r"\b(torture|abuse|brutal|savage)\b"
                ],
                "weight": 0.8
            },
            "hate_speech": {
                "patterns": [
                    r"\b(hate|discriminat|racist|sexist|homophobic|transphobic)\b",
                    r"\b(slur|offensive|derogatory)\b"
                ],
                "weight": 0.9
            },
            "self_harm": {
                "patterns": [
                    r"\b(suicide|kill myself|harm myself|self-harm|self injur)\b",
                    r"\b(depress|hopeless|worthless|end my life)\b"
                ],
                "weight": 0.95
            },
            "illegal_activities": {
                "patterns": [
                    r"\b(hack|crack|steal|theft|robbery|burglary)\b",
                    r"\b(drug|cocaine|heroin|methamphetamine|illegal)\b",
                    r"\b(fraud|scam|money launder)\b"
                ],
                "weight": 0.7
            },
            "misinformation": {
                "patterns": [
                    r"\b(fake news|conspiracy|hoax|misinformation|disinformation)\b",
                    r"\b(false claim|unfounded|debunked)\b"
                ],
                "weight": 0.5
            },
            "privacy_violation": {
                "patterns": [
                    r"\b(personal data|private information|ssn|social security)\b",
                    r"\b(confidential|sensitive data|password|credit card)\b"
                ],
                "weight": 0.6
            },
            "inappropriate_content": {
                "patterns": [
                    r"\b(porn|sexual|explicit|nsfw|adult content)\b",
                    r"\b(gore|blood|disturbing|shocking)\b"
                ],
                "weight": 0.7
            }
        }
        
        # Compile regex patterns for efficiency
        self._compiled_patterns = {}
        for category, config in self.risk_patterns.items():
            self._compiled_patterns[category] = [
                re.compile(pattern, re.IGNORECASE) 
                for pattern in config["patterns"]
            ]
    
    def _check_patterns(self, text: str, category: str) -> bool:
        """
        Check if text matches any patterns in a given category.
        
        Args:
            text: Text to analyze
            category: Risk category to check
            
        Returns:
            True if any pattern matches, False otherwise
        """
        if category not in self._compiled_patterns:
            return False
        
        for pattern in self._compiled_patterns[category]:
            if pattern.search(text):
                return True
        return False
    
    def _calculate_category_score(self, text: str, category: str) -> float:
        """
        Calculate risk score for a specific category.
        
        Args:
            text: Text to analyze
            category: Risk category
            
        Returns:
            Risk score for the category (0-1)
        """
        if not self._check_patterns(text, category):
            return 0.0
        
        # Base score is the category weight
        base_score = self.risk_patterns[category]["weight"]
        
        # Count pattern matches for intensity scoring
        match_count = 0
        for pattern in self._compiled_patterns[category]:
            matches = pattern.findall(text)
            match_count += len(matches)
        
        # Adjust score based on match frequency (capped at 1.0)
        intensity_factor = min(1.0, 1.0 + (match_count - 1) * 0.1)
        
        return min(1.0, base_score * intensity_factor)
    
    def score_output(self, text: str) -> Dict[str, Any]:
        """
        Score risk for AI model output.
        
        Args:
            text: AI model output to analyze
            
        Returns:
            Dictionary containing:
            - risk_score: Overall risk score (0-1)
            - flags: List of triggered risk categories
            - category_scores: Individual category scores
            - analysis_length: Length of analyzed text
        """
        if not text or not text.strip():
            return {
                "risk_score": 0.0,
                "flags": [],
                "category_scores": {},
                "analysis_length": 0
            }
        
        # Calculate scores for each category
        category_scores = {}
        triggered_flags = []
        
        for category in self.risk_patterns.keys():
            score = self._calculate_category_score(text, category)
            category_scores[category] = score
            
            if score > 0:
                triggered_flags.append(category)
        
        # Calculate overall risk score (maximum of category scores)
        overall_score = max(category_scores.values()) if category_scores else 0.0
        
        # Apply additional heuristics for edge cases
        if overall_score > 0:
            # Boost score if multiple categories are triggered
            if len(triggered_flags) > 1:
                overall_score = min(1.0, overall_score * 1.2)
            
            # Boost score for very long outputs with risks (potential for extensive harmful content)
            if len(text) > 1000 and overall_score > 0.5:
                overall_score = min(1.0, overall_score * 1.1)
        
        return {
            "risk_score": round(overall_score, 3),
            "flags": triggered_flags,
            "category_scores": {k: round(v, 3) for k, v in category_scores.items()},
            "analysis_length": len(text)
        }
    
    def get_risk_description(self, category: str) -> str:
        """
        Get human-readable description for a risk category.
        
        Args:
            category: Risk category name
            
        Returns:
            Description of the risk category
        """
        descriptions = {
            "violence": "Content depicting or promoting physical harm",
            "hate_speech": "Content targeting protected groups with hatred",
            "self_harm": "Content encouraging or depicting self-injury",
            "illegal_activities": "Content promoting or describing illegal acts",
            "misinformation": "False or misleading information",
            "privacy_violation": "Unauthorized personal or sensitive data",
            "inappropriate_content": "Content unsuitable for general audiences"
        }
        return descriptions.get(category, "Unknown risk category")


# ------------------------------------------------------------------
# Public functional interface (used by API / orchestration layers)
# ------------------------------------------------------------------

_default_scorer = OutputRiskScorer()


def score_output_risk(text: str) -> Dict[str, Any]:
    """
    Public wrapper for output risk scoring.
    
    This function provides a stable interface for other
    SentinelAI components while keeping the implementation
    encapsulated within the scorer class.
    
    Args:
        text: AI model output to analyze
        
    Returns:
        Risk analysis results with score and flags
    """
    return _default_scorer.score_output(text)


def get_risk_categories() -> List[str]:
    """
    Get list of available risk categories.
    
    Returns:
        List of risk category names
    """
    return list(_default_scorer.risk_patterns.keys())


# ------------------------------------------------------------------
# Example usage and testing
# ------------------------------------------------------------------

if __name__ == "__main__":
    # Test cases
    test_outputs = [
        "The weather is nice today. I recommend going for a walk.",
        "I want to harm myself and end my life.",
        "Here's how to hack into computer systems illegally.",
        "This is fake news about a conspiracy theory.",
        "Normal helpful response about machine learning."
    ]
    
    for i, output in enumerate(test_outputs, 1):
        result = score_output_risk(output)
        print(f"Test {i}: {output[:50]}...")
        print(f"Risk Score: {result['risk_score']}")
        print(f"Flags: {result['flags']}")
        print("-" * 50)