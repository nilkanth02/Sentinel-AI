'use client'

import { Box, BoxProps, Text, TextProps } from '@chakra-ui/react'

interface Column {
  key: string
  header: string
  width?: string
}

interface RiskTableProps extends BoxProps {
  columns: Column[]
  children?: React.ReactNode
}

export function RiskTable({ columns, children, ...props }: RiskTableProps) {
  return (
    <Box
      bg="white"
      borderRadius="lg"
      boxShadow="md"
      border="1px"
      borderColor="gray.200"
      overflow="hidden"
      {...props}
    >
      {/* Header */}
      <Box
        bg="gray.50"
        px={6}
        py={4}
        borderBottom="1px"
        borderColor="gray.200"
      >
        <Box display="flex" gap={4}>
          {columns.map((column) => (
            <Text
              key={column.key}
              fontWeight="medium"
              color="gray.700"
              flex={column.width ? 1 : undefined}
              minW={column.width}
            >
              {column.header}
            </Text>
          ))}
        </Box>
      </Box>

      {/* Body */}
      <Box p={6}>
        {children || (
          <Text color="gray.500" textAlign="center" py={12}>
            No data available
          </Text>
        )}
      </Box>
    </Box>
  )
}
