import { apiClient } from './client'

// Type definitions for API responses (matching actual backend format)
export interface RiskLog {
  id: number
  created_at: string
  final_risk_score: number
  flags: string[]
  confidence: number
  // Optional fields that might be added later
  prompt?: string
  response?: string
  decision?: string
  system?: string
  status?: string
}

export interface RiskLogListResponse {
  // The backend returns a direct array, not wrapped in an object
  // So we'll handle this in the hook
}

// API functions for risk logs
export async function getRiskLogs(params?: { limit?: number }): Promise<RiskLog[]> {
  // Calls GET /api/logs
  const response = await apiClient.get('/api/logs', { params })
  return response.data // Backend returns direct array
}

export async function getRiskLogById(id: string | number): Promise<RiskLog> {
  // Calls GET /api/logs/{id}
  const response = await apiClient.get(`/api/logs/${id}`)
  return response.data
}
