import type {
  ContainerType,
  Customer,
  CustomerAddress,
  Order,
  OrderItem,
  Station,
  StationLocation,
} from './index'

export interface PublicQrBootstrap {
  qrCode: {
    code: string
    stationId: string
    stationLocationId: string
  }
  station: Station
  location: StationLocation
  containerTypes: ContainerType[]
}

export interface DriverOrderView extends Order {
  customer?: Pick<Customer, 'id' | 'name' | 'phone'>
  address?: CustomerAddress
  items?: OrderItem[]
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

export interface ApiErrorShape {
  error: string
}
