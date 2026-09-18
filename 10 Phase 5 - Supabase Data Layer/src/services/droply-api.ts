import { projectId, publicAnonKey } from '../../utils/supabase/info'
import { supabase } from '../lib/supabase'
import type {
  DriverOrderView,
  PublicQrBootstrap,
  StationDashboardMetrics,
} from '../types/api'

const baseUrl = `https://${projectId}.supabase.co/functions/v1/server/make-server-821e46f4`

async function request<T>(
  path: string,
  options: RequestInit = {},
  authenticated = false,
): Promise<T> {
  const headers = new Headers(options.headers)
  headers.set('Content-Type', 'application/json')
  headers.set('apikey', publicAnonKey)

  if (authenticated) {
    const { data } = await supabase.auth.getSession()
    const token = data.session?.access_token

    if (!token) {
      throw new Error('Authentication required')
    }

    headers.set('Authorization', `Bearer ${token}`)
  } else {
    headers.set('Authorization', `Bearer ${publicAnonKey}`)
  }

  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers,
  })

  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(payload?.error || 'Request failed')
  }

  return payload as T
}

export const droplyApi = {
  health: () => request<{ status: string }>('/health'),

  resolveQr: (code: string) =>
    request<PublicQrBootstrap>(`/public/qr/${encodeURIComponent(code)}`),

  driverOrders: (scope: 'today' | 'active' | 'completed' = 'today') =>
    request<{ orders: DriverOrderView[] }>(
      `/driver/orders?scope=${encodeURIComponent(scope)}`,
      {},
      true,
    ),

  driverOrder: (orderId: string) =>
    request<{ order: DriverOrderView }>(
      `/driver/orders/${encodeURIComponent(orderId)}`,
      {},
      true,
    ),

  stationDashboard: () =>
    request<{ metrics: StationDashboardMetrics }>(
      '/station/dashboard',
      {},
      true,
    ),
}
