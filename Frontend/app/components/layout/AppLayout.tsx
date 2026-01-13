'use client'

import { useState } from 'react'
import { Box, Flex, useDisclosure } from '@chakra-ui/react'
import { TopNavbar } from './TopNavbar'
import { Sidebar } from './Sidebar'

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const { isOpen, onToggle, onClose } = useDisclosure()

  return (
    <Flex direction="column" minH="100vh">
      {/* Fixed Top Navbar */}
      <TopNavbar onMenuToggle={onToggle} />
      
      {/* Main Content Area */}
      <Flex flex={1}>
        {/* Sidebar - Desktop always visible, Mobile controlled by disclosure */}
        <Sidebar 
          isOpen={isOpen} 
          onClose={onClose}
          display={{ base: isOpen ? 'block' : 'none', lg: 'block' }}
          position={{ base: 'fixed', lg: 'static' }}
          zIndex={{ base: 1000, lg: 'auto' }}
        />
        
        {/* Main Content - Scrolls independently */}
        <Box 
          as="main" 
          flex={1}
          ml={{ base: 0, lg: 240 }} // Account for sidebar width
          p={{ base: 4, md: 6, lg: 8 }}
          overflow="auto"
        >
          {children}
        </Box>
      </Flex>
    </Flex>
  )
}
