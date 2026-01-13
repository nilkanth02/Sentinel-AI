'use client'

import { Box, Container, Heading, Text, Button, VStack, HStack, SimpleGrid } from '@chakra-ui/react'

export default function LandingPage() {
  return (
    <Box>
      {/* Hero Section */}
      <Box bg="brand.50" py={20}>
        <Container maxW="container.xl" textAlign="center">
          <VStack spacing={6}>
            <Heading 
              as="h1" 
              size="3xl" 
              color="brand.600"
              fontWeight="bold"
            >
              AI-Powered Risk Monitoring
            </Heading>
            <Text 
              fontSize="xl" 
              color="gray.600" 
              maxW="2xl"
            >
              SentinelAI provides real-time risk assessment and monitoring for AI systems, 
              ensuring safety and compliance in your AI deployments.
            </Text>
            <HStack spacing={4} justify="center">
              <Button 
                colorScheme="brand" 
                size="lg"
                onClick={() => window.location.href = '/dashboard'}
              >
                Get Started
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => window.location.href = '/dashboard'}
              >
                View Demo
              </Button>
            </HStack>
          </VStack>
        </Container>
      </Box>

      {/* Features Section */}
      <Box py={20} bg="white">
        <Container maxW="container.xl">
          <VStack spacing={12}>
            <Heading as="h2" size="2xl" textAlign="center" color="gray.800">
              Why Choose SentinelAI?
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
              <Box p={6} bg="gray.50" borderRadius="lg" textAlign="center">
                <Heading size="md" color="brand.600" mb={4}>
                  Real-time Monitoring
                </Heading>
                <Text color="gray.600">
                  Continuous risk assessment with instant alerts for potential threats.
                </Text>
              </Box>
              <Box p={6} bg="gray.50" borderRadius="lg" textAlign="center">
                <Heading size="md" color="brand.600" mb={4}>
                  Advanced Analytics
                </Heading>
                <Text color="gray.600">
                  Detailed risk breakdowns and comprehensive audit trails.
                </Text>
              </Box>
              <Box p={6} bg="gray.50" borderRadius="lg" textAlign="center">
                <Heading size="md" color="brand.600" mb={4}>
                  Customizable Thresholds
                </Heading>
                <Text color="gray.600">
                  Configure risk baselines tailored to your specific needs.
                </Text>
              </Box>
              <Box p={6} bg="gray.50" borderRadius="lg" textAlign="center">
                <Heading size="md" color="brand.600" mb={4}>
                  Enterprise Ready
                </Heading>
                <Text color="gray.600">
                  Scalable solution designed for production environments.
                </Text>
              </Box>
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Dashboard Preview Placeholder */}
      <Box py={20} bg="gray.50">
        <Container maxW="container.xl" textAlign="center">
          <VStack spacing={8}>
            <Heading as="h2" size="2xl" color="gray.800">
              See It In Action
            </Heading>
            <Box 
              p={8} 
              bg="white" 
              borderRadius="lg" 
              boxShadow="md"
              border="1px"
              borderColor="gray.200"
            >
              <Text color="gray.500" fontSize="lg">
                Dashboard preview will be shown here
              </Text>
            </Box>
            <Button 
              colorScheme="brand" 
              size="lg"
              onClick={() => window.location.href = '/dashboard'}
            >
              Try Dashboard
            </Button>
          </VStack>
        </Container>
      </Box>

      {/* Call-to-Action Section */}
      <Box py={20} bg="brand.600">
        <Container maxW="container.xl" textAlign="center">
          <VStack spacing={6}>
            <Heading as="h2" size="2xl" color="white">
              Ready to Enhance Your AI Safety?
            </Heading>
            <Text fontSize="xl" color="brand.50" maxW="2xl">
              Join organizations using SentinelAI to monitor and protect their AI systems.
            </Text>
            <Button 
              bg="white" 
              color="brand.600" 
              size="lg"
              onClick={() => window.location.href = '/dashboard'}
            >
              Start Free Trial
            </Button>
          </VStack>
        </Container>
      </Box>

      {/* Footer */}
      <Box py={12} bg="gray.900" color="white">
        <Container maxW="container.xl" textAlign="center">
          <Text color="gray.400">
            © 2024 SentinelAI. All rights reserved.
          </Text>
        </Container>
      </Box>
    </Box>
  )
}
