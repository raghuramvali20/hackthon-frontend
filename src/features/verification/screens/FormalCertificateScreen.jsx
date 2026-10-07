import { Link, useParams } from 'react-router-dom'
import { Badge } from '../../../shared/components/Badge.jsx'
import { Card } from '../../../shared/components/Card.jsx'
import { formatTimestamp } from '../../../shared/utils/formatters.js'
import { ProofHashCopy } from '../components/ProofHashCopy.jsx'
import { useVerificationController } from '../controllers/useVerificationController.js'

export function FormalCertificateScreen() {
  const { reportId } = useParams()
  const { report, verification, error, isLoading } =
    useVerificationController(reportId)

  if (isLoading) return <p className="text-sm text-muted">Loading verification details…</p>
  if (error || !verification) {
    return <p className="text-sm text-danger" role="alert">{error || 'Verification details unavailable.'}</p>
  }

  const checks = verification.checksPerformed
  const findings = verification.findingsAfter
  const isReactSource = verification.sourceType === 'react-jsx'

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <Link className="text-sm font-semibold text-brand hover:underline" to={`/reports/${reportId}`}>← Back to report</Link>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand">Repair report details</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              {isReactSource ? 'Static source check catalog' : 'WCAG criteria checked'}
            </h1>
          </div>
          <Badge status={verification.verificationStatus} />
        </div>
      </div>

      <p className="rounded-xl border border-warn/30 bg-warn/10 p-4 text-sm leading-6 text-warn">
        {isReactSource
          ? 'This is a static inspection of one JSX/TSX file. Runtime behavior, project-level components, and untested criteria are not assessed; this is not a complete WCAG result or a formal proof.'
          : 'This scan checks only the named WCAG 2.2 A/AA criteria shown below. It is not a complete WCAG conformance assessment or a formal proof.'}
      </p>

      <Card className="space-y-5 p-5 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Fact label="Report" value={report.id} />
          <Fact label="Checked" value={formatTimestamp(verification.issuedAt)} />
          <Fact label={isReactSource ? 'Catalog entries' : 'Checks run'} value={checks.length} />
          <Fact label="Findings after repair" value={findings.length} />
        </div>
        {verification.reportHash && (
          <div className="border-t border-line pt-5">
            <h2 className="mb-2 font-bold">Report data fingerprint</h2>
            <p className="mb-3 text-sm leading-6 text-muted">
              SHA-256 identifier for the original/repaired source and reported check results. It does not prove correctness or conformance.
            </p>
            <ProofHashCopy hash={verification.reportHash} />
          </div>
        )}
      </Card>

      {checks.length > 0 ? (
        <Card className="p-5 sm:p-6">
          <h2 className="font-bold">Checks performed</h2>
          <ul className="mt-3 divide-y divide-line">
            {checks.map((check) => (
              <li className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0" key={check.id}>
                <span>
                  <span className="block text-sm font-semibold text-ink">{check.title}</span>
                  <span className="mt-1 block max-w-2xl text-xs leading-5 text-muted">
                    {check.criterion || 'No criterion assigned'}
                    {check.wcagVersion ? ` · WCAG ${check.wcagVersion}` : ''}
                    {check.detectionMethod ? ` · ${check.detectionMethod}` : ''}
                    {check.limitations ? ` · ${check.limitations}` : ''}
                  </span>
                </span>
                <span className="shrink-0 text-right">
                  <span className="block text-xs font-semibold text-muted">{String(check.status || 'UNKNOWN').replaceAll('_', ' ')}</span>
                  {check.category && <span className="mt-1 block text-[10px] font-medium uppercase tracking-wide text-muted">{check.category.replaceAll('-', ' ')}</span>}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      ) : (
        <Card className="p-5 sm:p-6">
          <h2 className="font-bold">Legacy report</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            This report was created before supported-check verification was added. Its earlier verification data is retained for compatibility, but is not presented as proof.
          </p>
          {verification.legacyStatus && (
            <p className="mt-3 text-xs text-muted">Previous status: {verification.legacyStatus}</p>
          )}
        </Card>
      )}

      {findings.length > 0 && (
        <Card className="space-y-4 p-5 sm:p-6">
          <h2 className="font-bold">Findings after repair</h2>
          <ul className="space-y-4">
            {findings.map((finding, index) => (
              <li className="border-l-2 border-warn/50 pl-4" key={`${finding.ruleId}-${finding.element}-${index}`}>
                <p className="text-sm font-semibold text-ink">{finding.message}</p>
                <p className="mt-1 text-xs text-muted">
                  {finding.criterion || 'Review note'} · {finding.element}
                  {finding.sourceLocation ? ` · line ${finding.sourceLocation.line}, column ${finding.sourceLocation.column}` : ''}
                </p>
                <p className="mt-1 text-xs font-semibold text-warn">{String(finding.status || 'UNKNOWN').replaceAll('_', ' ')}</p>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  )
}

function Fact({ label, value }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-1 break-all text-sm font-medium text-ink">{value}</p>
    </div>
  )
}
