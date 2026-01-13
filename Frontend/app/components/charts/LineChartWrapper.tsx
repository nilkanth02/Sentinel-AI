'use client'

import { Box, BoxProps, Text } from '@chakra-ui/react'

interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor?: string
    borderColor?: string
  }[]
}

interface LineChartWrapperProps extends BoxProps {
  data: ChartData
  height?: number
  title?: string
}

export function LineChartWrapper({ data, height = 300, title, ...props }: LineChartWrapperProps) {
  return (
    <Box {...props}>
      {title && (
        <Box mb={4}>
          <Box as="h3" fontSize="md" fontWeight="medium" color="gray.700">
            {title}
          </Box>
        </Box>
      )}
      <Box
        bg="white"
        borderRadius="lg"
        boxShadow="md"
        border="1px"
        borderColor="gray.200"
        p={6}
        height={height}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Box color="gray.500" textAlign="center">
          <Box mb={2}>
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12h18m-9-9 9-9 9-9m0 18h18" />
            </svg>
          </Box>
          <Text>Line chart will be displayed here</Text>
          <Text fontSize="sm" color="gray.400">
            Data: {data.labels.length} points
          </Text>
        </Box>
      </Box>
    </Box>
  )
}
