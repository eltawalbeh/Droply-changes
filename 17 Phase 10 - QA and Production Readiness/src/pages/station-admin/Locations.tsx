import { useEffect, useState } from 'react'
import { PageHeader } from '../../components/common/PageHeader'
import { useAuth } from '../../context/AuthContext'
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
  const { user } = useAuth()
  const [rows, setRows] = useState<LocationRow[]>([])
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [cliqAlias, setCliqAlias] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function load() {
    if (!user?.stationId) return

    const { data, error: queryError } = await supabase
      .from('station_locations')
      .select('id,name,phone,address_text,cliq_alias,is_active')
      .eq('station_id', user.stationId)
      .order('name')

    if (queryError) setError(queryError.message)
    else setRows((data ?? []) as LocationRow[])
  }

  useEffect(() => {
    void load()
  }, [user?.stationId])

  async function createLocation() {
    if (!user?.stationId || !name.trim()) return
    setError(null)

    const { error: insertError } = await supabase.from('station_locations').insert({
      station_id: user.stationId,
      name: name.trim(),
      phone: phone.trim() || null,
      address_text: address.trim() || null,
      cliq_alias: cliqAlias.trim() || null,
      is_active: true,
    })

    if (insertError) {
      setError(insertError.message)
      return
    }

    setName('')
    setPhone('')
    setAddress('')
    setCliqAlias('')
    await load()
  }

  return (
    <section>
      <PageHeader title="Locations" description="Station branches, contact details and CliQ configuration." />

      <div className="grid grid-cols-[1fr_1fr_1.5fr_1fr_auto] gap-2 rounded-2xl border border-slate-200 bg-white p-4">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Location name" className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
        <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
        <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Address" className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
        <input value={cliqAlias} onChange={(e) => setCliqAlias(e.target.value)} placeholder="CliQ alias" className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
        <button onClick={createLocation} disabled={!name.trim()} className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white disabled:opacity-40">
          Add
        </button>
      </div>

      {error ? <p className="mt-4 text-sm text-rose-600">{error}</p> : null}

      <div className="mt-4 grid grid-cols-2 gap-4">
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
