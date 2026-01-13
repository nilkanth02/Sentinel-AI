'use client'

import { useState, useEffect } from 'react'

// Simple hook without React Query for testing
export function useRiskLogSimple(logId: string | number | undefined) {
  const [data, setData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    console.log('useRiskLogSimple useEffect called with logId:', logId)
    
    if (!logId) {
      console.log('No logId provided')
      return
    }

    const fetchData = async () => {
      console.log('Starting fetch for log ID:', logId)
      setIsLoading(true)
      setIsError(false)
      setError(null)
      
      try {
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
        setData(result)
      } catch (err) {
        console.error('Fetch error:', err)
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
