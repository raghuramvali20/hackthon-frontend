import { useMemo } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { Badge } from '../../../shared/components/Badge.jsx'
import { Button } from '../../../shared/components/Button.jsx'
import { Card } from '../../../shared/components/Card.jsx'
import { formatTimestamp } from '../../../shared/utils/formatters.js'
import { useReportController } from '../controllers/useReportController.js'
import { FixesSummaryList } from '../components/FixesSummaryList.jsx'
import { ScoreComparisonGauge } from '../components/ScoreComparisonGauge.jsx'
import { SideBySideDiff } from '../components/SideBySideDiff.jsx'

export function ReportDetailScreen() {
  const { reportId } = useParams()
  const location = useLocation()
  const { reports, isLoading: isHistoryLoading, error: historyError } = useReportController()
  const passedReport = location.state?.report
  const hasPassedReport = passedReport?.id === reportId
  const report = useMemo(() => {
    if (hasPassedReport) return passedReport
    return reports.find((item) => item.id === reportId) || null
  }, [hasPassedReport, passedReport, reportId, reports])
  const isLoading = !hasPassedReport && isHistoryLoading
  const error = !hasPassedReport ? historyError : ''

  if (isLoading) return <p className="text-sm text-muted">Loading report…</p>
  if (error || !report) return <p className="text-sm text-danger" role="alert">{error || 'Report not found.'}</p>

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link className="text-sm font-semibold text-brand hover:underline" to="/reports">← All reports</Link>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Repair report</h1>
            <Badge status={report.formalCertificate?.verificationStatus} />
          </div>
          <p className="mt-2 text-sm text-muted">Created {formatTimestamp(report.createdAt)}</p>
        </div>
        <Link to={`/reports/${report.id}/certificate`}>
          <Button variant="secondary">View verification details</Button>
        </Link>
      </div>

      <Card className="space-y-4 p-5 sm:p-6">
        <h2 className="text-sm font-semibold text-muted">Accessibility score</h2>
        <ScoreComparisonGauge after={report.scoreAfter} before={report.scoreBefore} />
      </Card>

      <section aria-labelledby="repaired-output-title" className="space-y-3">
        <div>
          <h2 className="text-lg font-bold" id="repaired-output-title">Repaired output</h2>
          <p className="mt-1 text-sm text-muted">Review and copy the updated HTML. The original is available below.</p>
        </div>
        <SideBySideDiff report={report} />
      </section>

      <Card className="space-y-4 p-5 sm:p-6">
        <div>
          <h2 className="font-bold">Applied fixes <span className="font-medium text-muted">({report.appliedFixes.length})</span></h2>
          <p className="mt-1 text-sm text-muted">Changes reported by the repair pipeline.</p>
        </div>
        <FixesSummaryList fixes={report.appliedFixes} />
      </Card>
    </div>
  )
}
