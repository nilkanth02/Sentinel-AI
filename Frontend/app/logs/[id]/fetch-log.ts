// Server-side data fetching function
export async function fetchRiskLog(id: string) {
  try {
    // Use the working logs endpoint to get all logs, then find the specific one
    const response = await fetch(`http://localhost:8000/api/logs?limit=100`, {
      cache: 'no-store', // Disable caching for real-time data
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const logs = await response.json()
    
    // Find the specific log by ID
    const log = logs.find((log: any) => log.id.toString() === id.toString())
    
    if (!log) {
      return null
    }
    
    return log
  } catch (error) {
    console.error('Error fetching risk log:', error)
    return null
  }
}
