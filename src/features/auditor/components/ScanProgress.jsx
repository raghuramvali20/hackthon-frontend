export function ScanProgress({ active = false, label = 'Preparing scan' }) {
  if (!active) return null
  return (
    <div aria-live="polite" className="flex items-center gap-3 rounded-xl bg-brand/10 p-4 text-sm text-brand" role="status">
      <span className="size-4 animate-spin rounded-full border-2 border-brand/30 border-t-brand" />
      <span>{label}</span>
    </div>
  )
}
