"""
Risk Configuration Module for SentinelAI

This module contains centralized configuration for risk assessment,
decision thresholds, and signal weights used across the SentinelAI system.

All risk-related components (aggregator, reasoner, policy) should import
configuration from this module to ensure consistency.
"""

# -------------------------------------------------------------------------
# DECISION THRESHOLDS
# -------------------------------------------------------------------------
# These thresholds define the score ranges for different policy decisions.
# The final_risk_score determines which action is taken.

ALLOW_MAX = 0.1
"""Maximum score for 'allow' decision.
Scores <= ALLOW_MAX are considered safe and allowed through.
"""

WARN_MIN = 0.3
"""Minimum score for 'warn' decision.
Scores >= WARN_MIN trigger monitoring and logging.
Warn range: 0.3 to < BLOCK_MIN
"""

BLOCK_MIN = 0.6
"""Minimum score for 'block' decision.
Scores >= BLOCK_MIN trigger immediate blocking.
Block range: 0.6 to < ESCALATE_MIN
"""

ESCALATE_MIN = 0.85
"""Minimum score for 'escalate' decision.
Scores >= ESCALATE_MIN trigger immediate escalation to human review.
Escalate range: 0.85 to 1.0
"""

# -------------------------------------------------------------------------
# SIGNAL WEIGHTS
# -------------------------------------------------------------------------
# These weights define the relative importance of different risk signals
# during aggregation. Higher weights indicate more severe signals.

SIGNAL_WEIGHTS = {
    "prompt_anomaly": 0.2,
    "jailbreak_attempt": 0.3,
    "unsafe_output": 0.5
}

# Signal weight descriptions:
# prompt_anomaly: Lower severity - unusual but not necessarily harmful prompts
# jailbreak_attempt: Medium severity - attempts to bypass safety measures  
# unsafe_output: Higher severity - harmful or dangerous content in responses

# -------------------------------------------------------------------------
# SEVERITY BASE SCORES
# -------------------------------------------------------------------------
# Base scores for each signal type when detected.
# Used by aggregator for severity-aware normalization.

SEVERITY_BASES = {
    "prompt_anomaly": 0.3,
    "jailbreak_attempt": 0.5,
    "unsafe_output": 0.8
}

# Severity base descriptions:
# prompt_anomaly: Base score for prompt anomaly detection (warn level severity)
# jailbreak_attempt: Base score for jailbreak attempt detection (warn/escalate level)
# unsafe_output: Base score for unsafe output detection (block/escalate level)

# -------------------------------------------------------------------------
# DECISION SCORE ALIGNMENT
# -------------------------------------------------------------------------
# Fallback scores used when signal aggregation produces 0 or None.
# Ensures score-decision consistency for edge cases.

DECISION_ALIGNMENT = {
    "allow": 0.05,
    "warn": 0.4,
    "block": 0.75,
    "escalate": 0.9
}

# Decision alignment descriptions:
# allow: Fallback score for allow decision (very low risk when no signals detected)
# warn: Fallback score for warn decision (medium risk when signals are inconclusive)
# block: Fallback score for block decision (high risk when signals are inconclusive)
# escalate: Fallback score for escalate decision (critical risk when signals are inconclusive)

# -------------------------------------------------------------------------
# VALIDATION RANGES
# -------------------------------------------------------------------------

# Score validation ranges
MIN_SCORE = 0.0
MAX_SCORE = 1.0

# Weight validation ranges
MIN_WEIGHT = 0.0
MAX_WEIGHT = 1.0

# -------------------------------------------------------------------------
# CONFIGURATION SUMMARY
# -------------------------------------------------------------------------
# Decision Ranges:
# - allow: 0.0 to 0.1
# - warn: 0.3 to 0.6  
# - block: 0.6 to 0.85
# - escalate: 0.85 to 1.0

# Signal Severity (base scores):
# - prompt_anomaly: 0.3 (warn level)
# - jailbreak_attempt: 0.5 (warn/escalate level)
# - unsafe_output: 0.8 (block/escalate level)

# Aggregation Method: Weighted max (not average)
# - Higher severity signals dominate final score
# - Multiple signals increase severity, don't average down