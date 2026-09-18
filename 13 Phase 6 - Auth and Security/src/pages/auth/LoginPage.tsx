import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../../context/AuthContext'

export function LoginPage() {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const user = await signIn(email.trim(), password)
      navigate(user.role === 'driver' ? '/driver' : user.role === 'platform_admin' ? '/platform-admin' : '/station-admin', {
        replace: true,
      })
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to sign in')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-slate-50 px-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid size-11 place-items-center rounded-xl bg-slate-950 font-bold text-white">D</div>
        <h1 className="mt-6 text-2xl font-semibold text-slate-950">Internal sign in</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">For station staff, drivers and platform administrators.</p>

        <div className="mt-6 grid gap-4">
          <label className="grid gap-1.5 text-sm font-medium text-slate-700">
            Email
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-xl border border-slate-300 px-3 py-3 outline-none focus:border-slate-950" />
          </label>
          <label className="grid gap-1.5 text-sm font-medium text-slate-700">
            Password
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="rounded-xl border border-slate-300 px-3 py-3 outline-none focus:border-slate-950" />
          </label>
        </div>

        {error ? <p className="mt-4 text-sm text-rose-600">{error}</p> : null}

        <button disabled={isSubmitting} className="mt-6 w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50">
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}
