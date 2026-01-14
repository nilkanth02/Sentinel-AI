'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

interface PageTransitionProps {
  children: ReactNode
  className?: string
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1
  },
  out: {
    opacity: 0,
    y: -20,
    scale: 1.02
  }
}

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.4
}

export function PageTransition({ children, className }: PageTransitionProps) {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

// Skeleton loader component
export function SkeletonLoader({ 
  className = '',
  lines = 3,
  height = 'h-4' 
}: {
  className?: string
  lines?: number
  height?: string
}) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`${height} bg-muted rounded animate-pulse`}
          style={{
            animationDelay: `${i * 0.1}s`,
            animationDuration: '1.5s'
          }}
        />
      ))}
    </div>
  )
}

// Card skeleton loader
export function CardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`rounded-xl border bg-card p-6 space-y-4 ${className}`}>
      <div className="flex items-center space-x-4">
        <div className="h-12 w-12 bg-muted rounded-full animate-pulse" />
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
          <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-muted rounded animate-pulse" />
        <div className="h-3 bg-muted rounded animate-pulse w-5/6" />
      </div>
    </div>
  )
}

// Table skeleton loader
export function TableSkeleton({ 
  rows = 5,
  columns = 4,
  className = '' 
}: {
  rows?: number
  columns?: number
  className?: string
}) {
  return (
    <div className={`space-y-3 ${className}`}>
      {/* Header */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="h-8 bg-muted rounded animate-pulse" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="grid gap-4"
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div
              key={colIndex}
              className="h-10 bg-muted rounded animate-pulse"
              style={{
                animationDelay: `${(rowIndex * columns + colIndex) * 0.05}s`
              }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
