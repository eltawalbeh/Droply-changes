import { useEffect, useState } from 'react'
import { PageHeader } from '../../components/common/PageHeader'
import { supabase } from '../../lib/supabase'
import { droplyApi } from '../../services/droply-api'

interface CustomerRow {
  id: string
  full_name: string
  phone: string
  outstanding_balance: number
  is_active: boolean
}

export function StationCustomersPage() {
  const [rows, setRows] = useState<CustomerRow[]>([])
  const [error, setError] = useState<string | null>(null)
  const [recovery, setRecovery] = useState<{ customerId: string; code: string; expiresAt: string } | null>(null)

  useEffect(() => {
    supabase
      .from('customers')
      .select('id,full_name,phone,outstanding_balance,is_active')
      .order('created_at', { ascending: false })
      .then(({ data, error: queryError }) => {
        if (queryError) setError(queryError.message)
        else setRows((data ?? []) as CustomerRow[])
      })
  }, [])

  async function resetPin(customerId: string) {
    setError(null)
    try {
      const result = await droplyApi.resetCustomerPin(customerId)
      setRecovery({
        customerId,
        code: result.recoveryCode,
        expiresAt: result.expiresAt,
      })
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to create recovery code')
    }
  }

  return (
    <section>
      <PageHeader title="Customers" description="Registered customers, balances and station-assisted PIN recovery." />
      {error ? <p className="mb-4 text-sm text-rose-600">{error}</p> : null}

      {recovery ? (
        <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-semibold text-amber-900">One-time recovery code</p>
          <p className="mt-2 text-2xl font-bold tracking-[0.2em] text-amber-950">{recovery.code}</p>
          <p className="mt-2 text-xs text-amber-700">Show this once to the verified customer. It expires automatically.</p>
        </div>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Phone</th>
              <th className="px-4 py-3 font-medium">Outstanding</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr key={row.id}>
                <td className="px-4 py-3 font-medium">{row.full_name}</td>
                <td className="px-4 py-3 text-slate-500">{row.phone}</td>
                <td className="px-4 py-3">{Number(row.outstanding_balance).toFixed(3)} JOD</td>
                <td className="px-4 py-3">{row.is_active ? 'Active' : 'Inactive'}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => resetPin(row.id)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium">
                    Reset PIN
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
