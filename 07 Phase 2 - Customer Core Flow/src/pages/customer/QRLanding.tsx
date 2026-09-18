import { ArrowRight, QrCode } from 'lucide-react'
import { Link, useParams } from 'react-router'

export function QRLanding() {
  const { code } = useParams()

  return (
    <div className="grid min-h-screen place-items-center bg-slate-50 px-5">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid size-12 place-items-center rounded-2xl bg-slate-950 text-white">
          <QrCode size={22} />
        </div>
        <p className="mt-6 text-sm font-medium text-slate-500">Droply station link</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">Order water without calling.</h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          Your QR code identifies the water station and location. Continue to register your delivery details.
        </p>
        {code ? <div className="mt-4 rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-500">QR reference: {code}</div> : null}
        <Link to={code ? `/customer/register?qr=${encodeURIComponent(code)}` : '/customer/register'} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white">
          Continue
          <ArrowRight size={17} />
        </Link>
      </div>
    </div>
  )
}
