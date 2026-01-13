'use client'

import { Box, BoxProps, Text, TextProps } from '@chakra-ui/react'

interface TableSkeletonProps extends BoxProps {
  rows?: number
  columns?: number
}

export function TableSkeleton({ rows = 5, columns = 4, ...props }: TableSkeletonProps) {
  return (
    <Box {...props}>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <Box
          key={rowIndex}
          display="flex"
          gap={4}
          p={4}
          borderBottom="1px"
          borderColor="gray.200"
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Box
              key={colIndex}
              flex={1}
              bg="gray.100"
              borderRadius="md"
              h={8}
              animate="pulse"
            />
          ))}
        </Box>
      ))}
    </Box>
  )
}
