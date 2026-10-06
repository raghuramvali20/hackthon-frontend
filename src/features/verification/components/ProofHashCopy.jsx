import { useState } from 'react'
import { Button } from '../../../shared/components/Button.jsx'
import { copyToClipboard, truncateHash } from '../../../shared/utils/formatters.js'

export function ProofHashCopy({ hash }) {
  const [feedback, setFeedback] = useState('')
  if (!hash) return <p className="text-sm text-muted">No proof hash is available.</p>

  async function handleCopy() {
    try {
      await copyToClipboard(hash)
      setFeedback('Copied')
    } catch (error) {
      setFeedback(error.message)
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <code className="rounded-lg bg-slate-100 px-3 py-2 font-mono text-xs text-ink">{truncateHash(hash, 12)}</code>
      <Button onClick={handleCopy} variant="secondary">Copy hash</Button>
      {feedback && <span aria-live="polite" className="text-xs text-muted" role="status">{feedback}</span>}
    </div>
  )
}
