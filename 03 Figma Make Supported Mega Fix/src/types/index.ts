export type UserRole =
  | 'platform_admin'
  | 'station_admin'
  | 'station_staff'
  | 'driver'
  | 'customer'

export type OrderStatus =
  | 'new'
  | 'accepted'
  | 'out_for_delivery'
  | 'delivered'
  | 'closed'
  | 'cancelled'

export type PaymentMethod = 'cash' | 'cliq' | 'coupon'
export type PaymentStatus = 'pending' | 'paid'

export interface Station {
  id: string
  name: string
  logoUrl?: string | null
  brandColor?: string | null
  currency: 'JOD'
  isActive: boolean
}

export interface StationLocation {
  id: string
  stationId: string
  name: string
  phone?: string | null
  address?: string | null
  cliqAlias?: string | null
  isActive: boolean
}

export interface ServiceArea {
  id: string
  stationLocationId: string
  name: string
  driverId?: string | null
}

export interface Customer {
  id: string
  stationId: string
  phone: string
  name: string
  isActive: boolean
}

export interface CustomerAddress {
  id: string
  customerId: string
  label: string
  addressText: string
  latitude?: number | null
  longitude?: number | null
  notes?: string | null
  isDefault: boolean
}

export interface ContainerType {
  id: string
  stationId: string
  name: string
  sizeLiters?: number | null
  price: number
  isActive: boolean
}

export interface CustomerContainer {
  id: string
  customerId: string
  containerTypeId: string
  quantity: number
}

export interface Order {
  id: string
  stationId: string
  stationLocationId: string
  customerId: string
  customerAddressId: string
  driverId?: string | null
  status: OrderStatus
  totalAmount: number
  paymentMethod?: PaymentMethod | null
  paymentStatus: PaymentStatus
  createdAt: string
}
