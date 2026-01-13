'use client'

import { useState, useEffect } from 'react'

// Custom hook for fetching risk logs (using direct fetch for testing)
export function useRiskLogs(params: { limit?: number } = { limit: 50 }) {
  const [data, setData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    console.log('useRiskLogs useEffect called with params:', params)
    const fetchData = async () => {
      console.log('Starting fetch...')
      setIsLoading(true)
      setIsError(false)
      setError(null)
      
      try {
        const response = await fetch(`http://localhost:8000/api/logs?limit=${params.limit || 50}`)
        console.log('Fetch response status:', response.status)
        
        if (!response.ok) {
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
  }, [params.limit])

  return { data, isLoading, isError, error }
}
