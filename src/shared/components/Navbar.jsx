import { Link } from 'react-router-dom'

export function Navbar() {
  return (
    <Link aria-label="AccessPilot home" className="group flex items-center gap-3" to="/audit">
      <span className="grid size-10 place-items-center rounded-xl bg-brand-dark text-white shadow-md shadow-brand/20 transition-transform group-hover:-rotate-3 group-hover:scale-105">
        <svg aria-hidden="true" fill="none" height="23" viewBox="0 0 24 24" width="23">
          <path d="M5 5.5h14v13H5z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7" />
          <path d="M8 9h8M8 12h5m-5 3h8" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
          <path d="m16.5 12 1.3 1.3 2.2-2.5" stroke="#c2cf43" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
        </svg>
      </span>
      <span>
        <span className="block text-base font-extrabold tracking-tight text-ink">AccessPilot</span>
        <span className="block text-[10px] font-bold uppercase tracking-[0.17em] text-muted">Repair studio</span>
      </span>
    </Link>
  )
}
