import { Droplets } from 'lucide-react'
import { Link, useSearchParams } from 'react-router'
import { ErrorState } from '../../components/common/ErrorState'
import { LoadingState } from '../../components/common/LoadingState'
import { useApiData } from '../../hooks/useApiData'
import { droplyApi } from '../../services/droply-api'

export function CustomerContainers() {
  const [params] = useSearchParams()
  const qr = params.get('qr')

  const { data, error, isLoading } = useApiData(
    () => {
      if (!qr) return Promise.reject(new Error('Missing station QR context'))
      return droplyApi.resolveQr(qr)
    },
    [qr],
  )

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid size-12 place-items-center rounded-2xl bg-slate-100 text-slate-700">
          <Droplets size={22} />
        </div>
        <h1 className="mt-5 text-2xl font-semibold text-slate-950">Your containers</h1>

        {isLoading ? <div className="mt-6"><LoadingState label="Loading station container types…" /></div> : null}
        {error ? <div className="mt-6"><ErrorState title="Containers unavailable" description={error} /></div> : null}

        {data && !data.containerTypes.length ? (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-300 p-5 text-center text-sm text-slate-500">
            This station has not configured container types yet.
          </div>
        ) : null}

        {data?.containerTypes.length ? (
          <div className="mt-6 grid gap-3">
            {data.containerTypes.map((type) => (
              <div key={type.id} className="rounded-2xl border border-slate-200 p-4">
                <p className="font-medium text-slate-800">{type.name}</p>
                <p className="mt-1 text-sm text-slate-500">
                  {type.sizeLiters ? `${type.sizeLiters} L · ` : ''}
                  {type.price.toFixed(3)} JOD
                </p>
              </div>
            ))}
          </div>
        ) : null}

        <Link to="/customer" className="mt-6 block rounded-xl bg-slate-950 px-4 py-3 text-center text-sm font-semibold text-white">
          Continue to Home
        </Link>
      </div>
    </div>
  )
}
