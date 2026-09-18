import { PackageSearch } from 'lucide-react'
import { useCustomerSession } from '../../context/CustomerSessionContext'
import { useApiData } from '../../hooks/useApiData'
import { droplyApi } from '../../services/droply-api'

export function CustomerOrders() {
  const { session } = useCustomerSession()
  const { data, error, isLoading } = useApiData(
    () => {
      if (!session?.token) return Promise.reject(new Error('Customer session required'))
      return droplyApi.customerOrders(session.token)
    },
    [session?.token],
  )

  return (
    <section>
      <h1 className="text-2xl font-semibold text-slate-950">My Orders</h1>

      {isLoading ? <p className="mt-6 text-sm text-slate-500">Loading orders…</p> : null}
      {error ? <p className="mt-6 text-sm text-rose-600">{error}</p> : null}

      {data && !data.orders.length ? (
        <div className="mt-6 grid min-h-64 place-items-center rounded-2xl border border-dashed border-slate-300 p-6 text-center">
          <div>
            <PackageSearch className="mx-auto text-slate-300" size={28} />
            <p className="mt-3 font-medium text-slate-700">No orders yet</p>
          </div>
        </div>
      ) : null}

      {data?.orders.length ? (
        <div className="mt-6 grid gap-3">
          {data.orders.map((order) => (
            <div key={order.id} className="rounded-2xl border border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-900">Order {order.id.slice(0, 8)}</p>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                  {order.status.split('_').join(' ')}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-slate-500">{order.paymentMethod || 'Payment not selected'} · {order.paymentStatus}</span>
                <strong>{order.totalAmount.toFixed(3)} JOD</strong>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  )
}
