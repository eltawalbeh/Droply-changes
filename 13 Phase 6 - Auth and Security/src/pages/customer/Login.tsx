import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { useCustomerSession } from '../../context/CustomerSessionContext'
import { droplyApi } from '../../services/droply-api'

export function CustomerLogin() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { setSession } = useCustomerSession()
  const qr = params.get('qr') ?? undefined
  const stationId = params.get('station') ?? undefined
  const [phone, setPhone] = useState('')
  const [pin, setPin] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const result = await droplyApi.customerLogin({
        phone,
        pin,
        qrCode: qr,
        stationId,
      })

      setSession({
        token: result.sessionToken,
        customerId: result.customerId,
        expiresAt: result.sessionExpiresAt,
      })

      navigate('/customer', { replace: true })
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to sign in')
    } finally {
      setIsSubmitting(false)
    }
  }

  const hasStationContext = Boolean(qr || stationId)

  return (
    <div className="grid min-h-screen place-items-center bg-slate-50 px-4">
      <form onSubmit={submit} className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-slate-500">Droply customer</p>
        <h1 className="mt-1 text-2xl font-semibold text-slate-950">Welcome back</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Sign in using your mobile number and 6-digit PIN.
        </p>

        {!hasStationContext ? (
          <div className="mt-5 rounded-2xl bg-amber-50 p-4 text-sm leading-6 text-amber-800">
            Open your water station QR link first so Droply knows which station you use.
          </div>
        ) : null}

        <div className="mt-6 grid gap-4">
          <label className="grid gap-1.5 text-sm font-medium text-slate-700">
            Mobile number
            <input inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="rounded-xl border border-slate-300 px-3 py-3 outline-none focus:border-slate-950" />
          </label>
          <label className="grid gap-1.5 text-sm font-medium text-slate-700">
            6-digit PIN
            <input inputMode="numeric" value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))} className="rounded-xl border border-slate-300 px-3 py-3 outline-none focus:border-slate-950" />
          </label>
        </div>

        {error ? <p className="mt-4 text-sm text-rose-600">{error}</p> : null}

        <button disabled={!hasStationContext || isSubmitting || pin.length !== 6} className="mt-6 w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white disabled:bg-slate-200 disabled:text-slate-400">
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}
