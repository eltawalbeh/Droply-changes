import { MapPin, Navigation, Phone, WalletCards } from 'lucide-react'
import { useParams } from 'react-router'
import { ErrorState } from '../../components/common/ErrorState'
import { LoadingState } from '../../components/common/LoadingState'
import { useApiData } from '../../hooks/useApiData'
import { droplyApi } from '../../services/droply-api'

export function DriverOrderDetails() {
  const { orderId } = useParams()

  const { data, error, isLoading } = useApiData(
    () => {
      if (!orderId) return Promise.reject(new Error('Missing order ID'))
      return droplyApi.driverOrder(orderId)
    },
    [orderId],
  )

  if (isLoading) return <LoadingState label="Loading order…" />
  if (error || !data) return <ErrorState title="Order unavailable" description={error || 'Order not found'} />

  const { order } = data
  const phone = order.customer?.phone
  const lat = order.address?.latitude
  const lng = order.address?.longitude

  return (
    <section>
      <p className="text-sm font-medium text-slate-500">Order details</p>
      <h1 className="mt-1 text-2xl font-semibold text-slate-950">Order {order.id}</h1>

      <div className="mt-6 grid gap-3">
        <div className="rounded-2xl border border-slate-200 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Customer</p>
          <p className="mt-2 text-sm font-medium text-slate-800">{order.customer?.name || 'Customer'}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 p-4">
          <div className="flex items-start gap-3">
            <MapPin size={18} className="mt-0.5 text-slate-400" />
            <div>
              <p className="text-sm font-medium text-slate-800">Delivery address</p>
              <p className="mt-1 text-sm text-slate-500">{order.address?.addressText || 'Address unavailable'}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 p-4">
          <div className="flex items-start gap-3">
            <WalletCards size={18} className="mt-0.5 text-slate-400" />
            <div>
              <p className="text-sm font-medium text-slate-800">Payment</p>
              <p className="mt-1 text-sm text-slate-500">
                {order.paymentMethod || 'Not selected'} · {order.paymentStatus}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <a href={phone ? `tel:${phone}` : undefined} aria-disabled={!phone} className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold ${phone ? 'border-slate-300 text-slate-700' : 'pointer-events-none border-slate-200 text-slate-300'}`}>
          <Phone size={17} />
          Call
        </a>
        <a href={lat != null && lng != null ? `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}` : undefined} aria-disabled={lat == null || lng == null} className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold ${lat != null && lng != null ? 'border-slate-300 text-slate-700' : 'pointer-events-none border-slate-200 text-slate-300'}`}>
          <Navigation size={17} />
          Navigate
        </a>
      </div>

      <p className="mt-4 text-center text-xs leading-5 text-slate-400">
        Status mutation remains locked until authenticated role actions are enabled in Phase 6.
      </p>
    </section>
  )
}
