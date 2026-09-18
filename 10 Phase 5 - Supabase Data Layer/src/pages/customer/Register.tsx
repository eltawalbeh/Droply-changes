import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router'

export function CustomerRegister() {
  const [params] = useSearchParams()
  const qr = params.get('qr')
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [pin, setPin] = useState('')

  const canContinue = useMemo(
    () =>
      Boolean(qr) &&
      phone.trim().length >= 8 &&
      name.trim().length >= 2 &&
      address.trim().length >= 4 &&
      pin.length === 6,
    [qr, phone, name, address, pin],
  )

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-slate-500">Create your Droply account</p>
        <h1 className="mt-1 text-2xl font-semibold text-slate-950">Set up delivery once.</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Registration saving and secure PIN hashing are activated in the authentication phase. No raw PIN is stored in this screen.
        </p>

        <div className="mt-6 grid gap-4">
          <label className="grid gap-1.5 text-sm font-medium text-slate-700">
            Mobile number
            <input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" className="rounded-xl border border-slate-300 px-3 py-3 outline-none focus:border-slate-950" placeholder="07XXXXXXXX" />
          </label>

          <label className="grid gap-1.5 text-sm font-medium text-slate-700">
            Name
            <input value={name} onChange={(e) => setName(e.target.value)} className="rounded-xl border border-slate-300 px-3 py-3 outline-none focus:border-slate-950" />
          </label>

          <label className="grid gap-1.5 text-sm font-medium text-slate-700">
            Delivery address
            <textarea value={address} onChange={(e) => setAddress(e.target.value)} className="min-h-24 rounded-xl border border-slate-300 px-3 py-3 outline-none focus:border-slate-950" placeholder="Area, street, building or landmark" />
          </label>

          <label className="grid gap-1.5 text-sm font-medium text-slate-700">
            Create 6-digit PIN
            <input value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" className="rounded-xl border border-slate-300 px-3 py-3 outline-none focus:border-slate-950" />
          </label>
        </div>

        <Link
          to={canContinue ? `/customer/containers?qr=${encodeURIComponent(qr!)}` : '#'}
          aria-disabled={!canContinue}
          className={[
            'mt-6 block rounded-xl px-4 py-3 text-center text-sm font-semibold',
            canContinue ? 'bg-slate-950 text-white' : 'pointer-events-none bg-slate-200 text-slate-400',
          ].join(' ')}
        >
          Continue to your containers
        </Link>
      </div>
    </div>
  )
}
