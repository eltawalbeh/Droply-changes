import { useEffect, useMemo, useState } from 'react'
import { PageHeader } from '../../components/common/PageHeader'
import { supabase } from '../../lib/supabase'

interface OrderRow {
  id: string
  status: string
  total_amount: number
  payment_method: string | null
  payment_status: string
  driver_id: string | null
  created_at: string
}

export function StationReportsPage() {
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    supabase
      .from('orders')
      .select('id,status,total_amount,payment_method,payment_status,driver_id,created_at')
      .gte('created_at', since)
      .order('created_at', { ascending: false })
      .then(({ data, error: queryError }) => {
        if (queryError) setError(queryError.message)
        else setOrders((data ?? []) as OrderRow[])
      })
  }, [])

  const metrics = useMemo(() => {
    const delivered = orders.filter((order) => ['delivered', 'closed'].includes(order.status))
    const paid = orders.filter((order) => order.payment_status === 'paid')
    const revenue = paid.reduce((sum, order) => sum + Number(order.total_amount), 0)
    const cash = paid.filter((order) => order.payment_method === 'cash').reduce((sum, order) => sum + Number(order.total_amount), 0)
    const cliq = paid.filter((order) => order.payment_method === 'cliq').reduce((sum, order) => sum + Number(order.total_amount), 0)

    return { total: orders.length, delivered: delivered.length, revenue, cash, cliq }
  }, [orders])

  return (
    <section>
      <PageHeader title="Reports" description="Rolling 30-day operational snapshot from live orders." />
      {error ? <p className="mb-4 text-sm text-rose-600">{error}</p> : null}

      <div className="grid grid-cols-5 gap-4">
        {[
          ['Orders', metrics.total],
          ['Delivered', metrics.delivered],
          ['Revenue', `${metrics.revenue.toFixed(3)} JOD`],
          ['Cash', `${metrics.cash.toFixed(3)} JOD`],
          ['CliQ', `${metrics.cliq.toFixed(3)} JOD`],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-3 text-2xl font-semibold text-slate-950">{value}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
