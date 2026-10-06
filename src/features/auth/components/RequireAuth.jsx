import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../controllers/AuthContext.js'

export function RequireAuth() {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <main className="grid min-h-screen place-items-center text-sm text-muted">Checking your session…</main>
  }

  if (!user) {
    return <Navigate replace state={{ from: location }} to="/login" />
  }

  return <Outlet />
}
