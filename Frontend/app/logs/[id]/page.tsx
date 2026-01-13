import { AppLayout } from '../../components/layout/AppLayout'
import { Box, Container, Heading, VStack, HStack, Text } from '@chakra-ui/react'
import { RiskScoreBadge } from '../../components/domain/RiskScoreBadge'
import { FlagTag } from '../../components/domain/FlagTag'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { ArrowLeft } from 'lucide-react'

export default function LogDetailPage({ params }: { params: { id: string } }) {
  // Mock data for demonstration
  const riskScore = 0.85
  const flags = ["unsafe_output", "jailbreak_attempt", "prompt_anomaly"]
  const decision = "Block"
  const confidence = 92

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

          {/* Risk Summary Card */}
          <Card title="Risk Summary">
            <VStack spacing={4} align="stretch">
              <HStack justify="space-between" align="center" p={4} bg="gray.50" borderRadius="md">
                <Text fontWeight="medium">Risk Score:</Text>
                <RiskScoreBadge score={riskScore} />
              </HStack>
              <HStack justify="space-between" align="center" p={4} bg="gray.50" borderRadius="md">
                <Text fontWeight="medium">Confidence:</Text>
                <Text color="risk.medium" fontWeight="bold">{confidence}%</Text>
              </HStack>
              <HStack justify="space-between" align="center" p={4} bg="gray.50" borderRadius="md">
                <Text fontWeight="medium">Decision:</Text>
                <Text color="risk.critical" fontWeight="bold">{decision}</Text>
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
                This is where the user's input prompt would be displayed. The prompt would show the exact text that was analyzed by the AI system.
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
                This is where the AI's response would be displayed. The response content would be shown here for review and analysis.
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
                {flags.map((flag, index) => (
                  <FlagTag
                    key={index}
                    flag={flag}
                    variant={flag === "unsafe_output" ? "critical" : 
                           flag === "jailbreak_attempt" ? "high" : "medium"}
                  />
                ))}
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
        </VStack>
      </Container>
    </AppLayout>
  )
}
