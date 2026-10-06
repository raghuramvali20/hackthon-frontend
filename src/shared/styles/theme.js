export const statusStyles = {
  FORMALLY_VERIFIED: 'bg-emerald-50 text-good ring-emerald-200',
  PARTIAL_VERIFICATION: 'bg-amber-50 text-warn ring-amber-200',
  UNVERIFIED: 'bg-slate-100 text-muted ring-slate-200',
  ERROR: 'bg-rose-50 text-danger ring-rose-200',
}

export const buttonStyles = {
  primary:
    'bg-brand text-white hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50',
  secondary:
    'border border-line bg-white text-ink hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-50',
  danger:
    'bg-rose-50 text-danger hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50',
  ghost: 'text-muted hover:bg-slate-100 hover:text-ink',
}
