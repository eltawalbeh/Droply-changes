import type { Language } from '../types'

export interface AppTranslation {
  appName: string
  appTagline: string
  dashboard: string
  orders: string
  customers: string
  drivers: string
  serviceAreas: string
  locations: string
  qrCodes: string
  payments: string
  reports: string
  settings: string
  stationStaff: string
}

export const translations: Record<Language, AppTranslation> = {
  en: {
    appName: 'Droply',
    appTagline: 'Water ordering made simple',
    dashboard: 'Dashboard',
    orders: 'Orders',
    customers: 'Customers',
    drivers: 'Drivers',
    serviceAreas: 'Service Areas',
    locations: 'Locations',
    qrCodes: 'QR Codes',
    payments: 'Payments',
    reports: 'Reports',
    settings: 'Settings',
    stationStaff: 'Station Staff',
  },
  ar: {
    appName: 'Droply',
    appTagline: 'طلب المياه ببساطة',
    dashboard: 'لوحة التحكم',
    orders: 'الطلبات',
    customers: 'العملاء',
    drivers: 'السائقون',
    serviceAreas: 'مناطق الخدمة',
    locations: 'الفروع',
    qrCodes: 'رموز QR',
    payments: 'المدفوعات',
    reports: 'التقارير',
    settings: 'الإعدادات',
    stationStaff: 'موظف المحطة',
  },
}
