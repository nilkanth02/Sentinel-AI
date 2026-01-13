'use client'

import { Button as ChakraButton, ButtonProps as ChakraButtonProps } from '@chakra-ui/react'

interface CustomButtonProps extends Omit<ChakraButtonProps, 'colorScheme' | 'variant'> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  isDisabled?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export function Button({ 
  variant = 'primary',
  size = 'md',
  isLoading = false,
  isDisabled = false,
  leftIcon,
  rightIcon,
  children,
  ...props
}: CustomButtonProps) {
  // Map variant to Chakra UI color scheme
  const colorScheme = variant === 'primary' ? 'brand' : 
                    variant === 'secondary' ? 'gray' : 
                    variant === 'ghost' ? 'gray' : undefined

  return (
    <ChakraButton
      colorScheme={colorScheme}
      size={size}
      isLoading={isLoading}
      isDisabled={isDisabled}
      leftIcon={leftIcon}
      rightIcon={rightIcon}
      variant={variant === 'ghost' ? 'ghost' : 'solid'}
      {...props}
    >
      {children}
    </ChakraButton>
  )
}
