import { useEffect, useState } from 'react'
import { PageHeader } from '../../components/common/PageHeader'
import { supabase } from '../../lib/supabase'

type Metrics = {
  stations: number
  activeStations: number
  customers: number
  orders: number
}

export function PlatformOverview() {
  const [metrics, setMetrics] = useState<Metrics>({
    stations: 0,
    activeStations: 0,
    customers: 0,
    orders: 0,
  })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      supabase.from('stations').select('id,is_active'),
      supabase.from('customers').select('id', { count: 'exact', head: true }),
      supabase.from('orders').select('id', { count: 'exact', head: true }),
    ]).then(([stationsResult, customersResult, ordersResult]) => {
      const firstError = stationsResult.error || customersResult.error || ordersResult.error
      if (firstError) {
        setError(firstError.message)
        return
      }

      const stations = stationsResult.data ?? []
      setMetrics({
        stations: stations.length,
        activeStations: stations.filter((station) => station.is_active).length,
        customers: customersResult.count ?? 0,
        orders: ordersResult.count ?? 0,
      })
    })
  }, [])

  const cards = [
    ['Stations', metrics.stations],
    ['Active Stations', metrics.activeStations],
    ['Customers', metrics.customers],
    ['Orders', metrics.orders],
  ]

  return (
    <section>
      <PageHeader title="Platform Overview" description="Multi-tenant operational view across Droply stations." />
      {error ? <p className="mb-4 text-sm text-rose-600">{error}</p> : null}
      <div className="grid grid-cols-4 gap-4">
        {cards.map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-3 text-3xl font-semibold text-slate-950">{value}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
