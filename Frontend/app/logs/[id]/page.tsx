import { AppLayout } from '../../components/layout/AppLayout'
import { Box, Container, Heading, VStack, HStack, Text } from '@chakra-ui/react'
import { RiskScoreBadge } from '../../components/domain/RiskScoreBadge'
import { FlagTag } from '../../components/domain/FlagTag'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { ArrowLeft } from 'lucide-react'
import { fetchRiskLog } from './fetch-log'
import { RiskLogDetailClient } from './RiskLogDetailClient'

export default async function LogDetailPage({ params }: { params: { id: string } }) {
  console.log('LogDetailPage server component rendering with params:', params)
  
  // Fetch data on the server
  const log = await fetchRiskLog(params.id)
  
  console.log('Server-side fetched log:', log)

  return (
    <AppLayout>
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          {/* Page Title with Log ID */}
          <HStack justify="space-between" align="center">
            <Heading size="2xl" color="gray.800">
              Risk Log Detail
            </Heading>
            <Text color="gray.600" fontSize="lg">
              ID: {params.id}
            </Text>
          </HStack>

          {/* Pass data to client component */}
          <RiskLogDetailClient log={log} logId={params.id} />
        </VStack>
      </Container>
    </AppLayout>
  )
}
