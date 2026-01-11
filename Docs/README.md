# SentinelAI
 
SentinelAI is a lightweight AI risk monitoring system designed to detect
prompt anomalies and risky model outputs before they reach end users.

It acts as an observability and safety layer for AI / LLM-powered systems.

## Why SentinelAI exists

AI systems often fail silently in production.
Issues like hallucinations, prompt misuse, and unsafe outputs
are usually detected only after users are impacted.

SentinelAI focuses on early detection by monitoring both
inputs (prompts) and outputs (responses), providing
a unified risk score and explainable flags for each interaction.

## What SentinelAI does (MVP)

- Detects prompt distribution shifts using embedding similarity
- Flags risky model outputs using rule-based heuristics
- Aggregates multiple weak signals into a unified risk score
- Exposes a simple `/api/analyze` endpoint for integration


## Non-goals

- SentinelAI does not generate model outputs
- It does not guarantee correctness or alignment
- It favors explainability over complex black-box models


## Example usage

A customer support chatbot sends each model interaction to SentinelAI.
If the risk score exceeds a threshold, the response can be logged,
reviewed by a human, or blocked before reaching the user.
