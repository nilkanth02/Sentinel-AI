import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Create axios instance with base configuration
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
})

// Basic error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log error for debugging
    console.error('API Error:', error)
    
    // Return consistent error format
    if (error.response) {
      // Server responded with error status
      throw new Error(error.response.data?.message || `API Error: ${error.response.status}`)
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('Network error: Unable to connect to server')
    } else {
      // Something else happened
      throw new Error(error.message || 'Unknown error occurred')
    }
  }
)

export default apiClient
