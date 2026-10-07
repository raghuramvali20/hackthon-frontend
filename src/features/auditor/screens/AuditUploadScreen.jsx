import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Badge } from '../../../shared/components/Badge.jsx'
import { Button } from '../../../shared/components/Button.jsx'
import { Card } from '../../../shared/components/Card.jsx'
import { useAuditorController } from '../controllers/useAuditorController.js'
import { CodeEditor } from '../components/CodeEditor.jsx'
import { ScanningScreen } from './ScanningScreen.jsx'
import { STARTER_HTML } from '../models/auditor.js'
import {
  approveRepair as approveRepairSelection,
  approveSafeRepairSet,
  getSelectedRepairs,
  skipRepair as skipRepairSelection,
} from '../models/repairSession.js'

const LANGUAGES = [
  ['en', 'English'],
  ['es', 'Spanish'],
  ['fr', 'French'],
  ['de', 'German'],
  ['it', 'Italian'],
  ['pt', 'Portuguese'],
  ['hi', 'Hindi'],
  ['ja', 'Japanese'],
  ['zh', 'Chinese'],
]

export function AuditUploadScreen() {
  const [rawCode, setRawCode] = useState(STARTER_HTML)
  const [siteUrl, setSiteUrl] = useState('')
  const [sourceType, setSourceType] = useState('html')
  const [preview, setPreview] = useState(null)
  const [selection, setSelection] = useState({ approved: {}, skipped: {} })
  const [languageChoices, setLanguageChoices] = useState({})
  const navigate = useNavigate()
  const {
    isSubmitting,
    error,
    previewSource,
    applyApprovedRepairs,
  } = useAuditorController()

  const safeIds = useMemo(
    () => new Set((preview?.safeRepairs || []).map((repair) => repair.findingId)),
    [preview],
  )
  const { approved, skipped } = selection
  const selectedRepairs = getSelectedRepairs(approved)

  async function handlePreview(event) {
    event.preventDefault()
    const result = await previewSource({
      type: sourceType,
      value: sourceType === 'url' ? siteUrl : rawCode,
    })
    if (result) {
      setPreview(result)
      setSelection({ approved: {}, skipped: {} })
      setLanguageChoices({})
    }
  }

  function approve(repair) {
    setSelection((current) => approveRepairSelection(
      current.approved,
      current.skipped,
      repair,
    ))
  }

  function approveSafeRepairs() {
    const repairs = preview?.safeRepairs || []
    setSelection((current) => approveSafeRepairSet(
      current.approved,
      current.skipped,
      repairs,
    ))
  }

  function skip(findingId) {
    setSelection((current) => skipRepairSelection(
      current.approved,
      current.skipped,
      findingId,
    ))
  }

  async function finishRepair() {
    const report = await applyApprovedRepairs({
      rawCode: preview.rawCode,
      sourceType: preview.sourceType,
      sourceUrl: preview.sourceUrl,
      repairs: selectedRepairs,
      skippedFindingIds: Object.keys(skipped),
      aiRepairStatus: preview.aiRepairStatus,
      aiRepairMessage: preview.aiRepairMessage,
    })
    if (report) navigate(`/reports/${report.id}`, { state: { report } })
  }

  function discardPreview() {
    setPreview(null)
    setSelection({ approved: {}, skipped: {} })
    setLanguageChoices({})
  }

  return (
    <div className="mx-auto max-w-5xl space-y-7">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#282278] via-[#5146e5] to-[#776cf3] px-6 py-8 text-white shadow-xl shadow-indigo-950/10 sm:px-9 sm:py-10">
        <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-20 size-72 rounded-full border border-white/10" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-2 -top-10 size-52 rounded-full border border-white/10" />
        <div className="relative max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-indigo-50">
            <span className="size-1.5 rounded-full bg-emerald-300" />
            ACCESSIBILITY REPAIR WORKSPACE
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Review findings. Approve repairs. Get updated HTML.</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-indigo-100 sm:text-base">
            Scan a page, choose the proposed changes, then review a re-scan. Only the listed static HTML checks are supported.
          </p>
        </div>
      </div>

      <ScanningScreen active={isSubmitting} error={error} />

      {!preview ? (
        <Card className="overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-subtle px-5 py-4 sm:px-6">
            <div>
              <h2 className="font-bold">Choose a source</h2>
              <p className="mt-1 text-xs text-muted">Preview scans and prepares options without changing or saving your code.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div aria-label="Input source" className="inline-flex rounded-lg border border-line bg-surface p-0.5" role="group">
                <SourceButton active={sourceType === 'html'} onClick={() => setSourceType('html')}>Paste HTML</SourceButton>
                <SourceButton active={sourceType === 'url'} onClick={() => setSourceType('url')}>Website URL</SourceButton>
              </div>
              {sourceType === 'html' && (
                <>
                  <Button onClick={() => setRawCode(STARTER_HTML)} size="sm" variant="secondary">Load sample</Button>
                  <Button onClick={() => setRawCode('')} size="sm" variant="ghost">Clear</Button>
                </>
              )}
            </div>
          </div>
          <div className="p-4 sm:p-6">
            <form className="space-y-5" onSubmit={handlePreview}>
              {sourceType === 'html' ? (
                <CodeEditor onChange={setRawCode} value={rawCode} />
              ) : (
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-ink">Public website URL</span>
                  <input
                    autoComplete="url"
                    className="min-h-12 w-full rounded-xl border border-line bg-surface px-4 text-ink shadow-inner focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
                    onChange={(event) => setSiteUrl(event.target.value)}
                    placeholder="https://example.com"
                    required
                    type="url"
                    value={siteUrl}
                  />
                  <span className="mt-2 block text-xs leading-5 text-muted">
                    Scans the HTML delivered by the site, not content rendered later by JavaScript. The server blocks private addresses, non-HTML pages, and responses over 512 KB.
                  </span>
                </label>
              )}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="max-w-xl text-xs leading-5 text-muted">
                  {sourceType === 'html'
                    ? 'HTML only · up to 100,000 characters.'
                    : 'AI proposals are limited to pages no larger than 100 KB.'}
                </p>
                <Button disabled={(sourceType === 'html' ? !rawCode.trim() : !siteUrl.trim()) || isSubmitting} type="submit">
                  {isSubmitting ? 'Scanning…' : 'Scan and prepare repairs'} <span aria-hidden="true">→</span>
                </Button>
              </div>
            </form>
          </div>
        </Card>
      ) : (
        <RepairPreview
          approved={approved}
          languageChoices={languageChoices}
          onApprove={approve}
          onApproveSafe={approveSafeRepairs}
          onDiscard={discardPreview}
          onFinish={finishRepair}
          onLanguageChange={(findingId, value) => setLanguageChoices((current) => ({
            ...current,
            [findingId]: value,
          }))}
          onSkip={skip}
          preview={preview}
          safeIds={safeIds}
          selectedCount={selectedRepairs.length}
          skipped={skipped}
          isSubmitting={isSubmitting}
        />
      )}

      <p className="flex items-start gap-2 text-xs leading-5 text-muted">
        <svg aria-hidden="true" className="mt-0.5 shrink-0" fill="none" height="16" viewBox="0 0 24 24" width="16">
          <path d="M12 3 3.8 7v5c0 4.8 3.2 7.7 8.2 9 5-1.3 8.2-4.2 8.2-9V7L12 3Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.6" />
          <path d="M12 8v4m0 4h.01" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
        </svg>
        URL scans create a repaired copy only; they do not change the live website. Never submit secrets or personal data.
      </p>
    </div>
  )
}

function RepairPreview({
  preview,
  approved,
  skipped,
  safeIds,
  languageChoices,
  selectedCount,
  isSubmitting,
  onApprove,
  onApproveSafe,
  onLanguageChange,
  onSkip,
  onFinish,
  onDiscard,
}) {
  const safeRepairs = preview.safeRepairs || []
  const aiRepairs = preview.aiRepairs || []
  const repairByFinding = new Map(aiRepairs.map((repair) => [repair.findingId, repair]))

  return (
    <div className="space-y-5">
      <Card className="flex flex-wrap items-center justify-between gap-4 p-5 sm:p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            {preview.sourceType === 'url' ? 'Website HTML preview' : 'HTML preview'}
          </p>
          {preview.sourceUrl && <p className="mt-1 break-all text-sm font-semibold text-ink">{preview.sourceUrl}</p>}
          <h2 className="mt-1 text-lg font-bold">{preview.findings.length} finding{preview.findings.length === 1 ? '' : 's'} · {preview.checksPerformed.length} supported checks</h2>
          <p className="mt-1 text-sm text-muted">The original HTML is unchanged. Select the repairs you want to apply.</p>
        </div>
        <Button onClick={onDiscard} variant="secondary">Discard and start over</Button>
      </Card>

      {(preview.aiRepairStatus === 'UNAVAILABLE' || preview.aiRepairStatus === 'SKIPPED_LIMIT') && (
        <Card className="border-warn/40 p-4 text-sm text-warn" role="status">{preview.aiRepairMessage}</Card>
      )}

      <Card className="space-y-4 p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-bold">Safe repair options ({safeRepairs.length})</h2>
            <p className="mt-1 text-sm text-muted">Only explicit evidence in the markup is used. Nothing changes until you submit the approved repairs.</p>
          </div>
          <Button disabled={!safeRepairs.length || safeRepairs.every((repair) => approved[repair.findingId])} onClick={onApproveSafe} variant="secondary">
            Approve all safe fixes
          </Button>
        </div>
        {safeRepairs.length ? (
          <ul className="space-y-3">
            {safeRepairs.map((repair) => (
              <li className="rounded-xl border border-line bg-subtle p-4" key={repair.findingId}>
                <RepairDescription repair={repair} />
                <ApprovalState approved={Boolean(approved[repair.findingId])} skipped={Boolean(skipped[repair.findingId])} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted">No safe automatic actions were identified.</p>
        )}
      </Card>

      <Card className="space-y-4 p-5 sm:p-6">
        <div>
          <h2 className="font-bold">Findings and guided actions</h2>
          <p className="mt-1 text-sm text-muted">AI proposals are suggestions; applying one adds only the listed attribute to the flagged element.</p>
        </div>
        {preview.findings.length ? (
          <ul className="space-y-3">
            {preview.findings.map((finding) => {
              const repair = repairByFinding.get(finding.findingId)
              const isSafe = safeIds.has(finding.findingId)
              const isApproved = Boolean(approved[finding.findingId])
              const isSkipped = Boolean(skipped[finding.findingId])
              return (
                <li className="rounded-xl border border-line p-4" key={finding.findingId}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-ink">{finding.message}</p>
                      <p className="mt-1 text-xs text-muted">{finding.criterion} · {finding.element}</p>
                    </div>
                    <Badge status={isApproved ? 'APPROVED' : isSkipped ? 'SKIPPED' : finding.status} />
                  </div>
                  {isSafe ? (
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                      <p className="text-xs font-medium text-good">Safe option listed above. Approve it there to include it.</p>
                      <ActionSkip disabled={isSkipped} findingId={finding.findingId} onSkip={onSkip} />
                    </div>
                  ) : finding.ruleId === 'wcag-document-language' ? (
                    <div className="mt-3 flex flex-wrap items-end gap-2">
                      <label className="text-xs font-semibold text-muted">
                        Choose the page language
                        <select
                          className="mt-1 block min-h-10 rounded-lg border border-line bg-surface px-3 text-sm text-ink"
                          onChange={(event) => onLanguageChange(finding.findingId, event.target.value)}
                          value={languageChoices[finding.findingId] || ''}
                        >
                          <option value="">Select language…</option>
                          {LANGUAGES.map(([code, name]) => <option key={code} value={code}>{name}</option>)}
                        </select>
                      </label>
                      <Button
                        disabled={!languageChoices[finding.findingId] || isApproved}
                        onClick={() => onApprove({
                          findingId: finding.findingId,
                          value: languageChoices[finding.findingId],
                          repairType: 'user-selected',
                        })}
                        size="sm"
                        variant="secondary"
                      >
                        Apply choice
                      </Button>
                      <ActionSkip disabled={isSkipped} findingId={finding.findingId} onSkip={onSkip} />
                    </div>
                  ) : repair ? (
                    <div className="mt-3 rounded-lg bg-subtle p-3">
                      <p className="text-xs font-semibold text-muted">AI proposal · {repair.attribute}</p>
                      <p className="mt-1 break-words font-mono text-sm text-ink">{repair.value || '(empty)'}</p>
                      <div className="mt-3 flex gap-2">
                        <Button
                          disabled={isApproved}
                          onClick={() => onApprove({ ...repair, repairType: 'ai-assisted' })}
                          size="sm"
                          variant="secondary"
                        >
                          Apply proposal
                        </Button>
                        <ActionSkip disabled={isSkipped} findingId={finding.findingId} onSkip={onSkip} />
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                      <p className="text-xs text-warn">No usable automatic proposal. Review this finding; no change will be guessed.</p>
                      <ActionSkip disabled={isSkipped} findingId={finding.findingId} onSkip={onSkip} />
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        ) : (
          <p className="text-sm text-good">No findings from the supported checks.</p>
        )}
      </Card>

      <Card className="flex flex-wrap items-center justify-between gap-3 p-5 sm:p-6">
        <div>
          <p className="font-semibold text-ink">{selectedCount} repair{selectedCount === 1 ? '' : 's'} approved · {Object.keys(skipped).length} skipped</p>
          <p className="mt-1 text-xs text-muted">Applying creates a new report and re-scans the resulting HTML.</p>
        </div>
        <Button disabled={isSubmitting} onClick={onFinish}>
          {isSubmitting ? 'Applying and rescanning…' : selectedCount ? `Apply ${selectedCount} approved repairs` : 'Save scan report'}
        </Button>
      </Card>
    </div>
  )
}

function RepairDescription({ repair }) {
  return (
    <>
      <p className="text-sm font-semibold text-ink">{repair.description}</p>
      <p className="mt-1 text-xs text-muted">{repair.criterion} · {repair.element} · will set alt to an empty value</p>
    </>
  )
}

function ApprovalState({ approved, skipped }) {
  if (approved) return <p className="mt-2 text-xs font-semibold text-good">Approved; will be applied when you submit this repair run.</p>
  if (skipped) return <p className="mt-2 text-xs font-semibold text-muted">Skipped.</p>
  return <p className="mt-2 text-xs text-muted">Not applied. Use “Approve all safe fixes” to select it.</p>
}

function ActionSkip({ findingId, onSkip, disabled }) {
  return (
    <Button disabled={disabled} onClick={() => onSkip(findingId)} size="sm" variant="ghost">
      Skip
    </Button>
  )
}

function SourceButton({ active, onClick, children }) {
  return (
    <button
      aria-pressed={active}
      className={`min-h-8 rounded-md px-3 text-xs font-semibold ${active ? 'bg-brand text-white' : 'text-muted hover:text-ink'}`}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  )
}
