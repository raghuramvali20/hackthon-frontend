import { useMemo, useState } from 'react'
import { copyToClipboard } from '../utils/formatters.js'

const MAX_DIFF_CELLS = 1_000_000

export function CodeDiff({
  originalCode = '',
  repairedCode = '',
  sourceType = 'html',
  sourceFileName = '',
}) {
  const [view, setView] = useState('split')
  const [wrapLines, setWrapLines] = useState(false)
  const [copyStatus, setCopyStatus] = useState('')
  const rows = useMemo(
    () => createDiffRows(originalCode, repairedCode),
    [originalCode, repairedCode],
  )
  const changedLines = rows.filter((row) => row.type !== 'same').length

  async function handleCopy() {
    try {
      await copyToClipboard(repairedCode)
      setCopyStatus(`Updated source copied without line numbers.`)
    } catch (error) {
      setCopyStatus(error.message || 'Could not copy code')
    }
  }

  function handleDownload() {
    const extension = sourceType === 'react-jsx'
      ? sourceFileName.toLowerCase().endsWith('.tsx') ? 'tsx' : 'jsx'
      : 'html'
    const file = new Blob([repairedCode], { type: extension === 'html' ? 'text/html;charset=utf-8' : 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(file)
    const link = document.createElement('a')
    link.href = url
    link.download = `accesspilot-repaired.${extension}`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <section aria-label={`${sourceType === 'react-jsx' ? 'React source' : 'HTML'} code comparison`} className="overflow-hidden rounded-xl border border-line bg-surface">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-subtle px-4 py-3">
        <div>
          <h3 className="text-sm font-semibold text-ink">{sourceType === 'react-jsx' ? 'Source comparison' : 'Code comparison'}</h3>
          <p className="mt-1 text-xs text-muted">
            {changedLines === 0 ? 'No textual changes' : `${changedLines} changed ${changedLines === 1 ? 'line' : 'lines'}`}
            {' · '}line numbers are not included when copying
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div aria-label="Comparison layout" className="inline-flex rounded-lg border border-line bg-surface p-0.5" role="group">
            <ViewButton active={view === 'split'} onClick={() => setView('split')}>Side by side</ViewButton>
            <ViewButton active={view === 'unified'} onClick={() => setView('unified')}>Unified</ViewButton>
          </div>
          <button
            aria-pressed={wrapLines}
            className="min-h-8 rounded-lg border border-line bg-surface px-2.5 text-xs font-semibold text-ink hover:border-brand"
            onClick={() => setWrapLines((current) => !current)}
            type="button"
          >
            {wrapLines ? 'Disable wrap' : 'Wrap lines'}
          </button>
          <button
            className="min-h-8 rounded-lg border border-line bg-surface px-2.5 text-xs font-semibold text-ink hover:border-brand disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!repairedCode}
            onClick={handleCopy}
            type="button"
          >
            Copy updated
          </button>
          <button
            className="min-h-8 rounded-lg border border-line bg-surface px-2.5 text-xs font-semibold text-ink hover:border-brand disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!repairedCode}
            onClick={handleDownload}
            type="button"
          >
            Download
          </button>
        </div>
      </div>

      {view === 'split' ? (
        <div className="grid min-w-0 lg:grid-cols-2">
          <CodePane
            heading="Original"
            rows={rows}
            side="original"
            wrapLines={wrapLines}
          />
          <CodePane
            heading="Updated"
            rows={rows}
            side="updated"
            wrapLines={wrapLines}
          />
        </div>
      ) : (
        <div className="code-diff-scroll max-h-[38rem] overflow-auto">
          <div className={wrapLines ? 'min-w-full py-2' : 'min-w-max py-2'}>
            {rows.flatMap((row, index) => {
              if (row.type === 'modified') {
                return [
                  <DiffLine
                    key={`removed-${row.originalNumber}-${index}`}
                    lineNumber={row.originalNumber}
                    marker="-"
                    text={row.original}
                    type="removed"
                    wrapLines={wrapLines}
                  />,
                  <DiffLine
                    key={`added-${row.updatedNumber}-${index}`}
                    lineNumber={row.updatedNumber}
                    marker="+"
                    text={row.updated}
                    type="added"
                    wrapLines={wrapLines}
                  />,
                ]
              }
              return (
                <DiffLine
                  key={`${row.type}-${row.originalNumber || 'x'}-${row.updatedNumber || 'x'}-${index}`}
                  lineNumber={row.type === 'added' ? row.updatedNumber : row.originalNumber}
                  marker={row.type === 'added' ? '+' : row.type === 'removed' ? '-' : ' '}
                  text={row.type === 'added' ? row.updated : row.original}
                  type={row.type}
                  wrapLines={wrapLines}
                />
              )
            })}
          </div>
        </div>
      )}

      {copyStatus && (
        <p aria-live="polite" className="border-t border-line px-4 py-2 text-xs text-muted" role="status">
          {copyStatus}
        </p>
      )}
    </section>
  )
}

function CodePane({ heading, rows, side, wrapLines }) {
  return (
    <div className="min-w-0 border-b border-line last:border-b-0 lg:border-b-0 lg:[&:first-child]:border-r">
      <div className="flex h-10 items-center justify-between border-b border-line bg-subtle px-4">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-muted">{heading}</h4>
        <span aria-hidden="true" className={`size-2 rounded-full ${side === 'original' ? 'bg-muted' : 'bg-good'}`} />
      </div>
      <div className="code-diff-scroll max-h-[38rem] overflow-auto py-2">
        <div className={wrapLines ? 'min-w-full' : 'min-w-max'}>
          {rows.map((row, index) => {
            const lineNumber = side === 'original' ? row.originalNumber : row.updatedNumber
            const text = side === 'original' ? row.original : row.updated
            const type = side === 'original'
              ? row.type === 'removed' || row.type === 'modified' ? 'removed' : row.type === 'added' ? 'empty' : 'same'
              : row.type === 'added' || row.type === 'modified' ? 'added' : row.type === 'removed' ? 'empty' : 'same'

            return (
              <DiffLine
                key={`${side}-${row.type}-${lineNumber || 'x'}-${index}`}
                lineNumber={lineNumber}
                marker={type === 'added' ? '+' : type === 'removed' ? '-' : ' '}
                text={text}
                type={type}
                wrapLines={wrapLines}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

function DiffLine({ lineNumber, marker, text, type, wrapLines }) {
  return (
    <div className={`code-diff-line ${wrapLines ? 'wrap' : ''} ${type}`} aria-label={type === 'added' ? 'Added line' : type === 'removed' ? 'Removed line' : undefined}>
      <span aria-hidden="true" className="code-diff-marker">{marker}</span>
      <span aria-hidden="true" className="code-diff-number">{lineNumber || ''}</span>
      <code className={wrapLines ? 'whitespace-pre-wrap break-all' : 'whitespace-pre'}>
        {text ?? ''}
      </code>
    </div>
  )
}

function ViewButton({ active, onClick, children }) {
  return (
    <button
      aria-pressed={active}
      className={`min-h-7 rounded-md px-2.5 text-xs font-semibold ${active ? 'bg-brand text-white' : 'text-muted hover:text-ink'}`}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  )
}

function createDiffRows(originalCode, updatedCode) {
  const original = splitLines(originalCode)
  const updated = splitLines(updatedCode)
  const rows = []
  let originalIndex = 0
  let updatedIndex = 0

  if ((original.length + 1) * (updated.length + 1) > MAX_DIFF_CELLS) {
    const maxLength = Math.max(original.length, updated.length)
    for (let index = 0; index < maxLength; index += 1) {
    const originalLine = index < original.length ? original[index] : undefined
    const updatedLine = index < updated.length ? updated[index] : undefined
    rows.push(createRow(
      originalLine,
      updatedLine,
      index < original.length ? index + 1 : undefined,
      index < updated.length ? index + 1 : undefined,
      originalLine === updatedLine ? 'same' : originalLine === undefined ? 'added' : updatedLine === undefined ? 'removed' : 'modified',
    ))
    }
    return rows
  }

  const columns = updated.length + 1
  const lcs = new Uint32Array((original.length + 1) * columns)

  for (let left = original.length - 1; left >= 0; left -= 1) {
    for (let right = updated.length - 1; right >= 0; right -= 1) {
      const cell = left * columns + right
      lcs[cell] = original[left] === updated[right]
        ? lcs[(left + 1) * columns + right + 1] + 1
        : Math.max(lcs[(left + 1) * columns + right], lcs[cell + 1])
    }
  }

  const operations = []
  while (originalIndex < original.length || updatedIndex < updated.length) {
    if (
      originalIndex < original.length &&
      updatedIndex < updated.length &&
      original[originalIndex] === updated[updatedIndex]
    ) {
      operations.push({ type: 'same', original: original[originalIndex], updated: updated[updatedIndex] })
      originalIndex += 1
      updatedIndex += 1
    } else if (
      originalIndex < original.length &&
      (updatedIndex >= updated.length ||
        lcs[(originalIndex + 1) * columns + updatedIndex] >=
        lcs[originalIndex * columns + updatedIndex + 1])
    ) {
      operations.push({ type: 'removed', original: original[originalIndex] })
      originalIndex += 1
    } else {
      operations.push({ type: 'added', updated: updated[updatedIndex] })
      updatedIndex += 1
    }
  }

  let originalNumber = 0
  let updatedNumber = 0
  for (let index = 0; index < operations.length;) {
    if (operations[index].type === 'same') {
      originalNumber += 1
      updatedNumber += 1
      rows.push(createRow(
        operations[index].original,
        operations[index].updated,
        originalNumber,
        updatedNumber,
        'same',
      ))
      index += 1
      continue
    }

    const changed = []
    while (index < operations.length && operations[index].type !== 'same') {
      changed.push(operations[index])
      index += 1
    }
    const removed = changed.filter((operation) => operation.type === 'removed')
    const added = changed.filter((operation) => operation.type === 'added')
    const pairCount = Math.max(removed.length, added.length)
    for (let pair = 0; pair < pairCount; pair += 1) {
      const hasOriginal = Boolean(removed[pair])
      const hasUpdated = Boolean(added[pair])
      if (hasOriginal) originalNumber += 1
      if (hasUpdated) updatedNumber += 1
      rows.push(createRow(
        removed[pair]?.original,
        added[pair]?.updated,
        hasOriginal ? originalNumber : undefined,
        hasUpdated ? updatedNumber : undefined,
        hasOriginal && hasUpdated ? 'modified' : hasOriginal ? 'removed' : 'added',
      ))
    }
  }

  return rows
}

function splitLines(code) {
  if (!code) return []
  const lines = code.split(/\r\n|\n|\r/)
  if (lines.at(-1) === '') lines.pop()
  return lines
}

function createRow(original, updated, originalNumber, updatedNumber, type) {
  return {
    original,
    updated,
    originalNumber,
    updatedNumber,
    type: type || (original === undefined ? 'added' : updated === undefined ? 'removed' : 'same'),
  }
}
