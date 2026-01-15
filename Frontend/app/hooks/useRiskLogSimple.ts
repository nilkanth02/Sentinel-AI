'use client'

import { useState, useEffect } from 'react'

// Simple hook without React Query for testing
export function useRiskLogSimple(logId: string | number | undefined) {
  const [data, setData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!logId) {
      return
    }

    const fetchData = async () => {
      setIsLoading(true)
      setIsError(false)
      setError(null)
      
      try {
        const response = await fetch(`/api/logs/${logId}`, { cache: 'no-store' })
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Risk log not found or endpoint not available')
          }
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'))
        setIsError(true)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [logId])

  return { data, isLoading, isError, error }
}
