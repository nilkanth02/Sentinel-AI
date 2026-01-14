import { AppLayout } from '../components/layout/AppLayout'
import { Box, Container, Heading, VStack, HStack, Input, Select, Button, Text } from '@chakra-ui/react'
import { RiskTable } from '../components/table/RiskTable'
import { TableSkeleton } from '../components/table/TableSkeleton'
import { Card } from '../components/ui/Card'
import { fetchRiskLogs } from './fetch-logs'
import { LogsPageClient } from './LogsPageClient'

export default async function LogsPage() {
  console.log('LogsPage server component rendering')
  
  // Fetch data on the server with error handling
  let logs = []
  let error = null
  
  try {
    logs = await fetchRiskLogs(50)
    console.log('Server-side fetched logs:', logs?.length || 0, 'logs')
  } catch (err) {
    console.error('Error fetching logs on server:', err)
    error = err instanceof Error ? err.message : 'Failed to fetch risk logs'
  }

  return (
    <AppLayout>
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          {/* Page Title */}
          <Box>
            <Heading size="2xl" color="gray.800">
              Risk Logs
            </Heading>
            <Text color="gray.500" fontSize="sm" mt={2}>
              Monitor and review AI safety decisions and risk assessments
            </Text>
          </Box>

          {/* Pass data to client component */}
          <LogsPageClient initialLogs={logs} initialError={error} />
        </VStack>
      </Container>
    </AppLayout>
  )
}
