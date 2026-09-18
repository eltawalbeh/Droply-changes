import { MapPin, Phone, WalletCards } from 'lucide-react'
import { Link } from 'react-router'

export function DriverOrderCard({
  orderId,
  customerName,
  area,
  quantityLabel,
  paymentLabel,
  statusLabel,
}: {
  orderId: string
  customerName: string
  area: string
  quantityLabel: string
  paymentLabel: string
  statusLabel: string
}) {
  return (
    <Link
      to={`/driver/orders/${encodeURIComponent(orderId)}`}
      className="block rounded-2xl border border-slate-200 bg-white p-4"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-900">{customerName}</p>
          <p className="mt-1 text-xs text-slate-400">Order {orderId}</p>
        </div>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
          {statusLabel}
        </span>
      </div>

      <div className="mt-4 grid gap-2 text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-slate-400" />
          {area}
        </div>
        <div className="flex items-center gap-2">
          <Phone size={16} className="text-slate-400" />
          Contact available in live order data
        </div>
        <div className="flex items-center gap-2">
          <WalletCards size={16} className="text-slate-400" />
          {paymentLabel}
        </div>
      </div>

      <div className="mt-4 border-t border-slate-100 pt-3 text-sm font-medium text-slate-700">
        {quantityLabel}
      </div>
    </Link>
  )
}
