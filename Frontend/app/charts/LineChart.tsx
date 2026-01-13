// Chart wrapper components
export interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor?: string
    borderColor?: string
  }[]
}

export function LineChart({ data, title }: { data: ChartData; title: string }) {
  return (
    <div className="chart-container">
      <h3 className="chart-title">{title}</h3>
      <div className="chart-placeholder">
        <p>Chart will be rendered here</p>
        <small>Labels: {data.labels.join(', ')}</small>
      </div>
    </div>
  )
}

export function BarChart({ data, title }: { data: ChartData; title: string }) {
  return (
    <div className="chart-container">
      <h3 className="chart-title">{title}</h3>
      <div className="chart-placeholder">
        <p>Chart will be rendered here</p>
        <small>Datasets: {data.datasets.length}</small>
      </div>
    </div>
  )
}
