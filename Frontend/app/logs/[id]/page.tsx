import { AppLayoutModern } from '../../components/layout/AppLayoutModern'
import { fetchRiskLog } from './fetch-log'
import { RiskLogDetailClientModern } from './RiskLogDetailClientModern'

export default async function LogDetailPage({ params }: { params: { id: string } }) {
  // Fetch data on the server
  const log = await fetchRiskLog(params.id)

  return (
    <AppLayoutModern>
      <RiskLogDetailClientModern log={log} logId={params.id} />
    </AppLayoutModern>
  )
}
