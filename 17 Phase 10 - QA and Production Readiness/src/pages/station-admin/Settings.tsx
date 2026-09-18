import { useEffect, useState } from 'react'
import { PageHeader } from '../../components/common/PageHeader'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import { droplyApi } from '../../services/droply-api'

interface ContainerRow {
  id: string
  name: string
  size_liters: number | null
  price: number
  is_active: boolean
}

export function StationSettingsPage() {
  const { user } = useAuth()
  const [stationName, setStationName] = useState('')
  const [phone, setPhone] = useState('')
  const [containers, setContainers] = useState<ContainerRow[]>([])
  const [containerName, setContainerName] = useState('')
  const [price, setPrice] = useState('')
  const [staffName, setStaffName] = useState('')
  const [staffEmail, setStaffEmail] = useState('')
  const [staffPassword, setStaffPassword] = useState('')
  const [staffRole, setStaffRole] = useState<'station_staff' | 'driver'>('station_staff')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    if (!user?.stationId) return
    const [stationResult, containersResult] = await Promise.all([
      supabase.from('stations').select('name,phone').eq('id', user.stationId).single(),
      supabase.from('container_types').select('id,name,size_liters,price,is_active').eq('station_id', user.stationId).order('name'),
    ])

    if (stationResult.error || containersResult.error) {
      setError(stationResult.error?.message || containersResult.error?.message || 'Unable to load settings')
      return
    }

    setStationName(stationResult.data.name)
    setPhone(stationResult.data.phone || '')
    setContainers((containersResult.data ?? []) as ContainerRow[])
  }

  useEffect(() => {
    void load()
  }, [user?.stationId])

  async function saveBranding() {
    if (!user?.stationId) return
    const { error: updateError } = await supabase
      .from('stations')
      .update({ name: stationName.trim(), phone: phone.trim() || null })
      .eq('id', user.stationId)

    if (updateError) setError(updateError.message)
    else setMessage('Station settings saved.')
  }

  async function addContainer() {
    if (!user?.stationId || !containerName.trim() || !price) return
    const { error: insertError } = await supabase.from('container_types').insert({
      station_id: user.stationId,
      name: containerName.trim(),
      price: Number(price),
      is_active: true,
    })

    if (insertError) setError(insertError.message)
    else {
      setContainerName('')
      setPrice('')
      setMessage('Container type added.')
      await load()
    }
  }

  async function createUser() {
    if (!user?.stationId) return
    setError(null)

    try {
      await droplyApi.createInternalUser({
        stationId: user.stationId,
        role: staffRole,
        fullName: staffName.trim(),
        email: staffEmail.trim(),
        password: staffPassword,
      })
      setStaffName('')
      setStaffEmail('')
      setStaffPassword('')
      setMessage(staffRole === 'driver' ? 'Driver account created.' : 'Staff account created.')
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to create user')
    }
  }

  return (
    <section>
      <PageHeader title="Settings" description="Station branding, products and internal access." />
      {message ? <p className="mb-4 text-sm text-emerald-700">{message}</p> : null}
      {error ? <p className="mb-4 text-sm text-rose-600">{error}</p> : null}

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="font-semibold text-slate-900">Station</h2>
          <input value={stationName} onChange={(e) => setStationName(e.target.value)} placeholder="Station name" className="mt-4 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" />
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" className="mt-3 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" />
          <button onClick={saveBranding} className="mt-4 rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white">Save</button>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="font-semibold text-slate-900">Container Types & Prices</h2>
          <div className="mt-4 grid grid-cols-[1fr_140px_auto] gap-2">
            <input value={containerName} onChange={(e) => setContainerName(e.target.value)} placeholder="Container name" className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
            <input inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="JOD price" className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
            <button onClick={addContainer} className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white">Add</button>
          </div>
          <div className="mt-4 divide-y divide-slate-100">
            {containers.map((container) => (
              <div key={container.id} className="flex items-center justify-between py-3 text-sm">
                <span>{container.name}</span>
                <span className="text-slate-500">{Number(container.price).toFixed(3)} JOD</span>
              </div>
            ))}
          </div>
        </div>

        {user?.role === 'station_admin' ? (
          <div className="col-span-2 rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="font-semibold text-slate-900">Users & Permissions</h2>
            <div className="mt-4 grid grid-cols-5 gap-2">
              <select value={staffRole} onChange={(e) => setStaffRole(e.target.value as typeof staffRole)} className="rounded-xl border border-slate-300 px-3 py-2 text-sm">
                <option value="station_staff">Station Staff</option>
                <option value="driver">Driver</option>
              </select>
              <input value={staffName} onChange={(e) => setStaffName(e.target.value)} placeholder="Full name" className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
              <input value={staffEmail} onChange={(e) => setStaffEmail(e.target.value)} placeholder="Email" className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
              <input type="password" value={staffPassword} onChange={(e) => setStaffPassword(e.target.value)} placeholder="Temporary password" className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
              <button onClick={createUser} disabled={!staffName.trim() || !staffEmail.trim() || staffPassword.length < 8} className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white disabled:opacity-40">Create</button>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}
