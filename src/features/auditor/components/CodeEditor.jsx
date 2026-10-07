export function CodeEditor({ value, onChange, disabled = false }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-ink">HTML to repair</span>
      <textarea
        aria-label="HTML to repair"
        className="code-editor min-h-80 w-full resize-y rounded-xl border p-4 font-mono text-sm leading-6 shadow-inner focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
        disabled={disabled}
        maxLength={100000}
        onChange={(event) => onChange(event.target.value)}
        placeholder="<main>...</main>"
        spellCheck="false"
        value={value}
      />
      <span className="mt-1 block text-right text-xs text-muted">
        {value.length.toLocaleString()} / 100,000 characters
      </span>
    </label>
  )
}
