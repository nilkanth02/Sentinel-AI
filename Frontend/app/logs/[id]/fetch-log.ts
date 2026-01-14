import { headers } from 'next/headers'

// Server-side data fetching function
export async function fetchRiskLog(id: string) {
  try {
    const h = headers()
    const proto = h.get('x-forwarded-proto') || 'http'
    const host = h.get('x-forwarded-host') || h.get('host')
    const origin = host ? `${proto}://${host}` : 'http://localhost:3000'

    const response = await fetch(`${origin}/api/logs/${id}`, { cache: 'no-store' })
    if (!response.ok) return null

    return await response.json()
  } catch (error) {
    console.error('Error fetching risk log:', error)
    return null
  }
}
