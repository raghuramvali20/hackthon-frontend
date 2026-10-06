import { Link } from 'react-router-dom'
import { Badge } from '../../../shared/components/Badge.jsx'
import { Button } from '../../../shared/components/Button.jsx'
import { Card } from '../../../shared/components/Card.jsx'
import { formatScore, formatTimestamp } from '../../../shared/utils/formatters.js'
import { useReportController } from '../controllers/useReportController.js'

export function DashboardOverviewScreen() {
  const { reports, isLoading, error, refresh } = useReportController()
  const averageScore = reports.length
    ? Math.round(reports.reduce((sum, report) => sum + Number(report.scoreAfter || 0), 0) / reports.length)
    : null

  return (
    <div className="space-y-7">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand">Workspace overview</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Scan reports</h1>
          <p className="mt-2 text-muted">Review fixes and verification output from your previous scans.</p>
        </div>
        <Button as={Link} to="/audit">Start a scan <span aria-hidden="true">→</span></Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Metric title="Total scans" value={isLoading ? '…' : reports.length} />
        <Metric title="Average final score" value={isLoading ? '…' : averageScore === null ? '—' : formatScore(averageScore)} />
        <Metric title="Verified reports" value={isLoading ? '…' : reports.filter((item) => item.formalCertificate?.verificationStatus === 'FORMALLY_VERIFIED').length} />
      </div>

      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="font-bold">Recent reports</h2>
          <Button onClick={() => refresh().catch(() => {})} variant="ghost">Refresh</Button>
        </div>
        {error ? (
          <div className="p-6">
            <p className="text-sm text-danger" role="alert">{error}</p>
            <p className="mt-2 text-xs text-muted">Check that the backend is running and your session is valid.</p>
          </div>
        ) : isLoading ? (
          <p className="p-6 text-sm text-muted">Loading reports…</p>
        ) : reports.length === 0 ? (
          <div className="p-8 text-center">
            <p className="font-semibold">No scans yet</p>
            <p className="mt-1 text-sm text-muted">Run your first repair to create a report.</p>
          </div>
        ) : (
          <ul className="divide-y divide-line">
            {reports.map((report) => (
              <li key={report.id}>
                <Link className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 hover:bg-slate-50" to={`/reports/${report.id}`}>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold">Accessibility repair · {report.id.slice(-8)}</span>
                    <span className="mt-1 block text-xs text-muted">{formatTimestamp(report.createdAt)}</span>
                  </span>
                  <span className="flex items-center gap-3">
                    <span className="text-sm font-bold">{formatScore(report.scoreBefore)} <span className="text-muted">→</span> {formatScore(report.scoreAfter)}</span>
                    <Badge status={report.formalCertificate?.verificationStatus} />
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

function Metric({ title, value }) {
  return (
    <Card className="p-5">
      <p className="text-sm font-medium text-muted">{title}</p>
      <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
    </Card>
  )
}
