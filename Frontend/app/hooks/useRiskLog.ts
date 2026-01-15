'use client'

import { useQuery } from '@tanstack/react-query'

// Custom hook for fetching a single risk log by ID
export function useRiskLog(logId: string | number | undefined) {
  return useQuery({
    queryKey: ['riskLog', logId],
    queryFn: async () => {
      if (!logId) {
        throw new Error('Log ID is required')
      }
      
      const response = await fetch(`/api/logs/${logId}`, { cache: 'no-store' })
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Risk log not found or endpoint not available')
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      return result
    },
    enabled: !!logId,
    retry: false,
    refetchOnWindowFocus: false,
  })
}
