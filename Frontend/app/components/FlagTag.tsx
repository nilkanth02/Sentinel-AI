// Flag Tag component for risk flags
interface FlagTagProps {
  flag: string
  variant?: 'low' | 'medium' | 'high' | 'critical'
  onRemove?: () => void
}

export function FlagTag({ flag, variant = 'medium', onRemove }: FlagTagProps) {
  return (
    <span className={`flag-tag flag-tag-${variant}`}>
      {flag}
      {onRemove && (
        <button 
          className="flag-remove"
          onClick={onRemove}
          aria-label={`Remove ${flag} flag`}
        >
          ×
        </button>
      )}
    </span>
  )
}
