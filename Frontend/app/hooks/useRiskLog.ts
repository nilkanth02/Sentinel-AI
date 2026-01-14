'use client'

import { useQuery } from '@tanstack/react-query'

// Custom hook for fetching a single risk log by ID
export function useRiskLog(logId: string | number | undefined) {
  const isDev = process.env.NODE_ENV === 'development'
  if (isDev) console.log('useRiskLog hook called with logId:', logId)
  
  return useQuery({
    queryKey: ['riskLog', logId],
    queryFn: async () => {
      if (isDev) console.log('React Query queryFn called for logId:', logId)
      
      if (!logId) {
        throw new Error('Log ID is required')
      }
      
      const response = await fetch(`/api/logs/${logId}`, { cache: 'no-store' })
      if (isDev) console.log('Fetch response status:', response.status)
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Risk log not found or endpoint not available')
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      if (isDev) console.log('Fetch result:', result)
      return result
    },
    enabled: !!logId,
    retry: false,
    refetchOnWindowFocus: false,
  })
}
