import { useEffect, useState } from 'react'
import { PageHeader } from '../../components/common/PageHeader'
import { supabase } from '../../lib/supabase'

interface DriverRow {
  id: string
  full_name: string
  phone: string | null
  is_active: boolean
}

export function StationDriversPage() {
  const [rows, setRows] = useState<DriverRow[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    supabase
      .from('drivers')
      .select('id,full_name,phone,is_active')
      .order('full_name')
      .then(({ data, error: queryError }) => {
        if (queryError) setError(queryError.message)
        else setRows((data ?? []) as DriverRow[])
      })
  }, [])

  return (
    <section>
      <PageHeader title="Drivers" description="Station drivers and delivery availability." />
      {error ? <p className="mb-4 text-sm text-rose-600">{error}</p> : null}
      <div className="grid grid-cols-3 gap-4">
        {rows.map((driver) => (
          <div key={driver.id} className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="font-semibold text-slate-900">{driver.full_name}</p>
            <p className="mt-1 text-sm text-slate-500">{driver.phone || 'No phone'}</p>
            <p className="mt-4 text-xs font-medium text-slate-400">{driver.is_active ? 'Active' : 'Inactive'}</p>
          </div>
        ))}
      </div>
      {!rows.length ? <p className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-400">No drivers yet.</p> : null}
    </section>
  )
}
