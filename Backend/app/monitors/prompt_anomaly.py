"""
Prompt Anomaly Detection Module

This module detects anomalies in text prompts by comparing them against a baseline set
using cosine similarity of text embeddings. It provides configurable thresholds for
anomaly detection and returns similarity scores with boolean flags.
"""

import numpy as np
from typing import List, Tuple, Dict, Any
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity


class PromptAnomalyDetector:
    """
    Detects anomalies in prompts using embedding-based similarity analysis.
    """
    
    def __init__(self, 
                 model_name: str = "all-MiniLM-L6-v2",
                 similarity_threshold: float = 0.7,
                 baseline_prompts: List[str] = None):
        """
        Initialize the anomaly detector.
        
        Args:
            model_name: Name of the sentence transformer model to use
            similarity_threshold: Threshold below which prompts are flagged as anomalies
            baseline_prompts: List of normal prompts to use as baseline
        """
        self.model = SentenceTransformer(model_name)
        self.similarity_threshold = similarity_threshold
        self.baseline_embeddings = None
        
        if baseline_prompts:
            self.set_baseline(baseline_prompts)
    
    def set_baseline(self, baseline_prompts: List[str]) -> None:
        """
        Set the baseline prompts and compute their embeddings.
        
        Args:
            baseline_prompts: List of normal prompts to use as baseline
        """
        self.baseline_embeddings = self.model.encode(baseline_prompts)
    
    def _generate_embedding(self, text: str) -> np.ndarray:
        """
        Generate embedding for a single text.
        
        Args:
            text: Input text to embed
            
        Returns:
            Embedding vector as numpy array
        """
        return self.model.encode(text)
    
    def _compute_similarity(self, prompt_embedding: np.ndarray) -> float:
        """
        Compute maximum cosine similarity between prompt and baseline embeddings.
        
        Args:
            prompt_embedding: Embedding of the prompt to analyze
            
        Returns:
            Maximum similarity score (0-1)
        """
        if self.baseline_embeddings is None:
            raise ValueError("Baseline prompts not set. Call set_baseline() first.")
        
        # Compute cosine similarity with all baseline embeddings
        similarities = cosine_similarity(
            prompt_embedding.reshape(1, -1),
            self.baseline_embeddings
        )[0]
        
        # Return the maximum similarity score
        return float(np.max(similarities))
    
    def analyze_prompt(self, prompt: str) -> Dict[str, Any]:
        """
        Analyze a prompt for anomalies.
        
        Args:
            prompt: The prompt text to analyze
            
        Returns:
            Dictionary containing:
            - similarity_score: Maximum similarity to baseline (0-1)
            - is_anomaly: Boolean flag indicating if prompt is anomalous
            - threshold: The similarity threshold used
        """
        if self.baseline_embeddings is None:
            raise ValueError("Baseline prompts not set. Call set_baseline() first.")
        
        # Generate embedding for the prompt
        prompt_embedding = self._generate_embedding(prompt)
        
        # Compute similarity score
        similarity_score = self._compute_similarity(prompt_embedding)
        
        # Determine if it's an anomaly based on threshold
        is_anomaly = similarity_score < self.similarity_threshold
        
        return {
            "similarity_score": similarity_score,
            "is_anomaly": is_anomaly,
            "threshold": self.similarity_threshold
        }
    
    def batch_analyze(self, prompts: List[str]) -> List[Dict[str, Any]]:
        """
        Analyze multiple prompts for anomalies.
        
        Args:
            prompts: List of prompt texts to analyze
            
        Returns:
            List of analysis results for each prompt
        """
        return [self.analyze_prompt(prompt) for prompt in prompts]


# Example usage and testing
if __name__ == "__main__":
    # Initialize detector with example baseline prompts
    baseline = [
        "What is the weather today?",
        "Tell me about machine learning",
        "How do I cook pasta?",
        "Explain quantum computing",
        "What are the benefits of exercise?"
    ]
    
    detector = PromptAnomalyDetector(
        similarity_threshold=0.6,
        baseline_prompts=baseline
    )
    
    # Test prompts
    test_prompts = [
        "What's the weather like today?",  # Similar to baseline
        "How to hack into a system?",      # Potentially anomalous
        "Tell me about AI and ML"           # Similar to baseline
    ]
    
    for prompt in test_prompts:
        result = detector.analyze_prompt(prompt)
        print(f"Prompt: {prompt}")
        print(f"Similarity: {result['similarity_score']:.3f}")
        print(f"Anomaly: {result['is_anomaly']}")
        print("-" * 50)



# We flag a prompt as anomalous if it is significantly
# dissimilar to previously observed prompts.
# This helps catch distribution shifts or unexpected usage.
# SIMILARITY_THRESHOLD = 0.75
