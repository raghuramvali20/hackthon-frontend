import { useMemo, useRef, useState } from 'react'
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
import {
  getHtmlContentValidationError,
  getHtmlFileValidationError,
} from '../models/htmlFile.js'
import {
  getReactContentValidationError,
  getReactFileValidationError,
} from '../models/reactSource.js'

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
  const [reactCode, setReactCode] = useState('')
  const [reactFileName, setReactFileName] = useState('Component.jsx')
  const [reactFileError, setReactFileError] = useState('')
  const [uploadedCode, setUploadedCode] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [fileError, setFileError] = useState('')
  const [siteUrl, setSiteUrl] = useState('')
  const [inputMode, setInputMode] = useState('paste')
  const [isDraggingFile, setIsDraggingFile] = useState(false)
  const [isDraggingReactFile, setIsDraggingReactFile] = useState(false)
  const fileInputRef = useRef(null)
  const fileReadRequestRef = useRef(0)
  const reactFileInputRef = useRef(null)
  const reactFileReadRequestRef = useRef(0)
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
    const isUrl = inputMode === 'url'
    if (inputMode === 'react-jsx') {
      const validationError = getReactContentValidationError(reactCode)
      if (validationError) {
        setReactFileError(validationError)
        return
      }
    }
    const result = await previewSource({
      type: isUrl ? 'url' : inputMode === 'react-jsx' ? 'react-jsx' : 'html',
      value: isUrl ? siteUrl : inputMode === 'file' ? uploadedCode : inputMode === 'react-jsx' ? reactCode : rawCode,
      fileName: reactFileName,
    })
    if (result) {
      setPreview(result)
      setSelection({ approved: {}, skipped: {} })
      setLanguageChoices({})
    }
  }

  async function handleReactFile(file) {
    const requestId = ++reactFileReadRequestRef.current
    const validationError = getReactFileValidationError(file)
    if (validationError) {
      setReactFileError(validationError)
      return
    }
    try {
      const source = await file.text()
      if (requestId !== reactFileReadRequestRef.current) return
      const contentError = getReactContentValidationError(source)
      if (contentError) {
        setReactFileError(contentError)
        return
      }
      setReactCode(source)
      setReactFileName(file.name)
      setReactFileError('')
    } catch {
      if (requestId !== reactFileReadRequestRef.current) return
      setReactFileError('This source file could not be read. Choose another .jsx or .tsx file.')
    }
  }

  function handleReactFileDrop(event) {
    event.preventDefault()
    setIsDraggingReactFile(false)
    const files = Array.from(event.dataTransfer.files || [])
    if (files.length !== 1) {
      setReactFileError('Drop one JSX or TSX file at a time.')
      return
    }
    handleReactFile(files[0])
  }

  async function handleHtmlFile(file) {
    const requestId = ++fileReadRequestRef.current
    const validationError = getHtmlFileValidationError(file)
    if (validationError) {
      setFileError(validationError)
      return
    }

    try {
      const contents = await file.text()
      if (requestId !== fileReadRequestRef.current) return
      const contentError = getHtmlContentValidationError(contents)
      if (contentError) {
        setFileError(contentError)
        return
      }
      setUploadedCode(contents)
      setSelectedFile({ name: file.name, size: file.size })
      setFileError('')
    } catch {
      if (requestId !== fileReadRequestRef.current) return
      setFileError('This file could not be read. Choose another HTML file.')
    }
  }

  function removeHtmlFile() {
    fileReadRequestRef.current += 1
    setUploadedCode('')
    setSelectedFile(null)
    setFileError('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function chooseInputMode(mode) {
    setInputMode(mode)
    setFileError('')
    setReactFileError('')
  }

  function handleFileDrop(event) {
    event.preventDefault()
    setIsDraggingFile(false)
    const files = Array.from(event.dataTransfer.files || [])
    if (files.length !== 1) {
      setFileError('Drop one HTML file at a time.')
      return
    }
    handleHtmlFile(files[0])
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
      sourceFileName: preview.sourceFileName,
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
    <div className="mx-auto max-w-6xl space-y-7">
      <div className="relative overflow-hidden rounded-[1.75rem] border border-line bg-surface px-6 py-8 shadow-sm sm:px-9 sm:py-10">
        <div aria-hidden="true" className="paper-grid pointer-events-none absolute inset-y-0 right-0 w-2/5" />
        <div aria-hidden="true" className="absolute -right-8 -top-10 size-36 rounded-full border-[22px] border-accent/70 sm:right-10 sm:top-6" />
        <div className="relative max-w-3xl">
          <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-brand">
            <span className="size-2 rounded-full bg-brand" />
            AccessPilot · Repair studio
          </span>
          <h1 className="display-heading mt-4 max-w-2xl text-4xl leading-[1.04] text-ink sm:text-5xl">
            Make the next version easier to use.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-muted sm:text-base">
            Scan one HTML page or React source file, review focused repair options, then compare the updated copy. Your original stays unchanged.
          </p>
          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-ink">
            <span><span className="mr-2 text-brand">01</span>Scan supported patterns</span>
            <span><span className="mr-2 text-brand">02</span>Choose repairs</span>
            <span><span className="mr-2 text-brand">03</span>Review the result</span>
          </div>
        </div>
      </div>

      <ScanningScreen active={isSubmitting} error={error} />

      {!preview ? (
        <Card className="overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-subtle px-5 py-4 sm:px-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand">Start a repair run</p>
              <h2 className="mt-1 font-bold">Bring one page into the studio</h2>
              <p className="mt-1 text-xs text-muted">Preview scans and prepares options without changing or saving your source.</p>
            </div>
          </div>
          <div className="p-4 sm:p-6">
            <form className="space-y-5" onSubmit={handlePreview}>
              <div aria-label="Choose page source" className="grid gap-2 rounded-2xl border border-line bg-canvas p-2 sm:grid-cols-2 xl:grid-cols-4" role="group">
                <SourceButton active={inputMode === 'paste'} onClick={() => chooseInputMode('paste')}>
                  <SourceIcon type="paste" /> Paste HTML
                </SourceButton>
                <SourceButton active={inputMode === 'file'} onClick={() => chooseInputMode('file')}>
                  <SourceIcon type="file" /> Drop an HTML file
                </SourceButton>
                <SourceButton active={inputMode === 'url'} onClick={() => chooseInputMode('url')}>
                  <SourceIcon type="link" /> Public website URL
                </SourceButton>
                <SourceButton active={inputMode === 'react-jsx'} onClick={() => chooseInputMode('react-jsx')}>
                  <SourceIcon type="code" /> React JSX / TSX
                </SourceButton>
              </div>
              {inputMode === 'paste' ? (
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-ink">Paste or edit a single HTML page</p>
                    <div className="flex gap-2">
                      <Button onClick={() => setRawCode(STARTER_HTML)} size="sm" variant="secondary">Load sample</Button>
                      <Button onClick={() => setRawCode('')} size="sm" variant="ghost">Clear</Button>
                    </div>
                  </div>
                  <CodeEditor onChange={setRawCode} value={rawCode} />
                </div>
              ) : inputMode === 'file' ? (
                <div>
                  <input
                    aria-hidden="true"
                    accept=".html,.htm,text/html"
                    className="sr-only"
                    onChange={(event) => {
                      const file = event.target.files?.[0]
                      if (file) handleHtmlFile(file)
                      event.target.value = ''
                    }}
                    ref={fileInputRef}
                    tabIndex={-1}
                    type="file"
                  />
                  {selectedFile ? (
                    <div className="rounded-2xl border border-line bg-canvas p-4 sm:p-5">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex min-w-0 items-center gap-3">
                          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent/40 text-ink">
                            <SourceIcon type="file" />
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-bold text-ink">{selectedFile.name}</span>
                            <span className="mt-1 block text-xs text-muted">
                              {(selectedFile.size / 1024).toFixed(1)} KB · loaded as text, not executed
                            </span>
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={() => fileInputRef.current?.click()} size="sm" variant="secondary">Replace</Button>
                          <Button onClick={removeHtmlFile} size="sm" variant="ghost">Remove</Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <button
                      aria-describedby="html-drop-help"
                      className={`drop-target ${isDraggingFile ? 'is-dragging' : ''} flex min-h-52 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-line bg-canvas px-5 py-8 text-center hover:border-brand hover:bg-subtle`}
                      onClick={() => fileInputRef.current?.click()}
                      onDragEnter={(event) => {
                        event.preventDefault()
                        setIsDraggingFile(true)
                      }}
                      onDragLeave={(event) => {
                        if (!event.currentTarget.contains(event.relatedTarget)) setIsDraggingFile(false)
                      }}
                      onDragOver={(event) => event.preventDefault()}
                      onDrop={handleFileDrop}
                      type="button"
                    >
                      <span className="grid size-12 place-items-center rounded-2xl bg-accent/50 text-ink">
                        <SourceIcon type="file" />
                      </span>
                      <span className="mt-4 text-base font-bold text-ink">Drop your HTML file here</span>
                      <span className="mt-1 text-sm text-muted">or click to browse your device</span>
                      <span className="mt-4 rounded-full border border-line bg-surface px-3 py-1 text-[11px] font-semibold text-muted">.html / .htm · up to 100 KB</span>
                    </button>
                  )}
                  <p className="mt-2 text-xs leading-5 text-muted" id="html-drop-help">
                    File contents are read as text and sent through the existing preview scan. They are never rendered or executed.
                  </p>
                  {fileError && <p className="mt-2 text-sm font-medium text-danger" role="alert">{fileError}</p>}
                </div>
              ) : inputMode === 'react-jsx' ? (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-end justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-ink">One React source file</p>
                      <p className="mt-1 max-w-2xl text-xs leading-5 text-muted">
                        Static source inspection only—not a whole-project React scan. Custom components and runtime behavior may need review.
                      </p>
                    </div>
                    <label className="text-xs font-semibold text-muted">
                      File type
                      <select
                        className="ml-2 min-h-9 rounded-lg border border-line bg-surface px-2 text-sm text-ink"
                        onChange={(event) => setReactFileName(`Component.${event.target.value}`)}
                        value={reactFileName.toLowerCase().endsWith('.tsx') ? 'tsx' : 'jsx'}
                      >
                        <option value="jsx">.jsx</option>
                        <option value="tsx">.tsx</option>
                      </select>
                    </label>
                  </div>
                  <input
                    accept=".jsx,.tsx,text/javascript,application/typescript"
                    className="sr-only"
                    onChange={(event) => {
                      const file = event.target.files?.[0]
                      if (file) handleReactFile(file)
                      event.target.value = ''
                    }}
                    ref={reactFileInputRef}
                    tabIndex={-1}
                    type="file"
                  />
                  <button
                    aria-describedby="react-source-file-help"
                    className={`drop-target ${isDraggingReactFile ? 'is-dragging' : ''} flex w-full flex-wrap items-center justify-between gap-3 rounded-xl border border-dashed border-line bg-canvas px-4 py-3 text-left hover:border-brand hover:bg-subtle`}
                    onClick={() => reactFileInputRef.current?.click()}
                    onDragEnter={(event) => {
                      event.preventDefault()
                      setIsDraggingReactFile(true)
                    }}
                    onDragLeave={(event) => {
                      if (!event.currentTarget.contains(event.relatedTarget)) setIsDraggingReactFile(false)
                    }}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={handleReactFileDrop}
                    type="button"
                  >
                    <span className="flex items-center gap-3">
                      <span className="grid size-9 place-items-center rounded-lg bg-accent/50 text-ink"><SourceIcon type="code" /></span>
                      <span>
                        <span className="block text-sm font-semibold text-ink">{reactFileName}</span>
                        <span className="mt-0.5 block text-xs text-muted" id="react-source-file-help">Drop or browse for a .jsx / .tsx file (max 100 KB)</span>
                      </span>
                    </span>
                    <span className="text-xs font-bold text-brand">Browse files</span>
                  </button>
                  <CodeEditor
                    label="React JSX/TSX source"
                    maxLength={100000}
                    onChange={(value) => {
                      setReactCode(value)
                      setReactFileError('')
                    }}
                    value={reactCode}
                  />
                  {reactFileError && <p className="text-sm font-medium text-danger" role="alert">{reactFileError}</p>}
                </div>
              ) : (
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-ink">Public website URL</span>
                  <input
                    autoComplete="url"
                    className="min-h-12 w-full rounded-xl border border-line bg-surface px-4 text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
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
                  {inputMode === 'paste'
                    ? 'One HTML page · up to 100,000 characters.'
                    : inputMode === 'file'
                      ? 'The file remains on this page until you start the preview scan.'
                      : inputMode === 'react-jsx'
                        ? 'One .jsx or .tsx file · up to 100 KB · source is never executed.'
                        : 'AI proposals are limited to pages no larger than 100 KB.'}
                </p>
                <Button disabled={(inputMode === 'url' ? !siteUrl.trim() : inputMode === 'file' ? !uploadedCode.trim() || Boolean(fileError) : inputMode === 'react-jsx' ? !reactCode.trim() || Boolean(reactFileError) : !rawCode.trim()) || isSubmitting} type="submit">
                  {isSubmitting ? 'Scanning…' : 'Preview page'} <span aria-hidden="true">→</span>
                </Button>
              </div>
            </form>
          </div>
        </Card>
      ) : (
        preview.sourceType === 'react-jsx' ? (
          <ReactRepairPreview
            approved={approved}
            isSubmitting={isSubmitting}
            onApprove={approve}
            onDiscard={discardPreview}
            onFinish={finishRepair}
            onSkip={skip}
            preview={preview}
            selectedCount={selectedRepairs.length}
            skipped={skipped}
          />
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
        )
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

function ReactRepairPreview({
  preview,
  approved,
  skipped,
  selectedCount,
  isSubmitting,
  onApprove,
  onSkip,
  onFinish,
  onDiscard,
}) {
  const [drafts, setDrafts] = useState({})

  function updateDraft(findingId, values) {
    setDrafts((current) => ({
      ...current,
      [findingId]: { ...current[findingId], ...values },
    }))
  }

  return (
    <div className="space-y-5">
      <Card className="flex flex-wrap items-start justify-between gap-4 p-5 sm:p-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">Single-file React source preview</p>
          <h2 className="mt-2 break-all text-lg font-bold text-ink">{preview.sourceFileName}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            {preview.scope} Findings are based on static syntax, not rendered output. Dynamic props and custom components are not guessed.
          </p>
          <p className="mt-3 text-xs font-semibold text-ink">
            {preview.findings.length} item{preview.findings.length === 1 ? '' : 's'} to review · {preview.checksPerformed.length} catalog entries
          </p>
        </div>
        <Button onClick={onDiscard} variant="secondary">Discard and start over</Button>
      </Card>

      <Card className="p-5 sm:p-6">
        <div>
          <h3 className="font-bold text-ink">Static source check results</h3>
          <p className="mt-1 text-xs leading-5 text-muted">
            “No pattern detected” applies only to the syntax this single-file scan can inspect; it is not a pass for the complete WCAG criterion.
          </p>
        </div>
        <ul className="mt-3 divide-y divide-line">
          {preview.checksPerformed.map((check) => (
            <li className="flex flex-col gap-1 py-3 sm:flex-row sm:items-start sm:justify-between" key={check.id}>
              <span>
                <span className="block text-sm font-semibold text-ink">{check.title}</span>
                <span className="mt-1 block text-xs text-muted">
                  {check.criterion ? `Success criterion ${check.criterion}` : 'No criterion assigned'}
                  {' · WCAG '}{check.wcagVersion}
                  {' · '}{check.detectionMethod}
                  {' · '}{check.limitations}
                </span>
              </span>
              <span className="shrink-0 text-right">
                <span className="block text-xs font-bold text-muted">{check.status.replaceAll('_', ' ')}</span>
                <span className="mt-1 block text-[10px] font-medium uppercase tracking-wide text-muted">
                  {check.category.replaceAll('-', ' ')}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="space-y-4 p-5 sm:p-6">
        <div>
          <h3 className="font-bold text-ink">Findings and approved source edits</h3>
          <p className="mt-1 text-sm text-muted">
            Repairs add only one allowlisted JSX attribute to the identified native element. Image purpose and accessible-name wording need your judgment.
          </p>
        </div>
        {preview.findings.length ? (
          <ul className="space-y-3">
            {preview.findings.map((finding) => {
              const selected = approved[finding.findingId]
              const isSkipped = Boolean(skipped[finding.findingId])
              const draft = drafts[finding.findingId] || {}
              const image = finding.ruleId === 'wcag-jsx-image-alt'
              const canApply = finding.repairable && (
                image
                  ? draft.imageIntent === 'decorative' ||
                    (draft.imageIntent === 'informative' && Boolean(draft.value?.trim()))
                  : Boolean(draft.value?.trim())
              )

              return (
                <li className="rounded-xl border border-line bg-surface p-4" key={finding.findingId}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-ink">{finding.message}</p>
                      <p className="mt-1 text-xs text-muted">
                        {finding.criterion || 'Review note'} · {finding.element} · line {finding.sourceLocation.line}, column {finding.sourceLocation.column}
                      </p>
                    </div>
                    <Badge status={selected ? 'APPROVED' : isSkipped ? 'SKIPPED' : finding.status} />
                  </div>
                  {selected ? (
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                      <p className="text-xs font-semibold text-good">
                        Approved: {finding.repairAttribute}={JSON.stringify(selected.value)} · apply when you save this run
                      </p>
                      <ActionSkip disabled={isSkipped} findingId={finding.findingId} onSkip={onSkip} />
                    </div>
                  ) : finding.repairable ? (
                    <div className="mt-3 space-y-3 rounded-lg bg-subtle p-3">
                      {image ? (
                        <>
                          <label className="block text-xs font-semibold text-ink">
                            What is this image for?
                            <select
                              className="mt-1.5 block min-h-10 w-full rounded-lg border border-line bg-surface px-3 text-sm"
                              onChange={(event) => updateDraft(finding.findingId, {
                                imageIntent: event.target.value,
                                value: event.target.value === 'decorative' ? '' : draft.value || '',
                              })}
                              value={draft.imageIntent || ''}
                            >
                              <option value="">Choose image intent…</option>
                              <option value="decorative">Decorative — hide from assistive technology</option>
                              <option value="informative">Informative — provide alternative text</option>
                            </select>
                          </label>
                          {draft.imageIntent === 'informative' && (
                            <label className="block text-xs font-semibold text-ink">
                              Alternative text
                              <input
                                className="mt-1.5 min-h-10 w-full rounded-lg border border-line bg-surface px-3 text-sm"
                                maxLength={500}
                                onChange={(event) => updateDraft(finding.findingId, { value: event.target.value })}
                                value={draft.value || ''}
                              />
                            </label>
                          )}
                        </>
                      ) : (
                        <label className="block text-xs font-semibold text-ink">
                          Suggested accessible name
                          <input
                            className="mt-1.5 min-h-10 w-full rounded-lg border border-line bg-surface px-3 text-sm"
                            maxLength={500}
                            onChange={(event) => updateDraft(finding.findingId, { value: event.target.value })}
                            placeholder="Enter the name that matches the control’s purpose"
                            value={draft.value || ''}
                          />
                        </label>
                      )}
                      <div className="flex flex-wrap gap-2">
                        <Button
                          disabled={!canApply}
                          onClick={() => onApprove({
                            findingId: finding.findingId,
                            value: draft.value || '',
                            imageIntent: draft.imageIntent,
                            repairType: 'user-approved',
                          })}
                          size="sm"
                          variant="secondary"
                        >
                          Approve source edit
                        </Button>
                        <ActionSkip disabled={isSkipped} findingId={finding.findingId} onSkip={onSkip} />
                      </div>
                    </div>
                  ) : (
                    <p className="mt-3 text-xs leading-5 text-warn">
                      This pattern depends on a dynamic expression, spread prop, or custom component. No automatic edit is offered; inspect the source in its application context.
                    </p>
                  )}
                </li>
              )
            })}
          </ul>
        ) : (
          <p className="rounded-xl border border-line bg-subtle p-4 text-sm leading-6 text-muted">
            No supported JSX patterns were detected in the inspected syntax. This does not establish that the component or page conforms to WCAG.
          </p>
        )}
      </Card>

      <Card className="flex flex-wrap items-center justify-between gap-3 p-5 sm:p-6">
        <div>
          <p className="font-semibold text-ink">{selectedCount} edit{selectedCount === 1 ? '' : 's'} approved · {Object.keys(skipped).length} skipped</p>
          <p className="mt-1 text-xs text-muted">Saving creates a source report and re-parses the updated file. No score is calculated for this source mode.</p>
        </div>
        <Button disabled={isSubmitting} onClick={onFinish}>
          {isSubmitting ? 'Applying and rescanning…' : selectedCount ? `Apply ${selectedCount} approved edits` : 'Save source report'}
        </Button>
      </Card>
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
      className={`flex min-h-11 items-center justify-center gap-2 rounded-xl px-3 text-sm font-semibold transition ${active ? 'bg-surface text-ink shadow-sm ring-1 ring-line' : 'text-muted hover:bg-hover hover:text-ink'}`}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  )
}

function SourceIcon({ type }) {
  const iconPath = {
    paste: <><path d="M8 4h8l2 2v14H6V4h2Z" /><path d="M9 10h6m-6 4h6m-6 4h4" /></>,
    file: <><path d="M13 3H6v18h12V8l-5-5Z" /><path d="M13 3v5h5M9 13h6m-6 4h6" /></>,
    link: <><path d="M10 13a5 5 0 0 0 7.1 0l2-2A5 5 0 0 0 12 3.9l-1.1 1.1" /><path d="M14 11a5 5 0 0 0-7.1 0l-2 2A5 5 0 0 0 12 20.1l1.1-1.1" /></>,
    code: <><path d="m8 8-4 4 4 4m8-8 4 4-4 4m-2-11-4 14" /></>,
  }[type]

  return (
    <svg aria-hidden="true" fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" viewBox="0 0 24 24" width="20">
      {iconPath}
    </svg>
  )
}
