'use client'

import { Box, BoxProps, Heading, HeadingProps } from '@chakra-ui/react'

interface ModalProps extends BoxProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

export function Modal({ isOpen, onClose, title, children, ...props }: ModalProps) {
  if (!isOpen) return null

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      bg="blackAlpha.600"
      zIndex={1000}
      display="flex"
      alignItems="center"
      justifyContent="center"
      {...props}
    >
      <Box
        bg="white"
        borderRadius="lg"
        boxShadow="xl"
        maxW="90vw"
        maxH="90vh"
        m={4}
        overflow="auto"
      >
        {/* Header */}
        {title && (
          <Box
            p={6}
            borderBottom="1px"
            borderColor="gray.200"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Heading size="md" color="gray.800">
              {title}
            </Heading>
            <Box
              as="button"
              onClick={onClose}
              color="gray.500"
              fontSize="2xl"
              lineHeight="1"
              cursor="pointer"
              _hover={{ color: 'gray.700' }}
            >
              ×
            </Box>
          </Box>
        )}

        {/* Body */}
        <Box p={6}>
          {children}
        </Box>
      </Box>
    </Box>
  )
}
