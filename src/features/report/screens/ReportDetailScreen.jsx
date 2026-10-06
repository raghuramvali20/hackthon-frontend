import { useMemo } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { Badge } from '../../../shared/components/Badge.jsx'
import { Button } from '../../../shared/components/Button.jsx'
import { Card } from '../../../shared/components/Card.jsx'
import { formatTimestamp } from '../../../shared/utils/formatters.js'
import { useReportController } from '../controllers/useReportController.js'
import { SideBySideDiff } from '../components/SideBySideDiff.jsx'
import { FixesSummaryList } from '../components/FixesSummaryList.jsx'
import { ScoreComparisonGauge } from '../components/ScoreComparisonGauge.jsx'

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
    <div className="space-y-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link className="text-sm font-semibold text-brand hover:underline" to="/reports">← All reports</Link>
          <h1 className="mt-3 text-3xl font-bold tracking-tight">Repair report</h1>
          <p className="mt-2 text-sm text-muted">Created {formatTimestamp(report.createdAt)}</p>
        </div>
        <Link to={`/reports/${report.id}/certificate`}>
          <Button variant="secondary">View certificate</Button>
        </Link>
      </div>
      <Card className="space-y-5 p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-bold">Accessibility score</h2>
          <Badge status={report.formalCertificate?.verificationStatus} />
        </div>
        <ScoreComparisonGauge after={report.scoreAfter} before={report.scoreBefore} />
      </Card>
      <Card className="space-y-4 p-5 sm:p-6">
        <h2 className="font-bold">Applied fixes ({report.appliedFixes.length})</h2>
        <FixesSummaryList fixes={report.appliedFixes} />
      </Card>
      <section className="space-y-4">
        <h2 className="text-lg font-bold">Code comparison</h2>
        <SideBySideDiff report={report} />
      </section>
    </div>
  )
}
