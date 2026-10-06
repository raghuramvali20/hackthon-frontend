import { NavLink } from 'react-router-dom'

export function Sidebar() {
  const linkClass = ({ isActive }) =>
    `block rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
      isActive ? 'bg-indigo-50 text-brand' : 'text-muted hover:bg-slate-100 hover:text-ink'
    }`

  return (
    <aside aria-label="Workspace navigation" className="hidden w-56 shrink-0 lg:block">
      <nav className="sticky top-24 space-y-2">
        <NavLink className={linkClass} to="/audit">Start an audit</NavLink>
        <NavLink className={linkClass} to="/reports">Scan history</NavLink>
        <div className="mt-8 rounded-2xl border border-line bg-white p-4 text-xs leading-5 text-muted">
          Automated results should be manually reviewed before release.
        </div>
      </nav>
    </aside>
  )
}
