import { useState } from 'react'
import { copyToClipboard } from '../utils/formatters.js'

export function CodeDiff({ originalCode = '', repairedCode = '' }) {
  const [copyStatus, setCopyStatus] = useState('')

  async function handleCopy() {
    try {
      await copyToClipboard(repairedCode)
      setCopyStatus('Copied to clipboard')
    } catch (error) {
      setCopyStatus(error.message || 'Could not copy code')
    }
  }

  return (
    <div className="space-y-3">
      <section aria-labelledby="repaired-code-heading" className="min-w-0 overflow-hidden rounded-xl border border-line bg-surface">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-subtle px-4 py-3">
          <div>
            <h3 className="text-sm font-semibold text-ink" id="repaired-code-heading">Repaired HTML</h3>
            <p className="mt-0.5 text-xs text-muted">Ready to copy into your project</p>
          </div>
          <button
            className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-line bg-surface px-3 py-1.5 text-sm font-semibold text-ink transition-colors hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!repairedCode}
            onClick={handleCopy}
            type="button"
          >
            <CopyIcon />
            Copy code
          </button>
        </div>
        <pre className="code-view max-h-[34rem] overflow-auto p-4 text-[13px] leading-6 sm:p-5">
          <code>{repairedCode || 'No repaired code was returned.'}</code>
        </pre>
        {copyStatus && (
          <p aria-live="polite" className="border-t border-line px-4 py-2 text-xs text-muted" role="status">
            {copyStatus}
          </p>
        )}
      </section>

      <details className="group overflow-hidden rounded-xl border border-line bg-surface">
        <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-semibold text-ink hover:bg-hover [&::-webkit-details-marker]:hidden">
          <span>View original HTML</span>
          <span aria-hidden="true" className="text-muted transition-transform group-open:rotate-180">⌄</span>
        </summary>
        <div className="border-t border-line">
          <pre className="code-view max-h-[28rem] overflow-auto p-4 text-[13px] leading-6 sm:p-5">
            <code>{originalCode || 'No original code was recorded.'}</code>
          </pre>
        </div>
      </details>
    </div>
  )
}

function CopyIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="16" viewBox="0 0 24 24" width="16">
      <rect height="13" rx="2" stroke="currentColor" strokeWidth="1.7" width="13" x="8" y="8" />
      <path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  )
}
