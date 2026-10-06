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
    <div className="mx-auto max-w-4xl">
      <div className="mb-7">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand">Accessibility auditor</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Repair an HTML snippet</h1>
        <p className="mt-3 max-w-2xl text-muted">
          Submit markup to run deterministic checks, contextual AI repair, and the backend verification pass.
        </p>
      </div>
      <ScanningScreen active={isSubmitting} error={error} />
      <Card className="p-4 sm:p-6">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <CodeEditor onChange={setRawCode} value={rawCode} />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="max-w-xl text-xs leading-5 text-muted">
              Do not submit secrets or personal data. The current backend accepts HTML text only (1 MB request limit).
            </p>
            <Button disabled={!rawCode.trim() || isSubmitting} type="submit">
              {isSubmitting ? 'Repairing…' : 'Run accessibility repair'} <span aria-hidden="true">→</span>
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
