```mermaid
graph LR
    Client[Client Application]
    Sentinel[SentinelAI API]
    SignalRegistry[Signal Registry]
    RiskReasoner[Risk Reasoner (Agent)]
    PolicyEngine[Policy Engine]
    ActionLog[(Action + Log)]

    Client --> Sentinel
    Sentinel --> SignalRegistry
    SignalRegistry --> RiskReasoner
    RiskReasoner --> PolicyEngine
    PolicyEngine --> ActionLog
