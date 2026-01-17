"use client"

import { motion, Variants } from 'framer-motion'

// Premium motion variants for consistent animations
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } }
}

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } 
  }
}

export const slideDown: Variants = {
  hidden: { opacity: 0, y: -30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } 
  }
}

export const slideLeft: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } 
  }
}

export const slideRight: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } 
  }
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } 
  }
}

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

export const staggerContainerSlow: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
}

// Premium hover animations
export const hoverScale = {
  whileHover: { scale: 1.02, transition: { duration: 0.2 } },
  whileTap: { scale: 0.98 }
}

export const hoverScaleLift = {
  whileHover: { 
    scale: 1.02, 
    y: -4, 
    transition: { duration: 0.2 } 
  },
  whileTap: { scale: 0.98 }
}

export const hoverScaleLiftStrong = {
  whileHover: { 
    scale: 1.05, 
    y: -8, 
    transition: { duration: 0.2 } 
  },
  whileTap: { scale: 0.95 }
}

export const hoverGlow = {
  whileHover: { 
    boxShadow: '0 0 30px rgba(79, 139, 255, 0.4)',
    transition: { duration: 0.2 } 
  }
}

export const hoverGlowViolet = {
  whileHover: { 
    boxShadow: '0 0 30px rgba(124, 92, 255, 0.4)',
    transition: { duration: 0.2 } 
  }
}

export const hoverGlowTeal = {
  whileHover: { 
    boxShadow: '0 0 30px rgba(20, 184, 166, 0.4)',
    transition: { duration: 0.2 } 
  }
}

// Page transition variants
export const pageTransition: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.4, ease: 'easeOut' } 
  },
  exit: { opacity: 0, y: -20 }
}

// Risk level animations
export const riskLevelAnimations = {
  low: {
    whileHover: { boxShadow: '0 0 25px rgba(34, 197, 94, 0.4)' }
  },
  medium: {
    whileHover: { boxShadow: '0 0 25px rgba(245, 158, 11, 0.4)' }
  },
  high: {
    whileHover: { boxShadow: '0 0 25px rgba(239, 68, 68, 0.4)' }
  },
  critical: {
    whileHover: { boxShadow: '0 0 30px rgba(220, 38, 38, 0.6)' }
  }
}

// Button animations
export const buttonPress = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 },
  transition: { type: 'spring', stiffness: 400, damping: 17 }
}

// Modal animations
export const modalOverlay = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 }
}

export const modalContent = {
  initial: { opacity: 0, scale: 0.9, y: 20 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.9, y: 20 },
  transition: { duration: 0.3, ease: 'easeOut' }
}

// Filter/Drawer animations
export const drawerSlide = {
  initial: { x: '100%' },
  animate: { x: 0 },
  exit: { x: '100%' },
  transition: { duration: 0.3, ease: 'easeOut' }
}

export const filterPanel = {
  initial: { opacity: 0, height: 0 },
  animate: { opacity: 1, height: 'auto' },
  exit: { opacity: 0, height: 0 },
  transition: { duration: 0.3, ease: 'easeOut' }
}

// Animated counter component
export const AnimatedCounter = ({ 
  value, 
  duration = 2, 
  className = '' 
}: { 
  value: number
  duration?: number
  className?: string 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration }}
      >
        {value.toLocaleString()}
      </motion.span>
    </motion.div>
  )
}

// Premium card wrapper with motion
export const MotionCard = ({ 
  children, 
  className = '', 
  variants = slideUp,
  ...props 
}: {
  children: React.ReactNode
  className?: string
  variants?: Variants
  [key: string]: any
}) => {
  return (
    <motion.div
      variants={variants}
      {...hoverScaleLift}
      className={`card-premium ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Glass morphism card with motion
export const GlassCard = ({ 
  children, 
  className = '', 
  variants = slideUp,
  ...props 
}: {
  children: React.ReactNode
  className?: string
  variants?: Variants
  [key: string]: any
}) => {
  return (
    <motion.div
      variants={variants}
      {...hoverScaleLift}
      className={`glass-effect-card ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Animated gradient background
export const AnimatedGradient = ({ 
  className = '', 
  children 
}: {
  className?: string
  children?: React.ReactNode
}) => {
  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      animate={{
        background: [
          'radial-gradient(circle at 50% 50%, rgba(79, 139, 255, 0.15) 0%, transparent 70%)',
          'radial-gradient(circle at 50% 50%, rgba(124, 92, 255, 0.15) 0%, transparent 70%)',
          'radial-gradient(circle at 50% 50%, rgba(20, 184, 166, 0.15) 0%, transparent 70%)',
          'radial-gradient(circle at 50% 50%, rgba(79, 139, 255, 0.15) 0%, transparent 70%)'
        ]
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
    >
      {children}
    </motion.div>
  )
}
