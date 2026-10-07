import { NavLink } from 'react-router-dom'
import { useAuth } from '../../features/auth/controllers/AuthContext.js'
import { Button } from '../components/Button.jsx'
import { Navbar } from '../components/Navbar.jsx'
import { ThemeToggle } from '../components/ThemeToggle.jsx'

export function AppHeader() {
  const { user, logout } = useAuth()
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-surface">
      <div className="mx-auto flex max-w-[1520px] flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 py-3 sm:px-6 lg:px-9">
        <Navbar />
        <nav aria-label="Main navigation" className="order-3 flex w-full items-center gap-1 border-t border-line pt-2 sm:order-none sm:w-auto sm:border-0 sm:pt-0">
          <NavItem to="/audit">Scan desk</NavItem>
          <NavItem to="/reports">Reports</NavItem>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <span aria-hidden="true" className="grid size-9 place-items-center rounded-full border border-line bg-subtle text-sm font-bold text-ink">
            {user?.name?.trim()?.charAt(0)?.toUpperCase() || 'U'}
          </span>
          <span className="hidden max-w-36 truncate text-sm font-semibold text-ink md:inline">{user?.name}</span>
          <Button
            aria-label="Sign out"
            className="size-9 min-h-9 !p-0"
            onClick={logout}
            size="sm"
            title="Sign out"
            type="button"
            variant="secondary"
          >
            <svg aria-hidden="true" fill="none" height="18" viewBox="0 0 24 24" width="18">
              <path d="M10 17l5-5-5-5m5 5H3m9-9h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
            </svg>
          </Button>
        </div>
      </div>
    </header>
  )
}

function NavItem({ to, children }) {
  return (
    <NavLink
      className={({ isActive }) => `rounded-lg px-3 py-2 text-sm font-semibold transition ${
        isActive ? 'bg-subtle text-ink underline decoration-brand decoration-2 underline-offset-4' : 'text-muted hover:bg-hover hover:text-ink'
      }`}
      to={to}
    >
      {children}
    </NavLink>
  )
}
