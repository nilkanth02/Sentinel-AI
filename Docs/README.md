# SentinelAI

SentinelAI is a lightweight monitoring layer designed to detect failures,
risks, and anomalous behavior in AI / LLM-powered systems before they reach end users.

## Why this exists

As AI systems are increasingly deployed in production, failures such as
hallucinations, prompt misuse, and distribution shifts often go unnoticed.
Most teams lack visibility into *when* and *why* models fail.

SentinelAI focuses on early detection and observability rather than model accuracy alone.

## What SentinelAI does (MVP)
- Detects prompt distribution shifts
- Flags risky or unstable model outputs
- Assigns a simple risk score to each interaction
- Logs and surfaces failure signals for inspection

## Non-goals
- SentinelAI is not a replacement for model evaluation
- It does not guarantee correctness or alignment
- The MVP favors interpretability over complex modeling
