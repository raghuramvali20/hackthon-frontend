export function ProofTheoremCard({ theorem }) {
  const isPassed = theorem?.status === 'PASSED'
  return (
    <article className="rounded-xl border border-line p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h3 className="font-semibold">{theorem?.title || theorem?.theorem || 'Unnamed supported check'}</h3>
        <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${isPassed ? 'bg-good/10 text-good' : 'bg-warn/10 text-warn'}`}>
          {theorem?.status || 'NO STATUS'}
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-muted">{theorem?.message || theorem?.proof || 'No details supplied.'}</p>
    </article>
  )
}
