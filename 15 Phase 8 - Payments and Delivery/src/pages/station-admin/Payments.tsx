import { useEffect, useState } from 'react'
import { PageHeader } from '../../components/common/PageHeader'
import { supabase } from '../../lib/supabase'

interface PaymentRow {
  id: string
  order_id: string
  method: string
  status: string
  amount: number
  reference: string | null
  created_at: string
}

export function StationPaymentsPage() {
  const [rows, setRows] = useState<PaymentRow[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    supabase
      .from('payments')
      .select('id,order_id,method,status,amount,reference,created_at')
      .order('created_at', { ascending: false })
      .limit(200)
      .then(({ data, error: queryError }) => {
        if (queryError) setError(queryError.message)
        else setRows((data ?? []) as PaymentRow[])
      })
  }, [])

  return (
    <section>
      <PageHeader title="Payments" description="Cash, CliQ and coupon records are separate from delivery status." />
      {error ? <p className="mb-4 text-sm text-rose-600">{error}</p> : null}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium">Method</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Reference</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr key={row.id}>
                <td className="px-4 py-3">{row.order_id.slice(0, 8)}</td>
                <td className="px-4 py-3 capitalize">{row.method === 'cliq' ? 'CliQ' : row.method}</td>
                <td className="px-4 py-3 capitalize">{row.status}</td>
                <td className="px-4 py-3 font-medium">{Number(row.amount).toFixed(3)} JOD</td>
                <td className="px-4 py-3 text-slate-500">{row.reference || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!rows.length ? <p className="p-8 text-center text-sm text-slate-400">No payment records yet.</p> : null}
      </div>
    </section>
  )
}
