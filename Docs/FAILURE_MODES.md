# Known and Expected Failure Modes (Draft)

This document lists known limitations and failure modes of the SentinelAI MVP.

## Detection limitations
- Rule-based heuristics may generate false positives
- Novel prompt patterns may bypass anomaly detection
- Risk scoring is coarse and not probabilistic

## System limitations
- Thresholds require manual tuning
- Monitoring adds slight latency to requests
- MVP does not learn automatically from feedback

## Safety limitations
- SentinelAI cannot prevent misuse, only flag it
- Detection does not imply correctness of judgment
