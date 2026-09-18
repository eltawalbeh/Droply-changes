import { useEffect, useState } from 'react'
import { PageHeader } from '../../components/common/PageHeader'
import { supabase } from '../../lib/supabase'
import { droplyApi } from '../../services/droply-api'

interface StationOption {
  id: string
  name: string
}

interface ProfileRow {
  id: string
  full_name: string
  email: string | null
  role: string
  station_id: string | null
}

export function PlatformUsers() {
  const [stations, setStations] = useState<StationOption[]>([])
  const [profiles, setProfiles] = useState<ProfileRow[]>([])
  const [stationId, setStationId] = useState('')
  const [role, setRole] = useState<'station_admin' | 'station_staff' | 'driver'>('station_admin')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function load() {
    const [stationsResult, profilesResult] = await Promise.all([
      supabase.from('stations').select('id,name').order('name'),
      supabase.from('profiles').select('id,full_name,email,role,station_id').order('created_at', { ascending: false }),
    ])

    if (stationsResult.error || profilesResult.error) {
      setError(stationsResult.error?.message || profilesResult.error?.message || 'Unable to load users')
      return
    }

    setStations((stationsResult.data ?? []) as StationOption[])
    setProfiles((profilesResult.data ?? []) as ProfileRow[])
    if (!stationId && stationsResult.data?.[0]) setStationId(stationsResult.data[0].id)
  }

  useEffect(() => {
    void load()
  }, [])

  async function createUser() {
    setError(null)

    try {
      await droplyApi.createInternalUser({
        stationId,
        role,
        fullName: fullName.trim(),
        email: email.trim(),
        password,
      })
      setFullName('')
      setEmail('')
      setPassword('')
      await load()
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to create user')
    }
  }

  return (
    <section>
      <PageHeader title="Users" description="Provision station admins, station staff and drivers." />

      <div className="grid grid-cols-5 gap-3 rounded-2xl border border-slate-200 bg-white p-4">
        <select value={stationId} onChange={(e) => setStationId(e.target.value)} className="rounded-xl border border-slate-300 px-3 py-2 text-sm">
          {stations.map((station) => <option key={station.id} value={station.id}>{station.name}</option>)}
        </select>
        <select value={role} onChange={(e) => setRole(e.target.value as typeof role)} className="rounded-xl border border-slate-300 px-3 py-2 text-sm">
          <option value="station_admin">Station Admin</option>
          <option value="station_staff">Station Staff</option>
          <option value="driver">Driver</option>
        </select>
        <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full name" className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
        <div className="flex gap-2">
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Temporary password" className="min-w-0 flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm" />
          <button onClick={createUser} disabled={!stationId || !fullName.trim() || !email.trim() || password.length < 8} className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white disabled:opacity-40">
            Create
          </button>
        </div>
      </div>

      {error ? <p className="mt-4 text-sm text-rose-600">{error}</p> : null}

      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Station</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {profiles.map((profile) => (
              <tr key={profile.id}>
                <td className="px-4 py-3 font-medium">{profile.full_name}</td>
                <td className="px-4 py-3 text-slate-500">{profile.email || '—'}</td>
                <td className="px-4 py-3">{profile.role.split('_').join(' ')}</td>
                <td className="px-4 py-3 text-slate-500">{stations.find((station) => station.id === profile.station_id)?.name || 'Platform'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
