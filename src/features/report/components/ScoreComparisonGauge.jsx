import { formatScore } from '../../../shared/utils/formatters.js'

export function ScoreComparisonGauge({ before, after }) {
  const beforeValue = clampScore(before)
  const afterValue = clampScore(after)
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <Score title="Before repair" value={beforeValue} />
      <Score title="After repair" value={afterValue} emphasized />
    </div>
  )
}

function Score({ title, value, emphasized = false }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-medium text-muted">{title}</span>
        <span className={`font-bold ${emphasized ? 'text-good' : 'text-ink'}`}>{formatScore(value)}</span>
      </div>
      <div
        aria-label={`${title}: ${formatScore(value)}`}
        aria-valuemax="100"
        aria-valuemin="0"
        aria-valuenow={value}
        className="h-2.5 overflow-hidden rounded-full bg-slate-100"
        role="progressbar"
      >
        <div className={`h-full rounded-full ${emphasized ? 'bg-emerald-500' : 'bg-slate-400'}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}

function clampScore(value) {
  const score = Number(value)
  return Number.isFinite(score) ? Math.max(0, Math.min(100, score)) : 0
}
