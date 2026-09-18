import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useCustomerSession } from '../../context/CustomerSessionContext'
import { useApiData } from '../../hooks/useApiData'
import { droplyApi } from '../../services/droply-api'

export function CustomerProfile() {
  const navigate = useNavigate()
  const { session, clearSession } = useCustomerSession()
  const [error, setError] = useState<string | null>(null)

  const { data, isLoading } = useApiData(
    () => {
      if (!session?.token) return Promise.reject(new Error('Customer session required'))
      return droplyApi.customerMe(session.token)
    },
    [session?.token],
  )

  async function logout() {
    if (!session?.token) return
    setError(null)

    try {
      await droplyApi.customerLogout(session.token)
    } catch {
      // Local logout still proceeds if the network is unavailable.
    }

    clearSession()
    navigate('/customer/login', { replace: true })
  }

  if (isLoading) return <p className="text-sm text-slate-500">Loading profile…</p>

  const customer = data?.customer as Record<string, unknown> | undefined
  const station = data?.station as Record<string, unknown> | null | undefined

  return (
    <section>
      <h1 className="text-2xl font-semibold text-slate-950">Profile</h1>

      <div className="mt-6 rounded-2xl border border-slate-200">
        <div className="px-4 py-4">
          <p className="font-medium text-slate-800">{String(customer?.full_name || 'Customer')}</p>
          <p className="mt-1 text-sm text-slate-500">{String(customer?.phone || '')}</p>
        </div>
        <div className="border-t border-slate-200 px-4 py-4">
          <p className="text-sm font-medium text-slate-700">Station</p>
          <p className="mt-1 text-sm text-slate-500">{String(station?.name || '')}</p>
        </div>
        <div className="border-t border-slate-200 px-4 py-4">
          <p className="text-sm font-medium text-slate-700">My Containers</p>
          <p className="mt-1 text-sm text-slate-500">{data?.containers.length || 0} saved types</p>
        </div>
      </div>

      {error ? <p className="mt-4 text-sm text-rose-600">{error}</p> : null}

      <button onClick={logout} className="mt-6 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700">
        Sign out
      </button>
    </section>
  )
}
