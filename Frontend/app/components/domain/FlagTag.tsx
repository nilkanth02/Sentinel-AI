'use client'

import { Badge } from '../ui/Badge'

interface FlagTagProps {
  flag: string
  variant?: 'low' | 'medium' | 'high' | 'critical'
  onRemove?: () => void
}

export function FlagTag({ flag, variant = 'medium', onRemove }: FlagTagProps) {
  return (
    <Badge variant={variant} style={{ position: 'relative', paddingRight: '24px' }}>
      {flag}
      {onRemove && (
        <button
          onClick={onRemove}
          style={{
            position: 'absolute',
            right: '8px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            color: 'currentColor',
            cursor: 'pointer',
            fontSize: '16px',
            lineHeight: '1'
          }}
          aria-label={`Remove ${flag} flag`}
        >
          ×
        </button>
      )}
    </Badge>
  )
}
