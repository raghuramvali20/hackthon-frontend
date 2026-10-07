export const statusStyles = {
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

export const buttonStyles = {
  primary:
    'bg-brand text-white shadow-sm shadow-brand/20 hover:-translate-y-0.5 hover:bg-brand-dark hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0',
  secondary:
    'border border-line bg-surface text-ink hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-50',
  danger:
    'bg-danger/10 text-danger hover:bg-danger/20 disabled:cursor-not-allowed disabled:opacity-50',
  ghost: 'text-muted hover:bg-hover hover:text-ink',
}
