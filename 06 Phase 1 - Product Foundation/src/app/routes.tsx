import { createBrowserRouter, Navigate } from 'react-router'
import { DashboardLayout } from '../components/layouts/DashboardLayout'
import { StationAdminPage } from '../pages/station-admin/Page'

const pages = {
  dashboard: ['Dashboard', 'Operational overview for the selected water station.'],
  orders: ['Orders', 'Incoming, active and completed customer orders.'],
  customers: ['Customers', 'Customers registered through this station and its QR codes.'],
  drivers: ['Drivers', 'Drivers and their assigned service areas.'],
  serviceAreas: ['Service Areas', 'Areas used to route each order to the correct driver.'],
  locations: ['Locations', 'Station branches, contact information, CliQ details and operating settings.'],
  qrCodes: ['QR Codes', 'Location-linked QR codes for customer registration and repeat ordering.'],
  payments: ['Payments', 'Cash, CliQ, optional coupon and pending payment records.'],
  reports: ['Reports', 'Operational reporting based only on live data.'],
  settings: ['Settings', 'Branding, container types, prices, users and permissions.'],
} as const

const page = (key: keyof typeof pages) => {
  const [title, description] = pages[key]
  return <StationAdminPage title={title} description={description} />
}

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/station-admin" replace /> },
  {
    path: '/station-admin',
    element: <DashboardLayout />,
    children: [
      { index: true, element: page('dashboard') },
      { path: 'orders', element: page('orders') },
      { path: 'customers', element: page('customers') },
      { path: 'drivers', element: page('drivers') },
      { path: 'service-areas', element: page('serviceAreas') },
      { path: 'locations', element: page('locations') },
      { path: 'qr-codes', element: page('qrCodes') },
      { path: 'payments', element: page('payments') },
      { path: 'reports', element: page('reports') },
      { path: 'settings', element: page('settings') },
    ],
  },
  { path: '*', element: <Navigate to="/station-admin" replace /> },
])
