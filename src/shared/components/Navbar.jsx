import { Link } from 'react-router-dom'

export function Navbar() {
  return (
    <Link aria-label="AccessPilot home" className="group flex items-center gap-3" to="/audit">
      <span className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-brand to-violet-500 text-white shadow-md shadow-brand/25 transition-transform group-hover:-rotate-3 group-hover:scale-105">
        <svg aria-hidden="true" fill="none" height="23" viewBox="0 0 24 24" width="23">
          <path d="m12 3 8 4v5c0 5-3.4 8-8 9-4.6-1-8-4-8-9V7l8-4Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" />
          <path d="m8.5 12.2 2.2 2.2 4.8-5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
        </svg>
      </span>
      <span>
        <span className="block text-base font-extrabold tracking-tight text-ink">AccessPilot</span>
        <span className="block text-[11px] font-medium tracking-wide text-muted">ACCESSIBILITY WORKSPACE</span>
      </span>
    </Link>
  )
}
