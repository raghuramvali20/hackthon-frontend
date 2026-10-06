export function CodeDiff({ originalCode = '', repairedCode = '' }) {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <CodePanel title="Original HTML" code={originalCode} />
      <CodePanel title="Repaired HTML" code={repairedCode} />
    </div>
  )
}

function CodePanel({ title, code }) {
  return (
    <section className="min-w-0 overflow-hidden rounded-xl border border-line">
      <h3 className="border-b border-line bg-slate-50 px-4 py-3 text-sm font-semibold">
        {title}
      </h3>
      <pre className="max-h-[32rem] overflow-auto bg-slate-950 p-4 text-xs leading-6 text-slate-100">
        <code>{code || 'No code available.'}</code>
      </pre>
    </section>
  )
}
