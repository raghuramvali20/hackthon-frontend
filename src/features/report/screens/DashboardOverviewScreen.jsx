import { Link } from 'react-router-dom'
import { Badge } from '../../../shared/components/Badge.jsx'
import { Button } from '../../../shared/components/Button.jsx'
import { Card } from '../../../shared/components/Card.jsx'
import { formatTimestamp } from '../../../shared/utils/formatters.js'
import { ScoreComparisonGauge } from '../components/ScoreComparisonGauge.jsx'
import { useReportController } from '../controllers/useReportController.js'
import {
  getIssueCounts,
  getReportLabel,
  getVerificationStatus,
} from '../models/report.js'

export function DashboardOverviewScreen() {
  const { reports, isLoading, error, refresh } = useReportController()
  const latestReport = [...reports].sort(
    (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
  )[0]
  const latestCounts = latestReport ? getIssueCounts(latestReport) : null
  const latestHasSupportedChecks = latestReport?.verification?.schemaVersion === 1
  const latestHasSourceResults = [1, 2].includes(latestReport?.verification?.schemaVersion)

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-5">
        <div className="max-w-2xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand">The repair studio</p>
          <h1 className="display-heading mt-2 text-4xl leading-tight text-ink sm:text-5xl">A clearer view of each page.</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-muted">
            Review your latest supported-check results, revisit earlier runs, and keep each repair in context.
          </p>
        </div>
        <Button as={Link} to="/audit">
          <span aria-hidden="true" className="text-lg leading-none">+</span>
          Start a scan
        </Button>
      </header>

      <section aria-label="Workspace summary" className="grid gap-3 sm:grid-cols-3">
        <SummaryTile
          caption="Saved to your account"
          label="Saved runs"
          value={isLoading ? '…' : reports.length}
          variant="plain"
        />
        <SummaryTile
          caption="From the latest supported-check run"
          label="Findings remaining"
          value={isLoading ? '…' : latestHasSourceResults ? latestCounts?.remaining ?? 0 : '—'}
          variant="vermilion"
        />
        <SummaryTile
          caption="From the latest supported-check run"
          label="Need human review"
          value={isLoading ? '…' : latestHasSourceResults ? latestCounts?.needsReview ?? 0 : '—'}
          variant="citron"
        />
      </section>

      <section aria-labelledby="latest-run-title">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">First look</p>
            <h2 className="mt-1 text-xl font-bold text-ink" id="latest-run-title">Latest repair run</h2>
          </div>
          {latestReport && (
            <span className="hidden text-xs text-muted sm:inline">
              {formatTimestamp(latestReport.createdAt)}
            </span>
          )}
        </div>
        {error ? (
          <Card className="p-6">
            <p className="text-sm font-semibold text-danger" role="alert">{error}</p>
            <p className="mt-2 text-sm text-muted">Check that the backend is running and your session is valid.</p>
            <Button className="mt-4" onClick={() => refresh().catch(() => {})} size="sm" variant="secondary">Try again</Button>
          </Card>
        ) : isLoading ? (
          <Card aria-live="polite" className="p-6 text-sm text-muted" role="status">Loading your saved runs…</Card>
        ) : latestReport ? (
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(16rem,0.8fr)]">
            <Card className="relative overflow-hidden p-5 sm:p-7">
              <div aria-hidden="true" className="paper-grid pointer-events-none absolute right-0 top-0 h-40 w-2/5" />
              <div className="relative">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-line bg-subtle px-3 py-1 text-[11px] font-bold text-ink">
                    <span className="size-2 rounded-full bg-accent ring-1 ring-ink/20" />
                    {latestReport.sourceType === 'react-jsx'
                      ? `${latestReport.sourceFileName || 'React source'} · source only`
                      : latestReport.sourceType === 'url' ? 'Website HTML' : 'HTML page'}
                  </span>
                  <Badge status={getVerificationStatus(latestReport)} />
                </div>
                <h3 className="mt-5 max-w-2xl break-words text-lg font-bold leading-snug text-ink sm:text-xl">
                  {getReportLabel(latestReport)}
                </h3>
                <p className="mt-2 text-xs text-muted sm:hidden">{formatTimestamp(latestReport.createdAt)}</p>
                {latestHasSupportedChecks ? (
                  <div className="mt-5">
                    <ScoreComparisonGauge
                      after={latestReport.scoreAfter}
                      before={latestReport.scoreBefore}
                      breakdown={latestReport.verification.scoreBreakdown}
                    />
                  </div>
                ) : latestReport.verification?.schemaVersion === 2 ? (
                  <div className="mt-5 rounded-xl border border-line bg-subtle p-4">
                    <p className="text-sm font-semibold text-ink">No WCAG score is calculated for JSX source.</p>
                    <p className="mt-1 text-xs leading-5 text-muted">
                      The report lists static patterns inspected in one source file. Dynamic/runtime behavior and untested criteria are not scored.
                    </p>
                  </div>
                ) : (
                  <p className="mt-5 rounded-xl border border-line bg-subtle p-4 text-sm leading-6 text-muted">
                    This is a legacy report without supported-check score details. Its earlier verification data is not treated as a current result.
                  </p>
                )}
                <Button as={Link} className="mt-5" to={`/reports/${latestReport.id}`} variant="secondary">
                  Open latest report <span aria-hidden="true">→</span>
                </Button>
              </div>
            </Card>

            <Card className="flex flex-col justify-between p-5 sm:p-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">After the last re-scan</p>
                <h3 className="display-heading mt-3 text-3xl text-ink">
                  {latestHasSourceResults ? latestCounts?.remaining ?? 0 : '—'}
                  <span className="ml-2 text-base font-sans font-semibold tracking-normal text-muted">remaining</span>
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted">
                  {latestHasSourceResults
                    ? `${latestCounts?.fixed ?? 0} resolved by supported checks · ${latestCounts?.needsReview ?? 0} need human review`
                    : 'No supported-check counts are available for this legacy report.'}
                </p>
              </div>
              <div className="mt-6 border-t border-line pt-4">
                <p className="text-xs leading-5 text-muted">
                  {latestReport.sourceType === 'react-jsx'
                    ? 'Static inspection of one JSX/TSX file only. No source score or full WCAG conclusion is produced.'
                    : 'Results cover the named static checks only. Untested WCAG criteria are not counted as passed.'}
                </p>
                {latestReport.sourceType === 'url' && (
                  <p className="mt-3 border-l-2 border-brand pl-3 text-xs leading-5 text-ink">
                    URL scans read fetched HTML and do not update the live website.
                  </p>
                )}
              </div>
            </Card>
          </div>
        ) : (
          <Card className="relative overflow-hidden border-dashed p-6 sm:p-9">
            <div aria-hidden="true" className="paper-grid pointer-events-none absolute inset-y-0 right-0 w-1/2" />
            <div className="relative max-w-xl">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand">Your first page</p>
              <h3 className="display-heading mt-3 text-3xl leading-tight text-ink">Nothing scanned yet. That’s a clean place to start.</h3>
              <p className="mt-3 text-sm leading-6 text-muted">
                Use the single “Start a scan” action above to paste HTML, drop an HTML file, or scan a public URL. You’ll preview findings before approving any repair.
              </p>
            </div>
          </Card>
        )}
      </section>

      <section aria-labelledby="history-title">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">Your work, kept in context</p>
            <h2 className="mt-1 text-xl font-bold text-ink" id="history-title">Saved scan history</h2>
          </div>
          {!isLoading && reports.length > 0 && (
            <Button onClick={() => refresh().catch(() => {})} size="sm" variant="secondary">
              Refresh history
            </Button>
          )}
        </div>
        <Card className="overflow-hidden">
          {isLoading ? (
            <p className="p-5 text-sm text-muted">Loading reports…</p>
          ) : reports.length === 0 ? (
            <p className="p-5 text-sm leading-6 text-muted">
              Saved runs will appear here with their source, date, and remaining supported-check findings.
            </p>
          ) : (
            <ul className="divide-y divide-line">
              {[...reports]
                .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
                .map((report) => (
                  <HistoryRow key={report.id} report={report} />
                ))}
            </ul>
          )}
        </Card>
      </section>
    </div>
  )
}

function SummaryTile({ label, value, caption, variant }) {
  const variantClass = {
    plain: 'bg-surface',
    vermilion: 'summary-vermilion bg-brand text-white',
    citron: 'bg-accent text-ink',
  }[variant]
  const captionClass = variant === 'vermilion' ? 'text-white/85' : 'text-muted'

  return (
    <div className={`rounded-2xl border border-line p-4 sm:p-5 ${variantClass}`}>
      <p className={`text-xs font-semibold ${variant === 'vermilion' ? 'text-white/90' : 'text-muted'}`}>{label}</p>
      <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
      <p className={`mt-1 text-[11px] leading-4 ${captionClass}`}>{caption}</p>
    </div>
  )
}

function HistoryRow({ report }) {
  const counts = getIssueCounts(report)

  return (
    <li>
      <Link
        className="group flex flex-col gap-3 px-4 py-4 transition-colors hover:bg-hover sm:flex-row sm:items-center sm:justify-between sm:px-5"
        to={`/reports/${report.id}`}
      >
        <span className="flex min-w-0 items-start gap-3">
          <span aria-hidden="true" className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl bg-subtle text-brand">
            <svg fill="none" height="18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" viewBox="0 0 24 24" width="18">
              <path d="M13 3H6v18h12V8l-5-5Z" />
              <path d="M13 3v5h5M9 13h6m-6 4h6" />
            </svg>
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-bold text-ink">{getReportLabel(report)}</span>
            <span className="mt-1 block text-xs text-muted">
              {formatTimestamp(report.createdAt)} · {report.sourceType === 'url' ? 'Website HTML' : 'Pasted or uploaded HTML'}
            </span>
          </span>
        </span>
        <span className="flex flex-wrap items-center gap-3 pl-12 sm:pl-0">
          <span className="text-xs font-semibold text-muted">
            {counts ? `${counts.remaining} remaining · ${counts.needsReview} review` : 'Legacy report'}
          </span>
          <Badge status={getVerificationStatus(report)} />
          <span aria-hidden="true" className="text-muted transition-transform group-hover:translate-x-1">→</span>
        </span>
      </Link>
    </li>
  )
}
