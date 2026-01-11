
```mermaid
graph LR
    subgraph API
        A[/api/analyze/]
    end
    subgraph Signal Registry
        B[Detectors]
    end
    subgraph Risk Reasoner (Agent)
        C[Reasoner]
    end
    subgraph Policy Engine
        D[Policy]
    end
    subgraph Action + Log
        E[Action / Log]
    end

    A --> B
    B --> C
    C --> D
    D --> E