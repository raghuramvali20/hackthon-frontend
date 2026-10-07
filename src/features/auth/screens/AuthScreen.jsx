import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../controllers/AuthContext.js'
import { Button } from '../../../shared/components/Button.jsx'
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
    <main className="min-h-screen bg-canvas px-4 py-6 sm:px-8 sm:py-10">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4">
        <Navbar />
        <ThemeToggle />
      </div>
      <section className="mx-auto mt-8 grid w-full max-w-6xl overflow-hidden rounded-[1.75rem] border border-line bg-surface shadow-[var(--shadow-card)] lg:mt-12 lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="relative isolate flex min-h-64 flex-col justify-between overflow-hidden bg-[#33242e] p-7 text-[#fff8ed] sm:p-10 lg:min-h-[620px]">
          <div aria-hidden="true" className="paper-grid absolute inset-0 -z-10 opacity-20" />
          <div aria-hidden="true" className="absolute -right-36 bottom-8 size-56 rounded-full border-[28px] border-[#c2cf43]/90" />
          <div className="relative">
            <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#e8dcd4]">
              <span className="size-2 rounded-full bg-[#c2cf43]" />
              Field notes · AccessPilot
            </p>
            <h1 className="display-heading mt-8 max-w-lg text-4xl leading-[1.05] sm:text-5xl">
              Better access starts with a closer look.
            </h1>
            <p className="mt-5 max-w-md text-sm leading-6 text-[#e6d9dd]">
              A guided workspace for reviewing static HTML, choosing focused repairs, and checking what changed.
            </p>
          </div>
          <div className="relative mt-10 grid gap-3 border-t border-white/20 pt-5 sm:grid-cols-3">
            <AuthStep number="01" label="Inspect" />
            <AuthStep number="02" label="Choose" />
            <AuthStep number="03" label="Review" />
          </div>
        </aside>
        <div className="flex items-center p-6 sm:p-10 lg:p-14">
          <div className="mx-auto w-full max-w-md">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand">
              {isRegister ? 'Create a workspace' : 'Your workspace'}
            </p>
            <h2 className="display-heading mt-3 text-3xl leading-tight text-ink sm:text-4xl">
              {isRegister ? 'Start a repair desk.' : 'Welcome back.'}
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              {isRegister ? 'Create an account to keep your scan reports together.' : 'Sign in to continue reviewing pages and saved reports.'}
            </p>
            <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
              {isRegister && (
                <label className="block text-sm font-semibold text-ink">
                  Name
                  <input
                    autoComplete="name"
                    className="mt-1.5 min-h-12 w-full rounded-xl border border-line bg-surface px-3.5 text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                    maxLength={120}
                    onChange={(event) => setForm({ ...form, name: event.target.value })}
                    required
                    value={form.name}
                  />
                </label>
              )}
              <label className="block text-sm font-semibold text-ink">
                Email
                <input
                  autoComplete="email"
                  className="mt-1.5 min-h-12 w-full rounded-xl border border-line bg-surface px-3.5 text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                  onChange={(event) => setForm({ ...form, email: event.target.value })}
                  required
                  type="email"
                  value={form.email}
                />
              </label>
              <label className="block text-sm font-semibold text-ink">
                Password
                <input
                  autoComplete={isRegister ? 'new-password' : 'current-password'}
                  className="mt-1.5 min-h-12 w-full rounded-xl border border-line bg-surface px-3.5 text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                  minLength={isRegister ? 8 : undefined}
                  onChange={(event) => setForm({ ...form, password: event.target.value })}
                  required
                  type="password"
                  value={form.password}
                />
                {isRegister && <span className="mt-1 block text-xs font-normal text-muted">At least 8 characters.</span>}
              </label>
              {error && <p className="rounded-xl border border-danger/30 bg-danger/10 p-3 text-sm text-danger" role="alert">{error}</p>}
              <Button className="mt-2 w-full" disabled={isSubmitting} type="submit">
                {isSubmitting ? 'Please wait…' : isRegister ? 'Create account' : 'Sign in'}
                <span aria-hidden="true">→</span>
              </Button>
            </form>
            <p className="mt-6 text-center text-sm text-muted">
              {isRegister ? 'Already registered?' : 'New to AccessPilot?'}{' '}
              <Link className="font-semibold text-brand hover:underline" to={isRegister ? '/login' : '/register'}>
                {isRegister ? 'Sign in' : 'Create an account'}
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}

function AuthStep({ number, label }) {
  return (
    <div>
      <p className="text-xs font-bold text-[#c2cf43]">{number}</p>
      <p className="mt-1 text-xs font-semibold text-[#fff8ed]">{label}</p>
    </div>
  )
}
