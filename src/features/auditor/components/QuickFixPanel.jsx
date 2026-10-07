export function QuickFixPanel({ fixes = [] }) {
  if (!fixes.length) {
    return <p className="text-sm text-muted">No automatic fixes were needed or safe to apply.</p>
  }

  return (
    <ul className="space-y-3">
      {fixes.map((fix, index) => (
        <li className="flex gap-3 text-sm" key={`${fix}-${index}`}>
          <span aria-hidden="true" className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-emerald-50 text-xs font-bold text-good">✓</span>
          <span className="leading-6 text-ink">{fix}</span>
        </li>
      ))}
    </ul>
  )
}
