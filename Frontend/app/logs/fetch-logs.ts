import { headers } from 'next/headers'

// Server-side data fetching function
export async function fetchRiskLogs(limit: number = 50) {
  try {
    const h = headers()
    const proto = h.get('x-forwarded-proto') || 'http'
    const host = h.get('x-forwarded-host') || h.get('host')
    const origin = host ? `${proto}://${host}` : 'http://localhost:3000'

    const response = await fetch(`${origin}/api/logs?limit=${limit}`, {
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
