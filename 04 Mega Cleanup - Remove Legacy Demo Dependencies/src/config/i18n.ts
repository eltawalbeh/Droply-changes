import type { Language } from '../types'

export const translations: Record<Language, Record<string, string>> = {
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
