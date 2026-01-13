import { AppLayout } from '../components/layout/AppLayout'
import { Box, Container, Heading, VStack, HStack, Switch, Text } from '@chakra-ui/react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'

export default function SettingsPage() {
  return (
    <AppLayout>
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          {/* Page Title */}
          <Heading size="2xl" color="gray.800">
            Settings
          </Heading>

          {/* Settings Sections */}
          <VStack spacing={6} align="stretch">
            {/* General Settings */}
            <Card title="General">
              <VStack spacing={4} align="stretch">
                <HStack justify="space-between" align="center" p={4} bg="gray.50" borderRadius="md">
                  <Text fontWeight="medium">Email Notifications:</Text>
                  <Switch />
                </HStack>
                <HStack justify="space-between" align="center" p={4} bg="gray.50" borderRadius="md">
                  <Text fontWeight="medium">Auto-refresh:</Text>
                  <Switch />
                </HStack>
                <HStack justify="space-between" align="center" p={4} bg="gray.50" borderRadius="md">
                  <Text fontWeight="medium">Time Zone:</Text>
                  <Text color="gray.700">UTC</Text>
                </HStack>
              </VStack>
            </Card>

            {/* Risk Settings */}
            <Card title="Risk Configuration">
              <VStack spacing={4} align="stretch">
                <HStack justify="space-between" align="center" p={4} bg="gray.50" borderRadius="md">
                  <Text fontWeight="medium">Default Risk Threshold:</Text>
                  <Text color="gray.700">0.75</Text>
                </HStack>
                <HStack justify="space-between" align="center" p={4} bg="gray.50" borderRadius="md">
                  <Text fontWeight="medium">Alert Sensitivity:</Text>
                  <Text color="gray.700">Medium</Text>
                </HStack>
                <HStack justify="space-between" align="center" p={4} bg="gray.50" borderRadius="md">
                  <Text fontWeight="medium">Monitoring Frequency:</Text>
                  <Text color="gray.700">Real-time</Text>
                </HStack>
              </VStack>
            </Card>

            {/* API Settings */}
            <Card title="API Configuration">
              <VStack spacing={4} align="stretch">
                <HStack justify="space-between" align="center" p={4} bg="gray.50" borderRadius="md">
                  <Text fontWeight="medium">API Endpoint:</Text>
                  <Text color="gray.700">Configured</Text>
                </HStack>
                <HStack justify="space-between" align="center" p={4} bg="gray.50" borderRadius="md">
                  <Text fontWeight="medium">API Key Status:</Text>
                  <Text color="risk.low" fontWeight="bold">Active</Text>
                </HStack>
                <HStack justify="space-between" align="center" p={4} bg="gray.50" borderRadius="md">
                  <Text fontWeight="medium">Request Rate Limit:</Text>
                  <Text color="gray.700">1000/hr</Text>
                </HStack>
              </VStack>
            </Card>
          </VStack>

          {/* Save Button */}
          <Box>
            <Button 
              variant="primary" 
              size="lg"
              w="full"
            >
              Save Settings
            </Button>
          </Box>
        </VStack>
      </Container>
    </AppLayout>
  )
}
