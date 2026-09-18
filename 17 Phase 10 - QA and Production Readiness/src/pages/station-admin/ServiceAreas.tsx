import { useEffect, useState } from 'react'
import { PageHeader } from '../../components/common/PageHeader'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'

interface AreaRow {
  id: string
  name: string
  is_active: boolean
  station_locations?: { name?: string } | null
  drivers?: { full_name?: string } | null
}

interface OptionRow {
  id: string
  name?: string
  full_name?: string
}

export function StationServiceAreasPage() {
  const { user } = useAuth()
  const [rows, setRows] = useState<AreaRow[]>([])
  const [locations, setLocations] = useState<OptionRow[]>([])
  const [drivers, setDrivers] = useState<OptionRow[]>([])
  const [name, setName] = useState('')
  const [locationId, setLocationId] = useState('')
  const [driverId, setDriverId] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function load() {
    if (!user?.stationId) return

    const [areasResult, locationsResult, driversResult] = await Promise.all([
      supabase
        .from('service_areas')
        .select('id,name,is_active,station_locations(name),drivers(full_name)')
        .eq('station_id', user.stationId)
        .order('name'),
      supabase
        .from('station_locations')
        .select('id,name')
        .eq('station_id', user.stationId)
        .eq('is_active', true)
        .order('name'),
      supabase
        .from('drivers')
        .select('id,full_name')
        .eq('station_id', user.stationId)
        .eq('is_active', true)
        .order('full_name'),
    ])

    const firstError = areasResult.error || locationsResult.error || driversResult.error
    if (firstError) {
      setError(firstError.message)
      return
    }

    setRows((areasResult.data ?? []) as AreaRow[])
    setLocations((locationsResult.data ?? []) as OptionRow[])
    setDrivers((driversResult.data ?? []) as OptionRow[])

    if (!locationId && locationsResult.data?.[0]) {
      setLocationId(locationsResult.data[0].id)
    }
  }

  useEffect(() => {
    void load()
  }, [user?.stationId])

  async function createArea() {
    if (!user?.stationId || !locationId || !name.trim()) return
    setError(null)

    const { error: insertError } = await supabase.from('service_areas').insert({
      station_id: user.stationId,
      station_location_id: locationId,
      name: name.trim(),
      driver_id: driverId || null,
      is_active: true,
    })

    if (insertError) {
      setError(insertError.message)
      return
    }

    setName('')
    setDriverId('')
    await load()
  }

  return (
    <section>
      <PageHeader title="Service Areas" description="Each delivery area maps orders to its assigned driver." />

      <div className="grid grid-cols-[1.5fr_1fr_1fr_auto] gap-2 rounded-2xl border border-slate-200 bg-white p-4">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Area name" className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
        <select value={locationId} onChange={(e) => setLocationId(e.target.value)} className="rounded-xl border border-slate-300 px-3 py-2 text-sm">
          <option value="">Select location</option>
          {locations.map((location) => (
            <option key={location.id} value={location.id}>{location.name}</option>
          ))}
        </select>
        <select value={driverId} onChange={(e) => setDriverId(e.target.value)} className="rounded-xl border border-slate-300 px-3 py-2 text-sm">
          <option value="">Unassigned</option>
          {drivers.map((driver) => (
            <option key={driver.id} value={driver.id}>{driver.full_name}</option>
          ))}
        </select>
        <button onClick={createArea} disabled={!name.trim() || !locationId} className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white disabled:opacity-40">
          Add
        </button>
      </div>

      {error ? <p className="mt-4 text-sm text-rose-600">{error}</p> : null}

      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white">
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
