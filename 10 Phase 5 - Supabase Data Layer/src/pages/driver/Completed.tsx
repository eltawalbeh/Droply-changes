import { CheckCircle2 } from 'lucide-react'
import { DriverOrderCard } from '../../components/driver/DriverOrderCard'
import { ErrorState } from '../../components/common/ErrorState'
import { LoadingState } from '../../components/common/LoadingState'
import { useApiData } from '../../hooks/useApiData'
import { droplyApi } from '../../services/droply-api'

export function DriverCompleted() {
  const { data, error, isLoading } = useApiData(() => droplyApi.driverOrders('completed'), [])

  return (
    <section>
      <h1 className="text-2xl font-semibold text-slate-950">Completed Today</h1>

      {isLoading ? <div className="mt-6"><LoadingState label="Loading completed deliveries…" /></div> : null}
      {error ? <div className="mt-6"><ErrorState title="Completed deliveries unavailable" description={error} /></div> : null}

      {data && !data.orders.length ? (
        <div className="mt-6 grid min-h-72 place-items-center rounded-2xl border border-dashed border-slate-300 p-6 text-center">
          <div>
            <CheckCircle2 className="mx-auto text-slate-300" size={30} />
            <p className="mt-3 font-medium text-slate-700">Nothing completed yet</p>
          </div>
        </div>
      ) : null}

      {data?.orders.length ? (
        <div className="mt-6 grid gap-3">
          {data.orders.map((order) => (
            <DriverOrderCard
              key={order.id}
              orderId={order.id}
              customerName={order.customer?.name || 'Customer'}
              area={order.address?.addressText || 'Address unavailable'}
              quantityLabel={`${order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0} containers`}
              paymentLabel={order.paymentMethod ? `${order.paymentMethod} · ${order.paymentStatus}` : order.paymentStatus}
              statusLabel={order.status.replaceAll('_', ' ')}
            />
          ))}
        </div>
      ) : null}
    </section>
  )
}
