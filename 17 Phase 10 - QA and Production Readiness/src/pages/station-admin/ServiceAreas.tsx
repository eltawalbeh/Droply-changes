import { useEffect, useState } from 'react'
import { PageHeader } from '../../components/common/PageHeader'
import { supabase } from '../../lib/supabase'

interface AreaRow {
  id: string
  name: string
  is_active: boolean
  station_locations?: { name?: string } | null
  drivers?: { full_name?: string } | null
}

export function StationServiceAreasPage() {
  const [rows, setRows] = useState<AreaRow[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    supabase
      .from('service_areas')
      .select('id,name,is_active,station_locations(name),drivers(full_name)')
      .order('name')
      .then(({ data, error: queryError }) => {
        if (queryError) setError(queryError.message)
        else setRows((data ?? []) as AreaRow[])
      })
  }, [])

  return (
    <section>
      <PageHeader title="Service Areas" description="Each area maps station demand to its assigned driver." />
      {error ? <p className="mb-4 text-sm text-rose-600">{error}</p> : null}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Area</th>
              <th className="px-4 py-3 font-medium">Location</th>
              <th className="px-4 py-3 font-medium">Driver</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr key={row.id}>
                <td className="px-4 py-3 font-medium">{row.name}</td>
                <td className="px-4 py-3 text-slate-500">{row.station_locations?.name || '—'}</td>
                <td className="px-4 py-3 text-slate-500">{row.drivers?.full_name || 'Unassigned'}</td>
                <td className="px-4 py-3">{row.is_active ? 'Active' : 'Inactive'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
