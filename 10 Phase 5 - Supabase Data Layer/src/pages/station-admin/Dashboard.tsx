import { ErrorState } from '../../components/common/ErrorState'
import { LoadingState } from '../../components/common/LoadingState'
import { PageHeader } from '../../components/common/PageHeader'
import { useApiData } from '../../hooks/useApiData'
import { droplyApi } from '../../services/droply-api'

const metricLabels = [
  ['ordersToday', 'Orders Today'],
  ['newOrders', 'New Orders'],
  ['outForDelivery', 'Out for Delivery'],
  ['delivered', 'Delivered'],
  ['cashCollected', 'Cash Collected'],
  ['cliqCollected', 'CliQ'],
  ['pendingPayments', 'Pending Payments'],
  ['activeCustomers', 'Active Customers'],
] as const

export function StationDashboard() {
  const { data, error, isLoading } = useApiData(() => droplyApi.stationDashboard(), [])

  return (
    <section>
      <PageHeader title="Dashboard" description="Operational view of this station from live Supabase-backed data." />

      {isLoading ? <LoadingState label="Loading station dashboard…" /> : null}
      {error ? <ErrorState title="Dashboard data unavailable" description={error} /> : null}

      {data ? (
        <div className="grid grid-cols-4 gap-4">
          {metricLabels.map(([key, label]) => (
            <div key={key} className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-sm text-slate-500">{label}</p>
              <p className="mt-3 text-3xl font-semibold text-slate-950">
                {key === 'cashCollected' || key === 'cliqCollected'
                  ? `${data.metrics[key].toFixed(3)} JOD`
                  : data.metrics[key]}
              </p>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  )
}
