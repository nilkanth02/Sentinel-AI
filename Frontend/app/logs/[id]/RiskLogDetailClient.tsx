'use client'

import { Box, Container, Heading, VStack, HStack, Text } from '@chakra-ui/react'
import { RiskScoreBadge } from '../../components/domain/RiskScoreBadge'
import { FlagTag } from '../../components/domain/FlagTag'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { ArrowLeft } from 'lucide-react'

interface RiskLogDetailClientProps {
  log: any
  logId: string
}

export function RiskLogDetailClient({ log, logId }: RiskLogDetailClientProps) {
  console.log('RiskLogDetailClient rendering with log:', log)

  return (
    <>
      {/* Not Found State */}
      {!log && (
        <Card title="Not Found">
          <Box p={8}>
            <Text color="gray.500" textAlign="center">
              Risk log not found
            </Text>
          </Box>
        </Card>
      )}

      {/* Data State */}
      {log && (
        <>
          {/* Risk Summary Card */}
          <Card title="Risk Summary">
            <VStack spacing={4} align="stretch">
              <HStack justify="space-between" align="center" p={4} bg="gray.50" borderRadius="md">
                <Text fontWeight="medium">Risk Score:</Text>
                <RiskScoreBadge score={log.final_risk_score} />
              </HStack>
              <HStack justify="space-between" align="center" p={4} bg="gray.50" borderRadius="md">
                <Text fontWeight="medium">Confidence:</Text>
                <Text color="risk.medium" fontWeight="bold">
                  {(log.confidence * 100).toFixed(0)}%
                </Text>
              </HStack>
              <HStack justify="space-between" align="center" p={4} bg="gray.50" borderRadius="md">
                <Text fontWeight="medium">Decision:</Text>
                <Text color="risk.critical" fontWeight="bold">
                  {log.decision || 'Not specified'}
                </Text>
              </HStack>
            </VStack>
          </Card>

          {/* Prompt Section */}
          <Card title="Input Prompt">
            <Box 
              bg="gray.50" 
              borderRadius="md" 
              p={8} 
              minH="120px"
            >
              <Text color="gray.600">
                {log.prompt || 'No prompt data available'}
              </Text>
            </Box>
          </Card>

          {/* Response Section */}
          <Card title="AI Response">
            <Box 
              bg="gray.50" 
              borderRadius="md" 
              p={8} 
              minH="120px"
            >
              <Text color="gray.600">
                {log.response || 'No response data available'}
              </Text>
            </Box>
          </Card>

          {/* Signals Breakdown */}
          <Card title="Signal Analysis">
            <VStack spacing={4} align="stretch">
              <Text color="gray.600" mb={4}>
                Risk signals detected during analysis:
              </Text>
              <HStack flexWrap="wrap" gap={2}>
                {log.flags && log.flags.length > 0 ? (
                  log.flags.map((flag: string, index: number) => (
                    <FlagTag
                      key={index}
                      flag={flag}
                      variant={flag === "unsafe_output" ? "critical" : 
                             flag === "jailbreak_attempt" ? "high" : "medium"}
                    />
                  ))
                ) : (
                  <Text color="gray.500">No risk signals detected</Text>
                )}
              </HStack>
              <Box 
                bg="gray.50" 
                borderRadius="md" 
                p={8} 
                minH="200px"
              >
                <Text color="gray.500" textAlign="center">
                  Detailed signal breakdown and analysis would be displayed here
                </Text>
              </Box>
            </VStack>
          </Card>

          {/* Timestamp */}
          <Card title="Timestamp">
            <Box p={4} bg="gray.50" borderRadius="md">
              <Text color="gray.600">
                {new Date(log.created_at).toLocaleString()}
              </Text>
            </Box>
          </Card>
        </>
      )}

      {/* Back Navigation */}
      <Box>
        <Button 
          leftIcon={<ArrowLeft size={16} />}
          variant="secondary"
          onClick={() => window.history.back()}
        >
          Back to Logs
        </Button>
      </Box>
    </>
  )
}
