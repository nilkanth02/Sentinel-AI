'use client'

import { AppLayout } from '../components/layout/AppLayout'
import { Box, Container, Heading, VStack, HStack, Input, Select, Button, Text } from '@chakra-ui/react'
import { RiskTable } from '../components/table/RiskTable'
import { TableSkeleton } from '../components/table/TableSkeleton'
import { Card } from '../components/ui/Card'
import { useRiskLogs } from '../hooks/useRiskLogs'

export default function LogsPage() {
  console.log('LogsPage component rendering')
  const { data: logs, isLoading, isError, error } = useRiskLogs()

  console.log('useRiskLogs result:', { logs, isLoading, isError, error })

  const tableColumns = [
    { key: "created_at", header: "Time", width: "150px" },
    { key: "id", header: "ID", width: "80px" },
    { key: "final_risk_score", header: "Risk Score", width: "100px" },
    { key: "flags", header: "Flags", width: "200px" },
    { key: "confidence", header: "Confidence", width: "100px" },
    { key: "actions", header: "Actions", width: "80px" }
  ]

  return (
    <AppLayout>
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          {/* Page Title */}
          <Heading size="2xl" color="gray.800">
            Risk Logs
          </Heading>

          {/* Filters Bar */}
          <Box>
            <Heading size="lg" color="gray.700" mb={6}>
              Filters
            </Heading>
            <Box 
              p={6} 
              bg="white" 
              borderRadius="lg" 
              boxShadow="md"
              border="1px"
              borderColor="gray.200"
            >
              <HStack spacing={4} align="flex-end">
                <Box flex={1}>
                  <Input placeholder="Search prompts..." size="md" />
                </Box>
                <Select placeholder="Risk Level" size="md" w="150px">
                  <option value="all">All Levels</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </Select>
                <Select placeholder="Time Range" size="md" w="150px">
                  <option value="1h">Last Hour</option>
                  <option value="24h">Last 24 Hours</option>
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                </Select>
                <Button variant="primary" size="md">
                  Apply Filters
                </Button>
              </HStack>
            </Box>
          </Box>

          {/* Logs Table */}
          <Box>
            <Heading size="lg" color="gray.700" mb={6}>
              Risk Events
            </Heading>
            
            {/* Loading State */}
            {isLoading && (
              <RiskTable columns={tableColumns}>
                <TableSkeleton rows={5} columns={6} />
              </RiskTable>
            )}

            {/* Error State */}
            {isError && (
              <Card>
                <Text color="red.500" textAlign="center" py={8}>
                  {error instanceof Error ? error.message : 'Failed to load risk logs'}
                </Text>
              </Card>
            )}

            {/* Data State */}
            {logs && (
              <RiskTable columns={tableColumns}>
                <VStack spacing={2} align="stretch">
                  {logs.map((log) => (
                    <HStack 
                      key={log.id} 
                      p={3} 
                      borderBottom="1px" 
                      borderColor="gray.200"
                      spacing={4}
                    >
                      <Text flex="0 0 80px" fontSize="sm">
                        #{log.id}
                      </Text>
                      <Text flex="0 0 150px" fontSize="sm">
                        {new Date(log.created_at).toLocaleString()}
                      </Text>
                      <Text 
                        flex="0 0 100px" 
                        fontSize="sm" 
                        fontWeight="bold"
                        color={
                          log.final_risk_score >= 0.8 ? 'red.500' :
                          log.final_risk_score >= 0.6 ? 'orange.500' :
                          log.final_risk_score >= 0.4 ? 'yellow.500' :
                          'green.500'
                        }
                      >
                        {log.final_risk_score.toFixed(2)}
                      </Text>
                      <Box flex="1" maxW="200px">
                        <Text fontSize="sm" noOfLines={1}>
                          {log.flags.join(', ') || 'None'}
                        </Text>
                      </Box>
                      <Text flex="0 0 100px" fontSize="sm">
                        {(log.confidence * 100).toFixed(0)}%
                      </Text>
                      <Button variant="ghost" size="sm" flex="0 0 80px">
                        View
                      </Button>
                    </HStack>
                  ))}
                </VStack>
              </RiskTable>
            )}
          </Box>

          {/* Pagination */}
          <Box>
            <HStack justify="center" spacing={4}>
              <Button variant="secondary" size="md">
                Previous
              </Button>
              <Button variant="primary" size="md" isDisabled>
                1
              </Button>
              <Button variant="secondary" size="md">
                Next
              </Button>
            </HStack>
          </Box>
        </VStack>
      </Container>
    </AppLayout>
  )
}
