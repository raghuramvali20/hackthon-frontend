import { Link } from 'react-router-dom'

export function Navbar() {
  return (
    <Link aria-label="AccessPilot home" className="flex items-center gap-3" to="/audit">
      <span className="grid size-10 place-items-center rounded-xl bg-brand text-sm font-black text-white">
        A
      </span>
      <span>
        <span className="block text-base font-extrabold tracking-tight text-ink">AccessPilot</span>
        <span className="block text-xs text-muted">Accessibility repair engine</span>
      </span>
    </Link>
  )
}
