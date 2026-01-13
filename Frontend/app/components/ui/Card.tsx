'use client'

import { Box, BoxProps, Heading, HeadingProps, Text, TextProps } from '@chakra-ui/react'

interface CardProps extends BoxProps {
  title?: string
  children: React.ReactNode
  footer?: React.ReactNode
}

export function Card({ title, children, footer, ...props }: CardProps) {
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
      {(title || footer) && (
        <Box p={6} borderBottom="1px" borderColor="gray.200">
          {title && (
            <Heading size="md" color="gray.800" mb={footer ? 4 : 0}>
              {title}
            </Heading>
          )}
          {footer && (
            <Text color="gray.600" fontSize="sm">
              {footer}
            </Text>
          )}
        </Box>
      )}
      
      <Box p={title && !footer ? 6 : footer ? 6 : 0}>
        {children}
      </Box>
      
      {footer && !title && (
        <Box p={6} borderTop="1px" borderColor="gray.200">
          <Text color="gray.600" fontSize="sm">
            {footer}
          </Text>
        </Box>
      )}
    </Box>
  )
}
