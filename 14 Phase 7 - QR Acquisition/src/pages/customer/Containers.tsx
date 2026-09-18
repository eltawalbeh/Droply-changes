import { Droplets, Minus, Plus } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { ErrorState } from '../../components/common/ErrorState'
import { LoadingState } from '../../components/common/LoadingState'
import { useCustomerSession } from '../../context/CustomerSessionContext'
import { useApiData } from '../../hooks/useApiData'
import { useCustomerOnboarding } from '../../context/CustomerOnboardingContext'
import { droplyApi } from '../../services/droply-api'

export function CustomerContainers() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const qr = params.get('qr')
  const { setSession } = useCustomerSession()
  const { draft, clearDraft } = useCustomerOnboarding()
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { data, error, isLoading } = useApiData(
    () => {
      if (!qr) return Promise.reject(new Error('Missing station QR context'))
      return droplyApi.resolveQr(qr)
    },
    [qr],
  )

  function change(id: string, delta: number) {
    setQuantities((current) => ({
      ...current,
      [id]: Math.max(0, (current[id] ?? 0) + delta),
    }))
  }

  async function finish() {
    if (!draft || !qr || !data) {
      setSubmitError('Registration details expired. Please scan the station QR again.')
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const result = await droplyApi.registerCustomer({
        ...draft,
        containers: data.containerTypes.map((type) => ({
          containerTypeId: type.id,
          quantity: quantities[type.id] ?? 0,
        })),
      })

      if (result.status === 'existing') {
        clearDraft()
        navigate(`/customer/login?qr=${encodeURIComponent(qr)}`, { replace: true })
        return
      }

      setSession({
        token: result.sessionToken,
        customerId: result.customerId,
        expiresAt: result.sessionExpiresAt,
      })
      clearDraft()
      navigate('/customer', { replace: true })
    } catch (reason) {
      setSubmitError(reason instanceof Error ? reason.message : 'Unable to complete registration')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid size-12 place-items-center rounded-2xl bg-slate-100 text-slate-700">
          <Droplets size={22} />
        </div>
        <h1 className="mt-5 text-2xl font-semibold text-slate-950">Your containers</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Save what you already have at home. This is separate from how many you order today.
        </p>

        {isLoading ? <div className="mt-6"><LoadingState label="Loading station container types…" /></div> : null}
        {error ? <div className="mt-6"><ErrorState title="Containers unavailable" description={error} /></div> : null}

        {data?.containerTypes.length ? (
          <div className="mt-6 grid gap-3">
            {data.containerTypes.map((type) => (
              <div key={type.id} className="flex items-center justify-between rounded-2xl border border-slate-200 p-4">
                <div>
                  <p className="font-medium text-slate-800">{type.name}</p>
                  <p className="mt-1 text-sm text-slate-500">{type.price.toFixed(3)} JOD</p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => change(type.id, -1)} className="grid size-9 place-items-center rounded-xl border border-slate-200"><Minus size={16} /></button>
                  <span className="w-6 text-center font-semibold">{quantities[type.id] ?? 0}</span>
                  <button onClick={() => change(type.id, 1)} className="grid size-9 place-items-center rounded-xl bg-slate-950 text-white"><Plus size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {submitError ? <p className="mt-4 text-sm text-rose-600">{submitError}</p> : null}

        <button onClick={finish} disabled={isLoading || isSubmitting || Boolean(error)} className="mt-6 w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white disabled:bg-slate-200 disabled:text-slate-400">
          {isSubmitting ? 'Creating account…' : 'Finish setup'}
        </button>
      </div>
    </div>
  )
}
