export type UserRole =
  | 'platform_admin'
  | 'station_admin'
  | 'station_staff'
  | 'driver'
  | 'customer'

export type Language = 'en' | 'ar'
export type Direction = 'ltr' | 'rtl'

export type OrderStatus =
  | 'new'
  | 'accepted'
  | 'out_for_delivery'
  | 'delivered'
  | 'closed'
  | 'cancelled'

export type PaymentMethod = 'cash' | 'cliq' | 'coupon'
export type PaymentStatus = 'pending' | 'paid'

export interface UserProfile {
  id: string
  fullName: string
  role: UserRole
  phone?: string | null
  email?: string | null
  stationId?: string | null
  createdAt?: string
}

export interface Station {
  id: string
  name: string
  nameAr?: string | null
  slug?: string | null
  logoUrl?: string | null
  brandColor?: string | null
  currency: 'JOD'
  phone?: string | null
  isActive: boolean
}

export interface StationLocation {
  id: string
  stationId: string
  name: string
  phone?: string | null
  addressText?: string | null
  cliqAlias?: string | null
  isActive: boolean
}

export interface ServiceArea {
  id: string
  stationLocationId: string
  name: string
  driverId?: string | null
  isActive: boolean
}

export interface Customer {
  id: string
  stationId: string
  name: string
  phone: string
  isActive: boolean
}

export interface CustomerAddress {
  id: string
  customerId: string
  serviceAreaId?: string | null
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

export interface OrderItem {
  id: string
  orderId: string
  containerTypeId: string
  quantity: number
  unitPrice: number
  lineTotal: number
}

export interface QrCode {
  id: string
  stationLocationId: string
  code: string
  isActive: boolean
}

export type WaterStationTenant = Station
export type WaterProduct = ContainerType
export type WaterOrder = Order
