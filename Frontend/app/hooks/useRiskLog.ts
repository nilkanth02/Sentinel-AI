'use client'

import { useQuery } from '@tanstack/react-query'

// Custom hook for fetching a single risk log by ID
export function useRiskLog(logId: string | number | undefined) {
  console.log('useRiskLog hook called with logId:', logId)
  
  return useQuery({
    queryKey: ['riskLog', logId],
    queryFn: async () => {
      console.log('React Query queryFn called for logId:', logId)
      
      if (!logId) {
        throw new Error('Log ID is required')
      }
      
      const response = await fetch(`http://localhost:8000/api/logs/${logId}`)
      console.log('Fetch response status:', response.status)
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Risk log not found or endpoint not available')
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      console.log('Fetch result:', result)
      return result
    },
    enabled: !!logId,
    retry: false,
    refetchOnWindowFocus: false,
  })
}
