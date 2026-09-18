import { Copy, Plus, QrCode } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import { PageHeader } from '../../components/common/PageHeader'

interface LocationRow {
  id: string
  name: string
}

interface QrRow {
  id: string
  code: string
  station_location_id: string
  is_active: boolean
}

export function StationQrCodesPage() {
  const { user } = useAuth()
  const [locations, setLocations] = useState<LocationRow[]>([])
  const [codes, setCodes] = useState<QrRow[]>([])
  const [selectedLocation, setSelectedLocation] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function load() {
    if (!user?.stationId) return

    const [{ data: locationRows, error: locationsError }, { data: qrRows, error: qrError }] =
      await Promise.all([
        supabase.from('station_locations').select('id,name').eq('station_id', user.stationId).order('name'),
        supabase.from('qr_codes').select('id,code,station_location_id,is_active').eq('station_id', user.stationId).order('created_at', { ascending: false }),
      ])

    if (locationsError || qrError) {
      setError(locationsError?.message || qrError?.message || 'Unable to load QR codes')
      return
    }

    setLocations(locationRows ?? [])
    setCodes(qrRows ?? [])
    if (!selectedLocation && locationRows?.[0]) setSelectedLocation(locationRows[0].id)
  }

  useEffect(() => {
    void load()
  }, [user?.stationId])

  async function createCode() {
    if (!user?.stationId || !selectedLocation) return

    const code = crypto.randomUUID().split('-').join('').slice(0, 12).toUpperCase()
    const { error: insertError } = await supabase.from('qr_codes').insert({
      station_id: user.stationId,
      station_location_id: selectedLocation,
      code,
      is_active: true,
    })

    if (insertError) {
      setError(insertError.message)
      return
    }

    await load()
  }

  return (
    <section>
      <PageHeader title="QR Codes" description="Create station/location acquisition links for bottles and printed stickers." />

      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4">
        <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)} className="rounded-xl border border-slate-300 px-3 py-2 text-sm">
          {locations.map((location) => <option key={location.id} value={location.id}>{location.name}</option>)}
        </select>
        <button onClick={createCode} disabled={!selectedLocation} className="flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white disabled:opacity-40">
          <Plus size={16} />
          Generate QR link
        </button>
      </div>

      {error ? <p className="mt-4 text-sm text-rose-600">{error}</p> : null}

      <div className="mt-4 grid gap-3">
        {codes.map((code) => {
          const link = `${window.location.origin}/join/${code.code}`
          const location = locations.find((item) => item.id === code.station_location_id)

          return (
            <div key={code.id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-start gap-3">
                <QrCode className="mt-0.5 text-slate-400" size={20} />
                <div>
                  <p className="font-medium text-slate-800">{location?.name || 'Location'}</p>
                  <p className="mt-1 text-xs text-slate-400">{link}</p>
                </div>
              </div>
              <button onClick={() => navigator.clipboard.writeText(link)} className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm">
                <Copy size={15} />
                Copy
              </button>
            </div>
          )
        })}
      </div>
    </section>
  )
}
