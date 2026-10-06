import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../../shared/components/Button.jsx'
import { Card } from '../../../shared/components/Card.jsx'
import { useAuditorController } from '../controllers/useAuditorController.js'
import { CodeEditor } from '../components/CodeEditor.jsx'
import { ScanningScreen } from './ScanningScreen.jsx'
import { STARTER_HTML } from '../models/auditor.js'

export function AuditUploadScreen() {
  const [rawCode, setRawCode] = useState(STARTER_HTML)
  const navigate = useNavigate()
  const { isSubmitting, error, submitRepair } = useAuditorController()

  async function handleSubmit(event) {
    event.preventDefault()
    const report = await submitRepair(rawCode)
    if (report) navigate(`/reports/${report.id}`, { state: { report } })
  }

  return (
    <div className="mx-auto max-w-5xl space-y-7">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#282278] via-[#5146e5] to-[#776cf3] px-6 py-8 text-white shadow-xl shadow-indigo-950/10 sm:px-9 sm:py-10">
        <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-20 size-72 rounded-full border border-white/10" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-2 -top-10 size-52 rounded-full border border-white/10" />
        <div className="relative max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-indigo-50">
            <span className="size-1.5 rounded-full bg-emerald-300" />
            ACCESSIBILITY AUDITOR
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Make your markup work for everyone.</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-indigo-100 sm:text-base">
            Run an accessibility repair pass, review every change, and keep a verifiable record of your results.
          </p>
          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-indigo-100">
            <span>01&nbsp; Deterministic checks</span>
            <span>02&nbsp; AI-assisted repair</span>
            <span>03&nbsp; Review & verify</span>
          </div>
        </div>
      </div>
      <ScanningScreen active={isSubmitting} error={error} />
      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-subtle px-5 py-4 sm:px-6">
          <div>
            <h2 className="font-bold">Source markup</h2>
            <p className="mt-1 text-xs text-muted">Paste an HTML snippet to inspect and repair.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-lg border border-line bg-surface px-2.5 py-1 text-[11px] font-bold tracking-wide text-muted">HTML</span>
            <Button onClick={() => setRawCode(STARTER_HTML)} size="sm" variant="secondary">Load sample</Button>
            <Button onClick={() => setRawCode('')} size="sm" variant="ghost">Clear</Button>
          </div>
        </div>
        <div className="p-4 sm:p-6">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <CodeEditor onChange={setRawCode} value={rawCode} />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="max-w-xl text-xs leading-5 text-muted">
              HTML only · up to 100,000 characters · API request limit is 1 MB.
            </p>
            <Button disabled={!rawCode.trim() || isSubmitting} type="submit">
              {isSubmitting ? 'Repairing…' : 'Run accessibility repair'} <span aria-hidden="true">→</span>
            </Button>
          </div>
        </form>
        </div>
      </Card>
      <p className="flex items-start gap-2 text-xs leading-5 text-muted">
        <svg aria-hidden="true" className="mt-0.5 shrink-0" fill="none" height="16" viewBox="0 0 24 24" width="16">
          <path d="M12 3 3.8 7v5c0 4.8 3.2 7.7 8.2 9 5-1.3 8.2-4.2 8.2-9V7L12 3Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.6" />
          <path d="M12 8v4m0 4h.01" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
        </svg>
        Do not submit secrets or personal data. Your submitted code is stored with your account so you can review scan history.
      </p>
    </div>
  )
}
