"""
Prompt Anomaly Detection Module

This module detects anomalies in text prompts using simple heuristics
and text analysis instead of heavy ML models to avoid disk space issues.
It provides basic anomaly detection based on text patterns and length.
"""

from typing import List, Dict, Any
import re
import math


class PromptAnomalyDetector:
    """
    Detects anomalies in prompts using simple text-based heuristics.
    """

    def __init__(
        self,
        similarity_threshold: float = 0.75,
        baseline_prompts: List[str] | None = None,
    ):
        """
        Initialize the anomaly detector.

        Args:
            similarity_threshold: Threshold below which prompts are flagged
            baseline_prompts: Reference prompts representing normal usage
        """
        self.similarity_threshold = similarity_threshold
        self.baseline_prompts = baseline_prompts or []
        
        # Precompute baseline statistics
        self._baseline_stats = self._compute_baseline_stats()

    def _compute_baseline_stats(self) -> Dict[str, float]:
        """
        Compute baseline statistics from reference prompts.
        """
        if not self.baseline_prompts:
            return {
                "avg_length": 50.0,
                "length_std": 20.0,
                "common_words": {"the", "a", "an", "what", "how", "why", "when", "where", "who"}
            }
        
        lengths = [len(prompt.split()) for prompt in self.baseline_prompts]
        all_words = " ".join(self.baseline_prompts).lower().split()
        word_freq = {}
        for word in all_words:
            word_freq[word] = word_freq.get(word, 0) + 1
        
        # Get most common words (excluding very common stop words)
        common_words = set([word for word, freq in sorted(word_freq.items(), key=lambda x: x[1], reverse=True)[:10]])
        
        return {
            "avg_length": sum(lengths) / len(lengths),
            "length_std": math.sqrt(sum((l - sum(lengths) / len(lengths))**2 for l in lengths) / len(lengths)),
            "common_words": common_words
        }

    def _text_similarity(self, text1: str, text2: str) -> float:
        """
        Compute simple text similarity using word overlap.
        """
        words1 = set(text1.lower().split())
        words2 = set(text2.lower().split())
        
        if not words1 and not words2:
            return 1.0
        if not words1 or not words2:
            return 0.0
            
        intersection = words1.intersection(words2)
        union = words1.union(words2)
        
        return len(intersection) / len(union) if union else 0.0

    def _length_anomaly_score(self, prompt: str) -> float:
        """
        Compute anomaly score based on prompt length.
        """
        word_count = len(prompt.split())
        avg_length = self._baseline_stats["avg_length"]
        length_std = self._baseline_stats["length_std"]
        
        # Z-score based anomaly detection
        z_score = abs(word_count - avg_length) / length_std if length_std > 0 else 0
        
        # Convert to similarity score (higher is more normal)
        similarity = max(0.0, 1.0 - (z_score / 3.0))  # Cap at 3 std deviations
        
        return similarity

    def _content_anomaly_score(self, prompt: str) -> float:
        """
        Compute anomaly score based on content similarity to baseline.
        """
        if not self.baseline_prompts:
            return 1.0  # Assume normal if no baseline
        
        max_similarity = 0.0
        for baseline_prompt in self.baseline_prompts:
            similarity = self._text_similarity(prompt, baseline_prompt)
            max_similarity = max(max_similarity, similarity)
        
        return max_similarity

    def analyze(self, prompt: str) -> Dict[str, Any]:
        """
        Analyze a prompt for anomaly detection.

        Args:
            prompt: Input prompt text

        Returns:
            Dictionary with similarity score and anomaly flag
        """
        # Combine multiple similarity measures
        length_similarity = self._length_anomaly_score(prompt)
        content_similarity = self._content_anomaly_score(prompt)
        
        # Weighted average (favor content similarity)
        overall_similarity = 0.3 * length_similarity + 0.7 * content_similarity
        
        is_anomalous = overall_similarity < self.similarity_threshold

        return {
            "similarity_score": overall_similarity,
            "is_anomalous": is_anomalous,
            "threshold": self.similarity_threshold,
        }


# ------------------------------------------------------------------
# Public functional interface (used by API / orchestration layers)
# ------------------------------------------------------------------

_default_detector = PromptAnomalyDetector(
    baseline_prompts=[
        "Summarize the following text",
        "Answer the user's question clearly",
        "Generate a helpful and safe response",
        "Explain the concept in simple terms",
        "Provide step-by-step reasoning",
    ]
)


def detect_prompt_anomaly(prompt: str) -> Dict[str, Any]:
    """
    Public wrapper for prompt anomaly detection.

    This function provides a stable interface for other
    SentinelAI components while keeping the implementation
    encapsulated within the detector class.
    """
    return _default_detector.analyze(prompt)
