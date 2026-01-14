import { AppLayoutModern } from '../components/layout/AppLayoutModern'
import { LogsPageClientModern } from './LogsPageClientModern'

export default async function LogsPageModern() {
  // Fetch data on the server with error handling
  let logs: any[] = []
  let error: string | null = null
  
  try {
    // In a real implementation, you'd fetch from your API
    // For now, using mock data for demonstration
    logs = [
      {
        id: 1,
        created_at: "2024-01-14T10:30:00Z",
        final_risk_score: 0.8,
        flags: ["prompt_anomaly", "harmful_instructions"],
        confidence: 0.95,
        decision: "block",
        action_taken: "block",
        decision_reason: "High-risk content detected and blocked"
      },
      {
        id: 2,
        created_at: "2024-01-14T09:15:00Z",
        final_risk_score: 0.3,
        flags: ["policy_violation"],
        confidence: 0.67,
        decision: "warn",
        action_taken: "warn",
        decision_reason: "Policy violation detected"
      },
      {
        id: 3,
        created_at: "2024-01-14T08:00:00Z",
        final_risk_score: 0.6,
        flags: ["unsafe_output"],
        confidence: 0.72,
        decision: "escalate",
        action_taken: "escalate",
        decision_reason: "Unsafe output detected"
      },
      {
        id: 4,
        created_at: "2024-01-14T07:00:00Z",
        final_risk_score: 0.2,
        flags: [],
        confidence: 0.85,
        decision: "allow",
        action_taken: "allow",
        decision_reason: "Low risk, content allowed"
      }
    ]
    
    console.log('Server-side fetched logs:', logs?.length || 0, 'logs')
  } catch (err) {
    console.error('Error fetching logs on server:', err)
    error = err instanceof Error ? err.message : 'Failed to fetch risk logs'
  }

  return (
    <AppLayoutModern>
      <div className="container mx-auto p-6 space-y-6">
        {/* Page Title */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Risk Logs</h1>
            <p className="text-muted-foreground">Monitor and review AI safety decisions and risk assessments</p>
          </div>
        </div>

        {/* Pass data to client component */}
        <LogsPageClientModern initialLogs={logs} initialError={error} />
      </div>
    </AppLayoutModern>
  )
}
