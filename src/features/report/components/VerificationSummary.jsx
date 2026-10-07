import { Badge } from '../../../shared/components/Badge.jsx'
import { Card } from '../../../shared/components/Card.jsx'
import { ScoreComparisonGauge } from './ScoreComparisonGauge.jsx'

export function VerificationSummary({ verification, scoreBefore, scoreAfter }) {
  const counts = verification?.issueCounts
  const findingsAfter = verification?.findingsAfter || []
  const checks = verification?.checksPerformed || []
  const isReactSource = verification?.sourceType === 'react-jsx'

  if (!verification) {
    return (
      <Card className="p-5 sm:p-6">
        <h2 className="font-bold">Verification data unavailable</h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          This report uses an older format and cannot be treated as a verified result.
        </p>
        <Badge className="mt-4" status="LEGACY_UNVERIFIED" />
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card className="p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-bold">{isReactSource ? 'React source check results' : 'WCAG repair results'}</h2>
            <p className="mt-1 text-sm text-muted">
              {isReactSource
                ? 'Static inspection of one JSX/TSX file only. This is not a complete WCAG assessment or a rendered-page test.'
                : 'Results for this scan’s supported WCAG 2.2 A/AA criteria subset—not a complete conformance assessment.'}
            </p>
          </div>
          <Badge status={verification.verificationStatus} />
        </div>
        {counts ? (
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            <Count label="Found" value={counts.found} />
            <Count label="No longer detected" value={counts.fixed} tone="good" />
            <Count label="Remaining" value={counts.remaining} tone={counts.remaining ? 'warn' : ''} />
            <Count label="Needs review" value={counts.needsReview} tone={counts.needsReview ? 'warn' : ''} />
            <Count label="Skipped" value={counts.skipped || 0} />
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted">
            This is a legacy report. Its previous score and verification labels are not validated by the current checks.
          </p>
        )}
        {verification.scope && (
          <p className="mt-4 border-t border-line pt-3 text-xs leading-5 text-muted">
            {verification.scope}
          </p>
        )}
        {verification.scoreMethod === 'supported-check-pass-rate-v1' && (
          <div className="mt-5 border-t border-line pt-5">
            <ScoreComparisonGauge
              after={scoreAfter}
              before={scoreBefore}
              breakdown={verification.scoreBreakdown}
            />
          </div>
        )}
      </Card>

      {findingsAfter.length > 0 && (
        <Card className="space-y-3 p-5 sm:p-6">
          <div>
            <h2 className="font-bold">Findings to review</h2>
            <p className="mt-1 text-sm text-muted">These issues were not automatically resolved.</p>
          </div>
          <ul className="divide-y divide-line">
            {findingsAfter.map((finding, index) => (
              <li className="py-3 first:pt-0 last:pb-0" key={`${finding.ruleId}-${finding.element}-${index}`}>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-ink">{finding.message}</p>
                  <Badge status={finding.status} />
                </div>
                <p className="mt-1 text-xs text-muted">
                  {finding.criterion} <span className="px-1">·</span> {finding.element}
                </p>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {checks.length > 0 && (
        <Card className="p-5 sm:p-6">
          <div>
            <h2 className="font-bold">{isReactSource ? 'Static source check catalog' : 'WCAG 2.2 A/AA criteria checked'}</h2>
            <p className="mt-1 text-sm text-muted">
              {isReactSource
                ? 'Statuses describe only patterns inspected in this file. “Not checked” and “needs review” are not passes.'
                : 'This is a limited subset. A passing result applies only to these static HTML checks.'}
            </p>
          </div>
          <ul className="mt-3 divide-y divide-line">
            {checks.map((check) => (
              <li className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm" key={check.id}>
                <span>
                  <span className="block font-semibold text-ink">{check.title}</span>
                  <span className="mt-1 block max-w-2xl text-xs leading-5 text-muted">
                    {check.criterion ? `Success criterion ${check.criterion}` : 'No criterion assigned'}
                    {check.wcagVersion ? ` · WCAG ${check.wcagVersion}` : ''}
                    {check.detectionMethod ? ` · ${check.detectionMethod}` : ''}
                    {check.limitations ? ` · ${check.limitations}` : ''}
                  </span>
                </span>
                <span className="shrink-0 text-right">
                  <span className="block text-xs font-semibold text-muted">{String(check.status || 'UNKNOWN').replaceAll('_', ' ')}</span>
                  {check.category && (
                    <span className="mt-1 block text-[10px] font-medium uppercase tracking-wide text-muted">
                      {check.category.replaceAll('-', ' ')}
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  )
}

function Count({ label, value, tone = '' }) {
  const color = tone === 'good' ? 'text-good' : tone === 'warn' ? 'text-warn' : 'text-ink'
  return (
    <div className="rounded-xl border border-line bg-subtle p-3">
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="mt-1 text-xs font-medium text-muted">{label}</p>
    </div>
  )
}
