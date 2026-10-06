import { Link, useParams } from 'react-router-dom'
import { Button } from '../../../shared/components/Button.jsx'
import { Card } from '../../../shared/components/Card.jsx'
import { formatTimestamp } from '../../../shared/utils/formatters.js'
import { CertificateBadge } from '../components/CertificateBadge.jsx'
import { ProofHashCopy } from '../components/ProofHashCopy.jsx'
import { ProofTheoremCard } from '../components/ProofTheoremCard.jsx'
import { useVerificationController } from '../controllers/useVerificationController.js'

export function FormalCertificateScreen() {
  const { reportId } = useParams()
  const { report, certificate, error, isLoading } = useVerificationController(reportId)

  if (isLoading) return <p className="text-sm text-muted">Loading certificate…</p>
  if (error || !certificate) return <p className="text-sm text-danger" role="alert">{error || 'Certificate unavailable.'}</p>

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <Link className="text-sm font-semibold text-brand hover:underline" to={`/reports/${reportId}`}>← Back to report</Link>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand">Verification record</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">Certificate</h1>
          </div>
          <CertificateBadge status={certificate.verificationStatus} />
        </div>
      </div>
      <div className="rounded-xl border border-warn/30 bg-warn/10 p-4 text-sm leading-6 text-warn">
        This certificate reflects the backend’s automated checks. The current backend does not provide a mathematically verified proof or a public hash verification endpoint.
      </div>
      <Card className="space-y-5 p-5 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Fact label="Report" value={report.id} />
          <Fact label="Issued" value={formatTimestamp(certificate.issuedAt)} />
          <Fact label="Fixes recorded" value={certificate.totalFixes ?? report.appliedFixes.length} />
          <Fact label="Checks listed" value={certificate.checksPerformed.length} />
        </div>
        <div className="border-t border-line pt-5">
          <h2 className="mb-3 font-bold">Proof hash</h2>
          <ProofHashCopy hash={certificate.proofHash} />
        </div>
      </Card>
      <Card className="space-y-4 p-5 sm:p-6">
        <h2 className="text-lg font-bold">Theorem checks</h2>
        {certificate.theoremProofs.length ? (
          certificate.theoremProofs.map((theorem, index) => <ProofTheoremCard key={`${theorem.theorem}-${index}`} theorem={theorem} />)
        ) : (
          <p className="text-sm text-muted">The backend returned no theorem checks.</p>
        )}
      </Card>
      <Card className="p-5 sm:p-6">
        <h2 className="font-bold">Checks performed</h2>
        <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-muted">
          {certificate.checksPerformed.map((check, index) => <li key={`${check}-${index}`}>{check}</li>)}
        </ul>
      </Card>
      <Link to={`/reports/${reportId}`}><Button variant="secondary">Return to report</Button></Link>
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
