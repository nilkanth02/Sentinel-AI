'use client'

import { Box, BoxProps, Heading, HeadingProps, Text, TextProps, HStack } from '@chakra-ui/react'

interface KpiCardProps extends BoxProps {
  title: string
  value: string | number
  change?: number
  changeType?: 'increase' | 'decrease' | 'neutral'
  icon?: React.ReactNode
}

export function KpiCard({ title, value, change, changeType = 'neutral', icon, ...props }: KpiCardProps) {
  const changeColor = changeType === 'increase' ? 'risk.low' :
                     changeType === 'decrease' ? 'risk.high' :
                     'gray.500'

  const changeSymbol = change && change > 0 ? '↑' :
                      change && change < 0 ? '↓' : ''

  return (
    <Box
      bg="white"
      borderRadius="lg"
      boxShadow="md"
      border="1px"
      borderColor="gray.200"
      p={6}
      {...props}
    >
      <HStack justify="space-between" align="flex-start" mb={4}>
        <Box>
          <Text color="gray.600" fontSize="sm" fontWeight="medium">
            {title}
          </Text>
          {icon && (
            <Box ml={2} display="inline">
              {icon}
            </Box>
          )}
        </Box>
        <HStack align="center" spacing={2}>
          <Text fontSize="2xl" fontWeight="bold" color="gray.800">
            {value}
          </Text>
          {change !== undefined && (
            <Text fontSize="sm" color={changeColor} fontWeight="medium">
              {changeSymbol}{Math.abs(change)}%
            </Text>
          )}
        </HStack>
      </HStack>
    </Box>
  )
}
