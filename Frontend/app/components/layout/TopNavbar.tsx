'use client'

import { Box, Flex, Heading, HStack, Avatar, IconButton } from '@chakra-ui/react'
import { MenuIcon } from 'lucide-react'

interface TopNavbarProps {
  onMenuToggle: () => void
}

export function TopNavbar({ onMenuToggle }: TopNavbarProps) {
  return (
    <Box 
      as="header" 
      bg="white" 
      borderBottom="1px" 
      borderColor="gray.200"
      position="sticky"
      top={0}
      zIndex={100}
      h="60px"
    >
      <Flex 
        align="center" 
        justify="space-between" 
        h="full" 
        px={{ base: 4, md: 6 }}
        maxW="container.xl"
        mx="auto"
      >
        {/* Left: Logo/Brand */}
        <Flex align="center" gap={3}>
          {/* Mobile menu toggle */}
          <IconButton
            aria-label="Open menu"
            icon={<MenuIcon size={20} />}
            display={{ base: 'flex', lg: 'none' }}
            onClick={onMenuToggle}
            variant="ghost"
            size="sm"
          />
          
          {/* SentinelAI Logo/Name */}
          <Heading 
            size="md" 
            color="brand.600"
            fontWeight="bold"
          >
            SentinelAI
          </Heading>
        </Flex>

        {/* Right: User Avatar */}
        <HStack spacing={4}>
          <Avatar 
            size="sm" 
            name="User" 
            src=""
            bg="gray.300"
          />
        </HStack>
      </Flex>
    </Box>
  )
}
