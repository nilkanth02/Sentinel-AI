'use client'

import { Box, VStack, Link, Flex, Text, useColorModeValue } from '@chakra-ui/react'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard,
  FileText,
  Settings,
  BarChart3
} from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  display?: object
  position?: object
  zIndex?: object
}

const navigationItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Risk Logs', href: '/logs', icon: FileText },
  { name: 'Baselines', href: '/baselines', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function Sidebar({ isOpen, onClose, display, position, zIndex }: SidebarProps) {
  const pathname = usePathname()
  const bg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const activeBg = useColorModeValue('brand.50', 'brand.900')
  const activeColor = useColorModeValue('brand.600', 'brand.200')

  return (
    <Box
      as="nav"
      w="240px"
      h="full"
      bg={bg}
      borderRight="1px"
      borderColor={borderColor}
      display={display}
      position={position}
      zIndex={zIndex}
      top="60px" // Account for navbar height
    >
      <VStack spacing={1} p={4} align="stretch">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          
          return (
            <Link
              href={item.href}
              key={item.name}
              display="flex"
              alignItems="center"
              gap={3}
              p={3}
              borderRadius="md"
              bg={isActive ? activeBg : 'transparent'}
              color={isActive ? activeColor : 'inherit'}
              _hover={{
                bg: useColorModeValue('gray.100', 'gray.700')
              }}
              onClick={() => {
                // Close mobile menu after navigation
                if (window.innerWidth < 1024) {
                  onClose()
                }
              }}
            >
              <Icon size={20} />
              <Text fontWeight="medium">{item.name}</Text>
            </Link>
          )
        })}
      </VStack>
    </Box>
  )
}
