import { AppLayoutModern } from '../../components/layout/AppLayoutModern'
import { fetchRiskLog } from './fetch-log'
import { RiskLogDetailClientModern } from './RiskLogDetailClientModern'

export default async function LogDetailPage({ params }: { params: { id: string } }) {
  // Fetch data on the server
  const log = await fetchRiskLog(params.id)

  return (
    <AppLayoutModern>
      <div className="min-h-screen bg-gradient-navy">
        {/* Premium animated background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
        </div>
        
        <div className="relative z-10">
          <RiskLogDetailClientModern log={log} logId={params.id} />
        </div>
      </div>
    </AppLayoutModern>
  )
}
