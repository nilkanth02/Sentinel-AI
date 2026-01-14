'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard,
  FileText,
  Settings,
  BarChart3
} from 'lucide-react'

const navigationItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/logs', label: 'Risk Logs', icon: FileText },
  { href: '/baselines', label: 'Baselines', icon: BarChart3 },
  { href: '/settings', label: 'Settings', icon: Settings },
]

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export function SidebarModern({ isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div className={cn(
      "flex flex-col h-full bg-card border-r transition-all duration-200",
      isOpen ? "w-64" : "w-0"
    )}>
      <div className="p-4">
        <h2 className="text-lg font-semibold text-foreground">Navigation</h2>
      </div>
      
      <Separator />
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            
            return (
              <li key={item.href}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    isActive && "bg-primary text-primary-foreground"
                  )}
                  onClick={() => {
                    // Navigate to the item
                    window.location.href = item.href
                  }}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
