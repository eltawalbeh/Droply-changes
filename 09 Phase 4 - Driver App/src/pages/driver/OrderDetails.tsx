import { MapPin, Navigation, Phone, WalletCards } from 'lucide-react'
import { useParams } from 'react-router'

export function DriverOrderDetails() {
  const { orderId } = useParams()

  return (
    <section>
      <p className="text-sm font-medium text-slate-500">Order details</p>
      <h1 className="mt-1 text-2xl font-semibold text-slate-950">
        {orderId ? `Order ${orderId}` : 'Order'}
      </h1>

      <div className="mt-6 grid gap-3">
        <div className="rounded-2xl border border-slate-200 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Customer</p>
          <p className="mt-2 text-sm text-slate-500">Customer data loads from the assigned live order.</p>
        </div>

        <div className="rounded-2xl border border-slate-200 p-4">
          <div className="flex items-start gap-3">
            <MapPin size={18} className="mt-0.5 text-slate-400" />
            <div>
              <p className="text-sm font-medium text-slate-800">Delivery address</p>
              <p className="mt-1 text-sm text-slate-400">No live address loaded.</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 p-4">
          <div className="flex items-start gap-3">
            <WalletCards size={18} className="mt-0.5 text-slate-400" />
            <div>
              <p className="text-sm font-medium text-slate-800">Payment</p>
              <p className="mt-1 text-sm text-slate-400">Method and payment status load from the order.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <button disabled className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-400">
          <Phone size={17} />
          Call
        </button>
        <button disabled className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-400">
          <Navigation size={17} />
          Navigate
        </button>
      </div>

      <div className="mt-3 grid gap-3">
        <button disabled className="w-full rounded-xl bg-slate-200 px-4 py-3 text-sm font-semibold text-slate-400">
          Accept Order
        </button>
        <button disabled className="w-full rounded-xl bg-slate-200 px-4 py-3 text-sm font-semibold text-slate-400">
          Mark Out for Delivery
        </button>
        <button disabled className="w-full rounded-xl bg-slate-200 px-4 py-3 text-sm font-semibold text-slate-400">
          Complete Delivery
        </button>
      </div>

      <p className="mt-3 text-center text-xs leading-5 text-slate-400">
        Actions activate only when a real assigned order is loaded from Supabase.
      </p>
    </section>
  )
}
