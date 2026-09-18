import { CheckCircle2 } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { droplyApi } from '../../services/droply-api'

export function CompleteDelivery() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'cliq' | 'coupon'>('cash')
  const [paymentStatus, setPaymentStatus] = useState<'paid' | 'pending'>('paid')
  const [reference, setReference] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function complete() {
    if (!orderId) return
    setIsSubmitting(true)
    setError(null)

    try {
      await droplyApi.completeDriverOrder(orderId, {
        paymentMethod,
        paymentStatus,
        reference: reference.trim() || undefined,
      })
      navigate('/driver/completed', { replace: true })
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to complete delivery')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section>
      <div className="grid size-12 place-items-center rounded-2xl bg-slate-100 text-slate-600">
        <CheckCircle2 size={22} />
      </div>
      <h1 className="mt-5 text-2xl font-semibold text-slate-950">Complete delivery</h1>
      <p className="mt-2 text-sm leading-6 text-slate-500">Delivery status and payment status are recorded independently.</p>

      <div className="mt-6 rounded-2xl border border-slate-200 p-4">
        <p className="text-sm font-medium text-slate-800">Payment method</p>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {(['cash', 'cliq', 'coupon'] as const).map((method) => (
            <button key={method} onClick={() => setPaymentMethod(method)} className={`rounded-xl border px-3 py-2 text-sm capitalize ${paymentMethod === method ? 'border-slate-950 bg-slate-950 text-white' : 'border-slate-200'}`}>
              {method === 'cliq' ? 'CliQ' : method}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3 rounded-2xl border border-slate-200 p-4">
        <p className="text-sm font-medium text-slate-800">Payment status</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {(['paid', 'pending'] as const).map((status) => (
            <button key={status} onClick={() => setPaymentStatus(status)} className={`rounded-xl border px-3 py-2 text-sm capitalize ${paymentStatus === status ? 'border-slate-950 bg-slate-950 text-white' : 'border-slate-200'}`}>
              {status}
            </button>
          ))}
        </div>
      </div>

      {paymentMethod === 'cliq' ? (
        <input value={reference} onChange={(e) => setReference(e.target.value)} placeholder="CliQ reference (optional)" className="mt-3 w-full rounded-xl border border-slate-300 px-3 py-3 text-sm" />
      ) : null}

      {error ? <p className="mt-4 text-sm text-rose-600">{error}</p> : null}

      <button onClick={complete} disabled={isSubmitting} className="mt-6 w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50">
        {isSubmitting ? 'Completing…' : 'Confirm Delivery'}
      </button>
    </section>
  )
}
