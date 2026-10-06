import { NavLink } from 'react-router-dom'

export function Sidebar() {
  const linkClass = ({ isActive }) =>
    `group flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition-colors ${
      isActive ? 'bg-brand/10 text-brand' : 'text-muted hover:bg-hover hover:text-ink'
    }`

  return (
    <aside aria-label="Workspace navigation" className="hidden w-60 shrink-0 lg:block">
      <nav className="sticky top-28">
        <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-[0.16em] text-muted">Workspace</p>
        <div className="space-y-1">
          <NavLink className={linkClass} to="/audit">
            <NavIcon type="scan" />
            New accessibility scan
          </NavLink>
          <NavLink className={linkClass} to="/reports">
            <NavIcon type="report" />
            Scan history
          </NavLink>
        </div>
        <div className="mt-8 rounded-2xl border border-line bg-surface p-4">
          <div className="flex items-center gap-2 text-xs font-bold text-ink">
            <span className="size-2 rounded-full bg-good" />
            Safe, private workspace
          </div>
          <p className="mt-2 text-xs leading-5 text-muted">
            Your scans are saved to your account. Always manually review generated repairs before release.
          </p>
        </div>
      </nav>
    </aside>
  )
}

function NavIcon({ type }) {
  const path = type === 'scan'
    ? <><path d="M4 7V5a1 1 0 0 1 1-1h2m10 0h2a1 1 0 0 1 1 1v2m0 10v2a1 1 0 0 1-1 1h-2m-10 0H5a1 1 0 0 1-1-1v-2" /><path d="M8 12h8m-4-4v8" /></>
    : <><path d="M5 19V5m0 14h15" /><path d="m8 15 3-4 3 2 5-6" /></>

  return (
    <svg aria-hidden="true" className="shrink-0" fill="none" height="18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" viewBox="0 0 24 24" width="18">
      {path}
    </svg>
  )
}
