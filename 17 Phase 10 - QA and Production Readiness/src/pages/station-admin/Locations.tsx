import { useEffect, useState } from 'react'
import { PageHeader } from '../../components/common/PageHeader'
import { supabase } from '../../lib/supabase'

interface LocationRow {
  id: string
  name: string
  phone: string | null
  address_text: string | null
  cliq_alias: string | null
  is_active: boolean
}

export function StationLocationsPage() {
  const [rows, setRows] = useState<LocationRow[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    supabase
      .from('station_locations')
      .select('id,name,phone,address_text,cliq_alias,is_active')
      .order('name')
      .then(({ data, error: queryError }) => {
        if (queryError) setError(queryError.message)
        else setRows((data ?? []) as LocationRow[])
      })
  }, [])

  return (
    <section>
      <PageHeader title="Locations" description="Station branches, contact details and CliQ configuration." />
      {error ? <p className="mb-4 text-sm text-rose-600">{error}</p> : null}
      <div className="grid grid-cols-2 gap-4">
        {rows.map((row) => (
          <div key={row.id} className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-start justify-between">
              <h2 className="font-semibold text-slate-900">{row.name}</h2>
              <span className="text-xs text-slate-400">{row.is_active ? 'Active' : 'Inactive'}</span>
            </div>
            <p className="mt-3 text-sm text-slate-500">{row.address_text || 'No address'}</p>
            <p className="mt-1 text-sm text-slate-500">{row.phone || 'No phone'}</p>
            <p className="mt-3 text-xs text-slate-400">CliQ: {row.cliq_alias || 'Not configured'}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
