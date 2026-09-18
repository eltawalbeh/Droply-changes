import { useEffect, useState } from 'react'
import { PageHeader } from '../../components/common/PageHeader'
import { supabase } from '../../lib/supabase'
import { droplyApi } from '../../services/droply-api'

interface StationRow {
  id: string
  name: string
  name_ar: string | null
  phone: string | null
  subscription_status: string
  is_active: boolean
}

export function PlatformStations() {
  const [rows, setRows] = useState<StationRow[]>([])
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function load() {
    const { data, error: queryError } = await supabase
      .from('stations')
      .select('id,name,name_ar,phone,subscription_status,is_active')
      .order('created_at', { ascending: false })

    if (queryError) {
      setError(queryError.message)
      return
    }

    setRows((data ?? []) as StationRow[])
  }

  useEffect(() => {
    void load()
  }, [])

  async function createStation() {
    if (!name.trim()) return
    setIsSubmitting(true)
    setError(null)

    try {
      await droplyApi.createStation({
        name: name.trim(),
        phone: phone.trim() || undefined,
      })
      setName('')
      setPhone('')
      await load()
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to create station')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function toggleStation(station: StationRow) {
    setError(null)

    try {
      await droplyApi.updateStation(station.id, {
        isActive: !station.is_active,
        subscriptionStatus: station.is_active ? 'suspended' : 'active',
      })
      await load()
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to update station')
    }
  }

  return (
    <section>
      <PageHeader title="Stations" description="Create, activate or suspend Droply station tenants." />

      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="grid grid-cols-[1fr_1fr_auto] gap-3">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Station name" className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
          <button onClick={createStation} disabled={isSubmitting || !name.trim()} className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white disabled:opacity-40">
            Create station
          </button>
        </div>
      </div>

      {error ? <p className="mt-4 text-sm text-rose-600">{error}</p> : null}

      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Station</th>
              <th className="px-4 py-3 font-medium">Phone</th>
              <th className="px-4 py-3 font-medium">Subscription</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((station) => (
              <tr key={station.id}>
                <td className="px-4 py-3 font-medium">{station.name}</td>
                <td className="px-4 py-3 text-slate-500">{station.phone || '—'}</td>
                <td className="px-4 py-3 capitalize">{station.subscription_status.split('_').join(' ')}</td>
                <td className="px-4 py-3">{station.is_active ? 'Active' : 'Suspended'}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => toggleStation(station)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium">
                    {station.is_active ? 'Suspend' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!rows.length ? <p className="p-8 text-center text-sm text-slate-400">No stations yet.</p> : null}
      </div>
    </section>
  )
}
