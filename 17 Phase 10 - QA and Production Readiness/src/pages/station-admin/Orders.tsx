import { useEffect, useState } from 'react'
import { PageHeader } from '../../components/common/PageHeader'
import { supabase } from '../../lib/supabase'

interface OrderRow {
  id: string
  status: string
  total_amount: number
  payment_method: string | null
  payment_status: string
  created_at: string
  customers?: { full_name?: string; phone?: string } | null
}

export function StationOrdersPage() {
  const [rows, setRows] = useState<OrderRow[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    supabase
      .from('orders')
      .select('id,status,total_amount,payment_method,payment_status,created_at,customers(full_name,phone)')
      .order('created_at', { ascending: false })
      .limit(250)
      .then(({ data, error: queryError }) => {
        if (queryError) setError(queryError.message)
        else setRows((data ?? []) as OrderRow[])
      })
  }, [])

  return (
    <section>
      <PageHeader title="Orders" description="Incoming, active and completed customer orders." />
      {error ? <p className="mb-4 text-sm text-rose-600">{error}</p> : null}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Payment</th>
              <th className="px-4 py-3 font-medium">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr key={row.id}>
                <td className="px-4 py-3 font-medium">{row.id.slice(0, 8)}</td>
                <td className="px-4 py-3">
                  <div>{row.customers?.full_name || 'Customer'}</div>
                  <div className="text-xs text-slate-400">{row.customers?.phone || '—'}</div>
                </td>
                <td className="px-4 py-3 capitalize">{row.status.split('_').join(' ')}</td>
                <td className="px-4 py-3 capitalize">
                  {row.payment_method === 'cliq' ? 'CliQ' : row.payment_method || '—'} · {row.payment_status}
                </td>
                <td className="px-4 py-3 font-medium">{Number(row.total_amount).toFixed(3)} JOD</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!rows.length ? <p className="p-8 text-center text-sm text-slate-400">No orders yet.</p> : null}
      </div>
    </section>
  )
}
