'use client'

import { motion } from 'framer-motion'
import { Card } from './card'
import { cn } from '@/lib/utils'
import { HTMLAttributes, forwardRef } from 'react'

interface AnimatedCardProps extends HTMLAttributes<HTMLDivElement> {
  delay?: number
  hover?: boolean
}

export const AnimatedCard = forwardRef<HTMLDivElement, AnimatedCardProps>(
  ({ 
    children, 
    className, 
    delay = 0, 
    hover = true,
    ...props 
  }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.5, 
          delay,
          ease: "easeOut"
        }}
        whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : undefined}
        className={cn("transition-shadow duration-200", className)}
        {...props}
      >
        <Card>
          {children}
        </Card>
      </motion.div>
    )
  }
)

AnimatedCard.displayName = "AnimatedCard"
