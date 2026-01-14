import { AppLayoutModern } from '../../components/layout/AppLayoutModern'
import { fetchRiskLog } from './fetch-log'
import { RiskLogDetailClientModern } from './RiskLogDetailClientModern'

export default async function LogDetailPageModern({ params }: { params: { id: string } }) {
  console.log('LogDetailPageModern server component rendering with params:', params)
  
  // Fetch data on the server
  const log = await fetchRiskLog(params.id)
  
  console.log('Server-side fetched log:', log)

  return (
    <AppLayoutModern>
      <RiskLogDetailClientModern log={log} logId={params.id} />
    </AppLayoutModern>
  )
}
