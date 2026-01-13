'use client'

import { Box, BoxProps, Text, TextProps } from '@chakra-ui/react'

interface BadgeProps extends BoxProps {
  variant: 'low' | 'medium' | 'high' | 'critical'
  children: React.ReactNode
}

export function Badge({ variant, children, ...props }: BadgeProps) {
  const bgColor = variant === 'low' ? 'risk.low' :
                   variant === 'medium' ? 'risk.medium' :
                   variant === 'high' ? 'risk.high' :
                   'risk.critical'

  const textColor = variant === 'low' ? 'white' :
                    variant === 'medium' ? 'white' :
                    variant === 'high' ? 'white' :
                    'white'

  return (
    <Box
      bg={bgColor}
      color={textColor}
      px={3}
      py={1}
      borderRadius="full"
      fontSize="xs"
      fontWeight="medium"
      textTransform="uppercase"
      letterSpacing="wider"
      display="inline-block"
      {...props}
    >
      <Text>{children}</Text>
    </Box>
  )
}
