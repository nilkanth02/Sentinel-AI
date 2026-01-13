// Server-side data fetching function
export async function fetchRiskLogs(limit: number = 50) {
  try {
    const response = await fetch(`http://localhost:8000/api/logs?limit=${limit}`, {
      cache: 'no-store', // Disable caching for real-time data
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const logs = await response.json()
    return logs
  } catch (error) {
    console.error('Error fetching risk logs:', error)
    return []
  }
}
