export function CodeEditor({
  value,
  onChange,
  disabled = false,
  label = 'HTML to repair',
  maxLength = 100000,
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-ink">{label}</span>
      <textarea
        aria-label={label}
        className="code-editor min-h-80 w-full resize-y rounded-xl border p-4 font-mono text-sm leading-6 shadow-inner focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
        disabled={disabled}
        maxLength={maxLength}
        onChange={(event) => onChange(event.target.value)}
        placeholder="<main>...</main>"
        spellCheck="false"
        value={value}
      />
      <span className="mt-1 block text-right text-xs text-muted">
        {value.length.toLocaleString()} / {maxLength.toLocaleString()} characters
      </span>
    </label>
  )
}
