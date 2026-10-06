import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../controllers/AuthContext.js'
import { Button } from '../../../shared/components/Button.jsx'
import { Card } from '../../../shared/components/Card.jsx'
import { Navbar } from '../../../shared/components/Navbar.jsx'
import { ThemeToggle } from '../../../shared/components/ThemeToggle.jsx'

export function AuthScreen({ mode = 'login' }) {
  const isRegister = mode === 'register'
  const { user, login, register } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (user) return <Navigate replace to="/audit" />

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)
    try {
      if (isRegister) await register(form)
      else await login({ email: form.email, password: form.password })
      navigate(location.state?.from?.pathname || '/audit', { replace: true })
    } catch (requestError) {
      setError(requestError.message || 'Unable to authenticate.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-canvas px-4 py-10">
      <div aria-hidden="true" className="pointer-events-none absolute -left-40 -top-40 size-[32rem] rounded-full bg-brand/10 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-48 -right-40 size-[34rem] rounded-full bg-violet-400/10 blur-3xl" />
      <div className="absolute right-5 top-5 z-20"><ThemeToggle /></div>
      <div className="relative w-full max-w-md">
        <div className="mb-8 flex justify-center"><Navbar /></div>
        <Card className="p-7 sm:p-9">
          <p className="text-sm font-semibold text-brand">YOUR ACCESSIBILITY WORKSPACE</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight">
            {isRegister ? 'Create your account' : 'Welcome back'}
          </h1>
          <p className="mt-2 text-sm text-muted">
            {isRegister ? 'Create an account to save scan reports.' : 'Sign in to repair code and view your reports.'}
          </p>
          <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
            {isRegister && (
              <label className="block text-sm font-medium">
                Name
                <input
                  autoComplete="name"
                  className="mt-1.5 w-full rounded-xl border border-line bg-surface px-3 py-2.5"
                  maxLength={120}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  required
                  value={form.name}
                />
              </label>
            )}
            <label className="block text-sm font-medium">
              Email
              <input
                autoComplete="email"
                className="mt-1.5 w-full rounded-xl border border-line bg-surface px-3 py-2.5"
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                required
                type="email"
                value={form.email}
              />
            </label>
            <label className="block text-sm font-medium">
              Password
              <input
                autoComplete={isRegister ? 'new-password' : 'current-password'}
                className="mt-1.5 w-full rounded-xl border border-line bg-surface px-3 py-2.5"
                minLength={isRegister ? 8 : undefined}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                required
                type="password"
                value={form.password}
              />
              {isRegister && <span className="mt-1 block text-xs text-muted">At least 8 characters.</span>}
            </label>
            {error && <p className="rounded-lg bg-danger/10 p-3 text-sm text-danger" role="alert">{error}</p>}
            <Button className="w-full" disabled={isSubmitting} type="submit">
              {isSubmitting ? 'Please wait…' : isRegister ? 'Create account' : 'Sign in'}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted">
            {isRegister ? 'Already registered?' : 'New to AccessPilot?'}{' '}
            <Link className="font-semibold text-brand hover:underline" to={isRegister ? '/login' : '/register'}>
              {isRegister ? 'Sign in' : 'Create an account'}
            </Link>
          </p>
        </Card>
      </div>
    </main>
  )
}
