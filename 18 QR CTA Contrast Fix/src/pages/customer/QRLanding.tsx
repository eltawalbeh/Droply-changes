import { ArrowRight, QrCode } from 'lucide-react'
import { Link, useParams } from 'react-router'
import { ErrorState } from '../../components/common/ErrorState'
import { LoadingState } from '../../components/common/LoadingState'
import { useApiData } from '../../hooks/useApiData'
import { droplyApi } from '../../services/droply-api'

export function QRLanding() {
  const { code } = useParams()

  const { data, error, isLoading } = useApiData(
    () => {
      if (!code) return Promise.reject(new Error('Invalid QR code'))
      return droplyApi.resolveQr(code)
    },
    [code],
  )

  if (isLoading) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-50 px-5">
        <div className="w-full max-w-md"><LoadingState label="Checking station QR…" /></div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-50 px-5">
        <div className="w-full max-w-md">
          <ErrorState title="QR not available" description={error || 'This station link is unavailable.'} />
        </div>
      </div>
    )
  }

  const registerUrl =
    `/customer/register?qr=${encodeURIComponent(data.qrCode.code)}` +
    (data.scanId ? `&scan=${encodeURIComponent(data.scanId)}` : '')

  return (
    <div className="grid min-h-screen place-items-center bg-slate-50 px-5">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid size-12 place-items-center rounded-2xl bg-slate-950 text-white">
          <QrCode size={22} />
        </div>

        <p className="mt-6 text-sm font-medium text-slate-500">{data.location.name}</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">
          {data.station.name}
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          Your water station is already identified. Set up delivery once, then future orders are only a few taps.
        </p>

        <Link
          to={registerUrl}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold"
          style={{ color: '#ffffff' }}
        >
          <span style={{ color: '#ffffff' }}>New customer</span>
          <ArrowRight size={17} color="#ffffff" />
        </Link>
        <Link to={`/customer/login?qr=${encodeURIComponent(data.qrCode.code)}`} className="mt-3 block text-center text-sm font-medium text-slate-600">
          I already have an account
        </Link>
      </div>
    </div>
  )
}
