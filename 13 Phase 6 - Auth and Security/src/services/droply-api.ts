import { supabase, supabasePublishableKey, supabaseUrl } from '../lib/supabase'
import type {
  CustomerMeResponse,
  CustomerSessionResponse,
  DriverOrderView,
  PublicQrBootstrap,
  StationDashboardMetrics,
} from '../types/api'

const baseUrl = `${supabaseUrl}/functions/v1/droply-api`

async function request<T>(
  path: string,
  options: RequestInit = {},
  mode: 'public' | 'internal' | 'customer' = 'public',
  customerToken?: string,
): Promise<T> {
  const headers = new Headers(options.headers)
  headers.set('Content-Type', 'application/json')
  headers.set('apikey', supabasePublishableKey)

  if (mode === 'internal') {
    const { data } = await supabase.auth.getSession()
    const token = data.session?.access_token
    if (!token) throw new Error('Authentication required')
    headers.set('Authorization', `Bearer ${token}`)
  }

  if (mode === 'customer') {
    if (!customerToken) throw new Error('Customer session required')
    headers.set('x-droply-customer-session', customerToken)
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
  health: () => request<{ status: string; service: string }>('/health'),

  resolveQr: (code: string) =>
    request<PublicQrBootstrap>(`/public/qr/${encodeURIComponent(code)}`),

  registerCustomer: (input: {
    qrCode: string
    scanId?: string | null
    phone: string
    fullName: string
    addressText: string
    pin: string
    latitude?: number | null
    longitude?: number | null
    notes?: string | null
    serviceAreaId?: string | null
    containers?: Array<{ containerTypeId: string; quantity: number }>
  }) =>
    request<CustomerSessionResponse & { status: string }>(
      '/customer/register',
      { method: 'POST', body: JSON.stringify(input) },
    ),

  customerLogin: (input: {
    phone: string
    pin: string
    qrCode?: string
    stationId?: string
  }) =>
    request<CustomerSessionResponse>(
      '/customer/login',
      { method: 'POST', body: JSON.stringify(input) },
    ),

  customerLogout: (token: string) =>
    request<{ success: boolean }>(
      '/customer/logout',
      { method: 'POST' },
      'customer',
      token,
    ),

  customerMe: (token: string) =>
    request<CustomerMeResponse>('/customer/me', {}, 'customer', token),

  customerOrders: (token: string) =>
    request<{ orders: DriverOrderView[] }>(
      '/customer/orders',
      {},
      'customer',
      token,
    ),

  createCustomerOrder: (
    token: string,
    input: {
      items: Array<{ containerTypeId: string; quantity: number }>
      paymentMethod: 'cash' | 'cliq' | 'coupon'
      idempotencyKey: string
    },
  ) =>
    request<{ order: DriverOrderView; duplicate?: boolean }>(
      '/customer/orders',
      { method: 'POST', body: JSON.stringify(input) },
      'customer',
      token,
    ),

  completeRecovery: (input: {
    stationId: string
    phone: string
    code: string
    newPin: string
  }) =>
    request<{ success: boolean }>(
      '/customer/recovery/complete',
      { method: 'POST', body: JSON.stringify(input) },
    ),

  driverOrders: (scope: 'today' | 'active' | 'completed' = 'today') =>
    request<{ orders: DriverOrderView[] }>(
      `/driver/orders?scope=${encodeURIComponent(scope)}`,
      {},
      'internal',
    ),

  driverOrder: (orderId: string) =>
    request<{ order: DriverOrderView }>(
      `/driver/orders/${encodeURIComponent(orderId)}`,
      {},
      'internal',
    ),

  updateDriverOrderStatus: (
    orderId: string,
    status: 'accepted' | 'out_for_delivery',
  ) =>
    request<{ order: DriverOrderView }>(
      `/driver/orders/${encodeURIComponent(orderId)}/status`,
      { method: 'PATCH', body: JSON.stringify({ status }) },
      'internal',
    ),

  completeDriverOrder: (
    orderId: string,
    input: {
      paymentMethod: 'cash' | 'cliq' | 'coupon'
      paymentStatus: 'pending' | 'paid'
      reference?: string
    },
  ) =>
    request<{ order: DriverOrderView }>(
      `/driver/orders/${encodeURIComponent(orderId)}/complete`,
      { method: 'POST', body: JSON.stringify(input) },
      'internal',
    ),

  stationDashboard: (stationId?: string) =>
    request<{ metrics: StationDashboardMetrics }>(
      `/station/dashboard${stationId ? `?stationId=${encodeURIComponent(stationId)}` : ''}`,
      {},
      'internal',
    ),

  resetCustomerPin: (customerId: string) =>
    request<{ recoveryCode: string; expiresAt: string }>(
      `/staff/customers/${encodeURIComponent(customerId)}/reset-pin`,
      { method: 'POST' },
      'internal',
    ),

  createStation: (input: {
    name: string
    nameAr?: string
    slug?: string
    phone?: string
    subscriptionStatus?: string
  }) =>
    request<{ station: Record<string, unknown> }>(
      '/platform/stations',
      { method: 'POST', body: JSON.stringify(input) },
      'internal',
    ),

  updateStation: (
    stationId: string,
    input: {
      name?: string
      nameAr?: string
      phone?: string
      isActive?: boolean
      subscriptionStatus?: string
    },
  ) =>
    request<{ station: Record<string, unknown> }>(
      `/platform/stations/${encodeURIComponent(stationId)}`,
      { method: 'PATCH', body: JSON.stringify(input) },
      'internal',
    ),

  createInternalUser: (input: {
    stationId: string
    role: 'station_admin' | 'station_staff' | 'driver'
    fullName: string
    email: string
    password: string
    phone?: string
  }) =>
    request<{ userId: string; driverId?: string | null }>(
      '/internal/users',
      { method: 'POST', body: JSON.stringify(input) },
      'internal',
    ),
}
