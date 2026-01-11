# Agentic Architecture Flow

## SentinelAI Agentic Risk Monitoring System

```mermaid
flowchart TD
    Client[Client Application]
    Sentinel[SentinelAI API]
    
    subgraph "Signal Detection Layer"
        PromptMon[Prompt Anomaly Detector]
        OutputMon[Output Risk Scorer]
        SignalReg[Signal Registry]
    end
    
    subgraph "Reasoning Layer"
        RiskReasoner[Risk Reasoner Agent]
        ContextAnalyzer[Context Analyzer]
        ThreatClassifier[Threat Classifier]
    end
    
    subgraph "Policy & Action Layer"
        PolicyEngine[Policy Engine]
        ActionExecutor[Action Executor]
        AlertManager[Alert Manager]
    end
    
    subgraph "Storage & Logging"
        RiskDB[(Risk Logs)]
        ActionDB[(Action Logs)]
        MetricsDB[(Metrics)]
    end

    Client --> Sentinel
    Sentinel --> PromptMon
    Sentinel --> OutputMon
    PromptMon --> SignalReg
    OutputMon --> SignalReg
    SignalReg --> RiskReasoner
    RiskReasoner --> ContextAnalyzer
    RiskReasoner --> ThreatClassifier
    ContextAnalyzer --> PolicyEngine
    ThreatClassifier --> PolicyEngine
    PolicyEngine --> ActionExecutor
    PolicyEngine --> AlertManager
    ActionExecutor --> RiskDB
    ActionExecutor --> ActionDB
    AlertManager --> MetricsDB
    
    style RiskReasoner fill:#ff9999,stroke:#333,stroke-width:2px
    style PolicyEngine fill:#99ccff,stroke:#333,stroke-width:2px
    style SignalReg fill:#99ff99,stroke:#333,stroke-width:2px
```
