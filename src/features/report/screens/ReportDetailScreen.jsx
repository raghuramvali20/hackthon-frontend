import { useMemo } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { Badge } from '../../../shared/components/Badge.jsx'
import { Button } from '../../../shared/components/Button.jsx'
import { Card } from '../../../shared/components/Card.jsx'
import { formatTimestamp } from '../../../shared/utils/formatters.js'
import { useReportController } from '../controllers/useReportController.js'
import { FixesSummaryList } from '../components/FixesSummaryList.jsx'
import { SideBySideDiff } from '../components/SideBySideDiff.jsx'
import { VerificationSummary } from '../components/VerificationSummary.jsx'
import { getVerificationStatus } from '../models/report.js'

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
            <Badge status={getVerificationStatus(report)} />
          </div>
          <p className="mt-2 text-sm text-muted">Created {formatTimestamp(report.createdAt)}</p>
          {report.sourceType === 'url' && report.sourceUrl && (
            <p className="mt-1 text-sm text-muted">
              Scanned website: <a className="font-medium text-brand hover:underline" href={report.sourceUrl} rel="noopener noreferrer" target="_blank">{report.sourceUrl}</a>
            </p>
          )}
        </div>
        <Link to={`/reports/${report.id}/certificate`}>
          <Button variant="secondary">View report details</Button>
        </Link>
      </div>

      <VerificationSummary
        scoreAfter={report.scoreAfter}
        scoreBefore={report.scoreBefore}
        verification={report.verification}
      />

      {['UNAVAILABLE', 'SKIPPED_LIMIT'].includes(report.aiRepairStatus) && (
        <Card className="border-warn/40 p-4 text-sm text-warn" role="status">
          {report.aiRepairMessage || 'AI repair was unavailable; only deterministic repairs were applied.'}
        </Card>
      )}

      <section aria-labelledby="repaired-output-title" className="space-y-3">
        <div>
          <h2 className="text-lg font-bold" id="repaired-output-title">Original and updated code</h2>
          <p className="mt-1 text-sm text-muted">Compare the repair, inspect changed lines, and copy or download the updated HTML.</p>
        </div>
        <SideBySideDiff report={report} />
      </section>

      <Card className="space-y-4 p-5 sm:p-6">
        <div>
          <h2 className="font-bold">Automatic fixes <span className="font-medium text-muted">({report.appliedFixes.length})</span></h2>
          <p className="mt-1 text-sm text-muted">Changes applied automatically and confirmed by the supported re-scan.</p>
        </div>
        <FixesSummaryList fixes={report.appliedFixes} />
      </Card>
      {report.aiChanges.length > 0 && (
        <Card className="space-y-4 border-warn/40 p-5 sm:p-6">
          <div>
            <h2 className="font-bold">AI-applied changes · review recommended ({report.aiChanges.length})</h2>
            <p className="mt-1 text-sm text-muted">These changes are already in the updated HTML. Confirm their wording matches your intent; the scanner checks name presence, not whether the name is accurate.</p>
          </div>
          <ul className="space-y-3">
            {report.aiChanges.map((change, index) => (
              <li className="border-l-2 border-warn/50 pl-4 text-sm" key={`${change.ruleId}-${change.findingIndex}-${index}`}>
                <p className="font-semibold text-ink">{change.description}</p>
                <p className="mt-1 text-xs text-muted">{change.ruleId} · {change.attribute}="{change.value}" · human review required</p>
              </li>
            ))}
          </ul>
        </Card>
      )}
      {report.aiSuggestions.length > 0 && (
        <Card className="space-y-4 p-5 sm:p-6">
          <div>
            <h2 className="font-bold">AI suggestions for review ({report.aiSuggestions.length})</h2>
            <p className="mt-1 text-sm text-muted">Suggestions are not applied automatically. Review them against your content and intent.</p>
          </div>
          <ul className="space-y-4">
            {report.aiSuggestions.map((suggestion, index) => (
              <li className="border-l-2 border-warn/50 pl-4" key={`${suggestion.ruleId}-${suggestion.element}-${index}`}>
                <p className="text-sm font-semibold text-ink">{suggestion.suggestion}</p>
                <p className="mt-1 text-sm leading-6 text-muted">{suggestion.rationale}</p>
                <p className="mt-1 text-xs text-muted">{suggestion.ruleId} {suggestion.element ? `· ${suggestion.element}` : ''}</p>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  )
}
