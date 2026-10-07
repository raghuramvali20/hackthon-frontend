import { formatScore } from '../../../shared/utils/formatters.js'

export function ScoreComparisonGauge({ before, after, breakdown }) {
  const beforeValue = clampScore(before)
  const afterValue = clampScore(after)
  return (
    <div className="rounded-xl border border-line bg-subtle p-4">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-ink">Supported-check pass rate</h3>
        <p className="mt-1 text-xs leading-5 text-muted">Percentage of applicable supported check categories with no detected finding. This is not a full WCAG score.</p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Score title="Before repair" value={beforeValue} stats={breakdown?.before} />
        <Score title="After repair" value={afterValue} stats={breakdown?.after} emphasized />
      </div>
    </div>
  )
}

function Score({ title, value, stats, emphasized = false }) {
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
        className="h-2.5 overflow-hidden rounded-full bg-line"
        role="progressbar"
      >
        <div className={`h-full rounded-full ${emphasized ? 'bg-good' : 'bg-muted'}`} style={{ width: `${value}%` }} />
      </div>
      {stats && (
        <p className="mt-1.5 text-xs text-muted">
          {stats.passed} of {stats.applicable} applicable check categories passed
        </p>
      )}
    </div>
  )
}

function clampScore(value) {
  const score = Number(value)
  return Number.isFinite(score) ? Math.max(0, Math.min(100, score)) : 0
}
