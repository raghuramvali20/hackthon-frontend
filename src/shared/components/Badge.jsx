export function Badge({ children, status, className = '' }) {
  const label = children || status || 'UNVERIFIED'
  const styles = {
    PASSED_SUPPORTED_CHECKS: 'bg-good/10 text-good ring-good/20',
    ISSUES_REMAIN: 'bg-danger/10 text-danger ring-danger/20',
    NEEDS_REVIEW: 'bg-warn/10 text-warn ring-warn/20',
    REMAINS: 'bg-danger/10 text-danger ring-danger/20',
    FIXED: 'bg-good/10 text-good ring-good/20',
    PASSED: 'bg-good/10 text-good ring-good/20',
    NOT_APPLICABLE: 'bg-hover text-muted ring-line',
    LEGACY_UNVERIFIED: 'bg-hover text-muted ring-line',
    UNVERIFIED: 'bg-hover text-muted ring-line',
    ERROR: 'bg-danger/10 text-danger ring-danger/20',
  }
  const style = styles[status || label] || styles.UNVERIFIED
  const labels = {
    PASSED_SUPPORTED_CHECKS: 'Supported checks passed',
    ISSUES_REMAIN: 'Issues remain',
    NEEDS_REVIEW: 'Needs review',
    LEGACY_UNVERIFIED: 'Legacy · unverified',
    NOT_APPLICABLE: 'Not applicable',
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${style} ${className}`}
    >
      {labels[label] || String(label).replaceAll('_', ' ')}
    </span>
  )
}
