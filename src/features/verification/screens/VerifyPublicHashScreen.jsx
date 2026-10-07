import { Link, useParams } from 'react-router-dom'
import { Card } from '../../../shared/components/Card.jsx'
import { Navbar } from '../../../shared/components/Navbar.jsx'
import { ThemeToggle } from '../../../shared/components/ThemeToggle.jsx'

export function VerifyPublicHashScreen() {
  const { hash } = useParams()
  return (
    <main className="relative grid min-h-screen place-items-center bg-canvas px-4 py-10">
      <div className="absolute left-5 top-5"><Navbar /></div>
      <div className="absolute right-5 top-5 z-20"><ThemeToggle /></div>
      <Card className="w-full max-w-xl p-7 sm:p-9">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand">Public verification</p>
        <h1 className="mt-2 text-2xl font-bold">Verification endpoint unavailable</h1>
        <p className="mt-4 text-sm leading-6 text-muted">
          The supplied reference <code className="break-all">{hash}</code> cannot be verified publicly because the current backend does not implement <code>/api/verify/:hash</code>. Open the signed-in report to review its supported check results.
        </p>
        <Link className="mt-6 inline-block font-semibold text-brand hover:underline" to="/login">Sign in to view reports</Link>
      </Card>
    </main>
  )
}
