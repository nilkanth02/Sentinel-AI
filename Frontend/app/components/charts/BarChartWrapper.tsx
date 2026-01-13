'use client'

import { Box, BoxProps } from '@chakra-ui/react'

interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor?: string
    borderColor?: string
  }[]
}

interface BarChartWrapperProps extends BoxProps {
  data: ChartData
  height?: number
  title?: string
}

export function BarChartWrapper({ data, height = 300, title, ...props }: BarChartWrapperProps) {
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
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" strokeWidth={2} />
            </svg>
          </Box>
          <Box as="p">Bar chart will be displayed here</Box>
          <Box as="p" fontSize="sm" color="gray.400">
            Data: {data.labels.length} categories
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
