import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { droplyApi } from '../../services/droply-api'

export function CustomerRecovery() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const stationId = params.get('station') ?? ''
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [newPin, setNewPin] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setError(null)
    setMessage(null)

    try {
      await droplyApi.completeRecovery({ stationId, phone, code, newPin })
      setMessage('PIN updated. You can sign in with the new PIN.')
      window.setTimeout(() => navigate(`/customer/login?station=${encodeURIComponent(stationId)}`), 800)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to reset PIN')
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-slate-50 px-4">
      <form onSubmit={submit} className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-950">Set a new PIN</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Enter the one-time recovery code provided by your water station.
        </p>

        <div className="mt-6 grid gap-4">
          <input inputMode="tel" placeholder="Mobile number" value={phone} onChange={(e) => setPhone(e.target.value)} className="rounded-xl border border-slate-300 px-3 py-3" />
          <input inputMode="numeric" placeholder="Recovery code" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 8))} className="rounded-xl border border-slate-300 px-3 py-3" />
          <input inputMode="numeric" placeholder="New 6-digit PIN" value={newPin} onChange={(e) => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 6))} className="rounded-xl border border-slate-300 px-3 py-3" />
        </div>

        {message ? <p className="mt-4 text-sm text-emerald-700">{message}</p> : null}
        {error ? <p className="mt-4 text-sm text-rose-600">{error}</p> : null}

        <button disabled={!stationId || newPin.length !== 6 || code.length < 6} className="mt-6 w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white disabled:bg-slate-200 disabled:text-slate-400">
          Update PIN
        </button>
      </form>
    </div>
  )
}
