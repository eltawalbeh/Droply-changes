import type {
  CustomerAddress,
  Order,
  OrderItem,
  Station,
  StationLocation,
} from './index'

export interface PublicQrBootstrap {
  qrCode: {
    id?: string
    code: string
    stationId: string
    stationLocationId: string
  }
  scanId?: string | null
  station: Station
  location: StationLocation
  containerTypes: Array<{
    id: string
    stationId: string
    name: string
    sizeLiters?: number | null
    price: number
    isActive: boolean
  }>
  serviceAreas: Array<{
    id: string
    name: string
    driverId?: string | null
  }>
}

export interface DriverOrderView extends Order {
  customer?: {
    id: string
    name: string
    phone: string
  }
  address?: CustomerAddress
  items?: OrderItem[]
}

export interface CustomerSessionResponse {
  sessionToken: string
  sessionExpiresAt: string
  customerId: string
}

export interface CustomerMeResponse {
  customer: Record<string, unknown>
  addresses: Array<Record<string, unknown>>
  containers: Array<Record<string, unknown>>
  containerTypes: Array<Record<string, unknown>>
  station: Record<string, unknown> | null
  location: Record<string, unknown> | null
}

export interface StationDashboardMetrics {
  ordersToday: number
  newOrders: number
  outForDelivery: number
  delivered: number
  cashCollected: number
  cliqCollected: number
  pendingPayments: number
  activeCustomers: number
}
