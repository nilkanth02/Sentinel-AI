// KPI Card component for dashboard metrics
interface KPICardProps {
  title: string
  value: string | number
  change?: number
  changeType?: 'increase' | 'decrease' | 'neutral'
  icon?: React.ReactNode
}

export function KPICard({ title, value, change, changeType = 'neutral', icon }: KPICardProps) {
  return (
    <div className="kpi-card">
      <div className="kpi-header">
        {icon && <div className="kpi-icon">{icon}</div>}
        <h3 className="kpi-title">{title}</h3>
      </div>
      <div className="kpi-value">
        {value}
        {change !== undefined && (
          <span className={`kpi-change kpi-change-${changeType}`}>
            {change > 0 ? '+' : ''}{change}%
          </span>
        )}
      </div>
    </div>
  )
}
