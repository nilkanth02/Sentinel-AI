import { AppLayout } from '../components/layout/AppLayout'
import { Box, Container, Heading, VStack, HStack, Table, Tbody, Tr, Td, Thead, Th } from '@chakra-ui/react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Plus } from 'lucide-react'

export default function BaselinesPage() {
  // Mock data for demonstration
  const baselines = [
    { id: 1, name: "Content Safety", threshold: 0.7, status: "Active" },
    { id: 2, name: "Jailbreak Detection", threshold: 0.8, status: "Active" },
    { id: 3, name: "Prompt Anomaly", threshold: 0.6, status: "Inactive" },
    { id: 4, name: "Output Risk", threshold: 0.75, status: "Active" }
  ]

  return (
    <AppLayout>
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          {/* Page Title */}
          <HStack justify="space-between" align="center">
            <Heading size="2xl" color="gray.800">
              Risk Baselines
            </Heading>
            <Button 
              leftIcon={<Plus size={16} />}
              variant="primary"
            >
              Add Baseline
            </Button>
          </HStack>

          {/* Baselines Table */}
          <Card>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th>Threshold</Th>
                  <Th>Status</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {baselines.map((baseline) => (
                  <Tr key={baseline.id}>
                    <Td fontWeight="medium">{baseline.name}</Td>
                    <Td>{baseline.threshold}</Td>
                    <Td>
                      <Box
                        px={2}
                        py={1}
                        borderRadius="md"
                        fontSize="sm"
                        fontWeight="medium"
                        bg={baseline.status === "Active" ? "risk.low" : "gray.200"}
                        color={baseline.status === "Active" ? "white" : "gray.600"}
                      >
                        {baseline.status}
                      </Box>
                    </Td>
                    <Td>
                      <HStack spacing={2}>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm">
                          Delete
                        </Button>
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Card>

          {/* Configuration Options */}
          <Card title="Configuration Options">
            <VStack spacing={4} align="stretch">
              <HStack justify="space-between" align="center" p={4} bg="gray.50" borderRadius="md">
                <Box fontWeight="medium">Default Risk Threshold:</Box>
                <Box color="gray.700">0.75</Box>
              </HStack>
              <HStack justify="space-between" align="center" p={4} bg="gray.50" borderRadius="md">
                <Box fontWeight="medium">Alert Sensitivity:</Box>
                <Box color="gray.700">Medium</Box>
              </HStack>
              <HStack justify="space-between" align="center" p={4} bg="gray.50" borderRadius="md">
                <Box fontWeight="medium">Monitoring Frequency:</Box>
                <Box color="gray.700">Real-time</Box>
              </HStack>
            </VStack>
          </Card>

          {/* Save Button */}
          <Box>
            <Button 
              variant="primary" 
              size="lg"
              w="full"
            >
              Save Configuration
            </Button>
          </Box>
        </VStack>
      </Container>
    </AppLayout>
  )
}
