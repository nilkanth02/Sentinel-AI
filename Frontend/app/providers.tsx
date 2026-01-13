'use client'

import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { theme } from './theme'

// Initialize QueryClient with default options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

console.log('QueryClient created:', queryClient)

// Providers component wraps app with React Query and Chakra UI
export function Providers({ children }: { children: React.ReactNode }) {
  console.log('Providers rendering with QueryClient')
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        {children}
      </ChakraProvider>
    </QueryClientProvider>
  )
}
