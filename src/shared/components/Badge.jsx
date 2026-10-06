export function Badge({ children, status, className = '' }) {
  const label = children || status || 'UNVERIFIED'
  const styles = {
    FORMALLY_VERIFIED: 'bg-good/10 text-good ring-good/20',
    PARTIAL_VERIFICATION: 'bg-warn/10 text-warn ring-warn/20',
    UNVERIFIED: 'bg-hover text-muted ring-line',
    ERROR: 'bg-danger/10 text-danger ring-danger/20',
  }
  const style = styles[status || label] || styles.UNVERIFIED

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${style} ${className}`}
    >
      {String(label).replaceAll('_', ' ')}
    </span>
  )
}
