import { Link } from 'react-router-dom'
import { useAuth } from '../../features/auth/controllers/AuthContext.js'
import { Button } from '../components/Button.jsx'
import { Navbar } from '../components/Navbar.jsx'

export function AppHeader() {
  const { user, logout } = useAuth()
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Navbar />
        <nav aria-label="Main navigation" className="hidden items-center gap-1 sm:flex">
          <NavLink to="/audit">New scan</NavLink>
          <NavLink to="/reports">Reports</NavLink>
        </nav>
        <div className="flex items-center gap-3">
          <span className="hidden max-w-32 truncate text-sm text-muted md:inline">{user?.name}</span>
          <Button onClick={logout} variant="secondary">Sign out</Button>
        </div>
      </div>
    </header>
  )
}

function NavLink({ to, children }) {
  return (
    <Link className="rounded-lg px-3 py-2 text-sm font-semibold text-muted hover:bg-slate-50 hover:text-ink" to={to}>
      {children}
    </Link>
  )
}
