import { LocateFixed } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { useCustomerOnboarding } from '../../context/CustomerOnboardingContext'

export function CustomerRegister() {
  const navigate = useNavigate()
  const { setDraft } = useCustomerOnboarding()
  const [params] = useSearchParams()
  const qr = params.get('qr')
  const scanId = params.get('scan')
  const [phone, setPhone] = useState('')
  const [fullName, setFullName] = useState('')
  const [addressText, setAddressText] = useState('')
  const [notes, setNotes] = useState('')
  const [pin, setPin] = useState('')
  const [latitude, setLatitude] = useState<number | null>(null)
  const [longitude, setLongitude] = useState<number | null>(null)
  const [locationMessage, setLocationMessage] = useState<string | null>(null)

  const canContinue = useMemo(
    () =>
      Boolean(qr) &&
      phone.trim().length >= 8 &&
      fullName.trim().length >= 2 &&
      addressText.trim().length >= 4 &&
      pin.length === 6,
    [qr, phone, fullName, addressText, pin],
  )

  function captureLocation() {
    if (!navigator.geolocation) {
      setLocationMessage('Location is not supported by this browser.')
      return
    }

    setLocationMessage('Getting your location…')
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude)
        setLongitude(position.coords.longitude)
        setLocationMessage('Delivery location saved.')
      },
      () => setLocationMessage('Could not access your location. You can continue with the written address.'),
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }

  function continueFlow() {
    if (!canContinue || !qr) return

    setDraft({
      qrCode: qr,
      scanId,
      phone: phone.trim(),
      fullName: fullName.trim(),
      addressText: addressText.trim(),
      pin,
      latitude,
      longitude,
      notes: notes.trim() || null,
    })

    navigate(`/customer/containers?qr=${encodeURIComponent(qr)}`)
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-slate-500">Create your Droply account</p>
        <h1 className="mt-1 text-2xl font-semibold text-slate-950">Set up delivery once.</h1>

        <div className="mt-6 grid gap-4">
          <label className="grid gap-1.5 text-sm font-medium text-slate-700">
            Mobile number
            <input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" className="rounded-xl border border-slate-300 px-3 py-3 outline-none focus:border-slate-950" placeholder="07XXXXXXXX" />
          </label>

          <label className="grid gap-1.5 text-sm font-medium text-slate-700">
            Name
            <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="rounded-xl border border-slate-300 px-3 py-3 outline-none focus:border-slate-950" />
          </label>

          <label className="grid gap-1.5 text-sm font-medium text-slate-700">
            Delivery address
            <textarea value={addressText} onChange={(e) => setAddressText(e.target.value)} className="min-h-24 rounded-xl border border-slate-300 px-3 py-3 outline-none focus:border-slate-950" placeholder="Area, street, building or landmark" />
          </label>

          <button type="button" onClick={captureLocation} className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700">
            <LocateFixed size={17} />
            Use current location
          </button>
          {locationMessage ? <p className="text-xs text-slate-500">{locationMessage}</p> : null}

          <label className="grid gap-1.5 text-sm font-medium text-slate-700">
            Delivery notes
            <input value={notes} onChange={(e) => setNotes(e.target.value)} className="rounded-xl border border-slate-300 px-3 py-3 outline-none focus:border-slate-950" placeholder="Apartment, floor, landmark…" />
          </label>

          <label className="grid gap-1.5 text-sm font-medium text-slate-700">
            Create 6-digit PIN
            <input value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" className="rounded-xl border border-slate-300 px-3 py-3 outline-none focus:border-slate-950" />
          </label>
        </div>

        <button onClick={continueFlow} disabled={!canContinue} className="mt-6 w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white disabled:bg-slate-200 disabled:text-slate-400">
          Continue to your containers
        </button>
      </div>
    </div>
  )
}
