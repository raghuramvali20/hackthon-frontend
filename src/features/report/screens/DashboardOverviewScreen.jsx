import { Link } from 'react-router-dom'
import { Badge } from '../../../shared/components/Badge.jsx'
import { Button } from '../../../shared/components/Button.jsx'
import { Card } from '../../../shared/components/Card.jsx'
import { formatTimestamp } from '../../../shared/utils/formatters.js'
import { useReportController } from '../controllers/useReportController.js'
import {
  getIssueCounts,
  getReportLabel,
  getVerificationStatus,
} from '../models/report.js'

export function DashboardOverviewScreen() {
  const { reports, isLoading, error, refresh } = useReportController()
  const reportsWithSupportedChecks = reports.filter(
    (report) => report.verification?.schemaVersion === 1,
  )
  const totalRemaining = reportsWithSupportedChecks.reduce(
    (sum, report) => sum + (getIssueCounts(report)?.remaining || 0),
    0,
  )
  const totalAutomaticFixes = reportsWithSupportedChecks.reduce(
    (sum, report) => sum + (getIssueCounts(report)?.fixed || 0),
    0,
  )

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">Workspace overview</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Good work starts with access.</h1>
          <p className="mt-2 text-muted">Here’s the latest from your accessibility workspace.</p>
        </div>
        <Button as={Link} to="/audit">
          <svg aria-hidden="true" fill="none" height="17" viewBox="0 0 24 24" width="17">
            <path d="M12 5v14m-7-7h14" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
          </svg>
          New accessibility scan
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Metric icon="scans" title="Total scans" value={isLoading ? '…' : reports.length} caption="Saved in your workspace" />
        <Metric icon="score" title="Findings remaining" value={isLoading ? '…' : reportsWithSupportedChecks.length ? totalRemaining : '—'} caption="Across supported checks in available reports" />
        <Metric icon="verified" title="Automatic fixes" value={isLoading ? '…' : reportsWithSupportedChecks.length ? totalAutomaticFixes : '—'} caption="Only changes confirmed by a follow-up check" />
      </div>

      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4 sm:px-6">
          <div>
            <h2 className="font-bold">Recent activity</h2>
            <p className="mt-1 text-xs text-muted">Your most recent accessibility repair runs</p>
          </div>
          <Button onClick={() => refresh().catch(() => {})} size="sm" variant="secondary">
            <svg aria-hidden="true" fill="none" height="15" viewBox="0 0 24 24" width="15">
              <path d="M20 7v5h-5M4 17v-5h5m10-1a7 7 0 0 0-12.5-4L4 9m16 6-2.5 2A7 7 0 0 1 5 13" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
            </svg>
            Refresh
          </Button>
        </div>
        {error ? (
          <div className="p-6">
            <p className="text-sm text-danger" role="alert">{error}</p>
            <p className="mt-2 text-xs text-muted">Check that the backend is running and your session is valid.</p>
          </div>
        ) : isLoading ? (
          <p className="p-6 text-sm text-muted">Loading reports…</p>
        ) : reports.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-brand/10 text-brand">
              <svg aria-hidden="true" fill="none" height="23" viewBox="0 0 24 24" width="23">
                <path d="M4 7V5a1 1 0 0 1 1-1h2m10 0h2a1 1 0 0 1 1 1v2m0 10v2a1 1 0 0 1-1 1h-2m-10 0H5a1 1 0 0 1-1-1v-2" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
                <path d="M8 12h8m-4-4v8" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
              </svg>
            </span>
            <p className="mt-4 font-semibold">Your workspace is ready</p>
            <p className="mx-auto mt-1 max-w-sm text-sm text-muted">Run your first repair to compare supported check results, review proposed fixes, and create a report.</p>
            <Button as={Link} className="mt-5" to="/audit" variant="secondary">Start your first scan</Button>
          </div>
        ) : (
          <ul className="divide-y divide-line">
            {reports.map((report) => (
              <li key={report.id}>
                <Link className="group flex flex-wrap items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-hover sm:px-6" to={`/reports/${report.id}`}>
                  <span className="flex min-w-0 items-center gap-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand">
                      <svg aria-hidden="true" fill="none" height="19" viewBox="0 0 24 24" width="19">
                        <path d="M4 7V5a1 1 0 0 1 1-1h2m10 0h2a1 1 0 0 1 1 1v2m0 10v2a1 1 0 0 1-1 1h-2m-10 0H5a1 1 0 0 1-1-1v-2" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" />
                        <path d="M8 12h8m-4-4v8" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" />
                      </svg>
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-ink">{getReportLabel(report)}</span>
                      <span className="mt-1 block text-xs text-muted">
                        {formatTimestamp(report.createdAt)} <span className="px-1">·</span>
                        {` ${report.appliedFixes.length} ${report.appliedFixes.length === 1 ? 'fix' : 'fixes'}`}
                      </span>
                    </span>
                  </span>
                  <span className="ml-auto flex flex-wrap items-center justify-end gap-3 sm:ml-4">
                    <FindingSummary report={report} />
                    <Badge status={getVerificationStatus(report)} />
                    <svg aria-hidden="true" className="hidden text-muted transition-transform group-hover:translate-x-0.5 sm:block" fill="none" height="17" viewBox="0 0 24 24" width="17">
                      <path d="m9 18 6-6-6-6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
                    </svg>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}

function Metric({ icon, title, value, caption }) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <p className="text-sm font-semibold text-muted">{title}</p>
        <span className="grid size-9 place-items-center rounded-xl bg-brand/10 text-brand">
          <MetricIcon type={icon} />
        </span>
      </div>
      <p className="mt-3 text-3xl font-bold tracking-tight">{value}</p>
      <p className="mt-1 text-xs text-muted">{caption}</p>
    </Card>
  )
}

function MetricIcon({ type }) {
  const shapes = {
    scans: <><path d="M4 7V5a1 1 0 0 1 1-1h2m10 0h2a1 1 0 0 1 1 1v2m0 10v2a1 1 0 0 1-1 1h-2m-10 0H5a1 1 0 0 1-1-1v-2" /><path d="M8 12h8m-4-4v8" /></>,
    score: <><path d="M4 19V5m0 14h16" /><path d="m7 15 4-4 3 2 5-6" /></>,
    verified: <><path d="m12 3 8 4v5c0 5-3.4 8-8 9-4.6-1-8-4-8-9V7l8-4Z" /><path d="m8.5 12.2 2.2 2.2 4.8-5" /></>,
  }
  return <svg aria-hidden="true" fill="none" height="19" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" viewBox="0 0 24 24" width="19">{shapes[type]}</svg>
}

function FindingSummary({ report }) {
  const counts = getIssueCounts(report)
  return (
    <span className="text-right">
      <span className="block text-sm font-bold text-ink">
        {counts ? `${counts.remaining} remaining` : 'Legacy report'}
      </span>
      <span className="mt-0.5 block text-[11px] font-medium text-muted">
        {counts ? `${counts.fixed} auto-fixed · ${counts.needsReview} need review` : 'No supported-check data'}
      </span>
    </span>
  )
}
