// Badge component for risk severity levels
interface BadgeProps {
  children: React.ReactNode
  variant: 'low' | 'medium' | 'high' | 'critical'
}

export function Badge({ children, variant }: BadgeProps) {
  return (
    <span className={`badge badge-${variant}`}>
      {children}
    </span>
  )
}
