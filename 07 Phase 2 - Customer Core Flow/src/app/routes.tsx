import { createBrowserRouter, Navigate } from 'react-router'
import { CustomerLayout } from '../components/layouts/CustomerLayout'
import { DashboardLayout } from '../components/layouts/DashboardLayout'
import { QRLanding } from '../pages/customer/QRLanding'
import { CustomerRegister } from '../pages/customer/Register'
import { CustomerContainers } from '../pages/customer/Containers'
import { CustomerHome } from '../pages/customer/Home'
import { CustomerOrders } from '../pages/customer/Orders'
import { CustomerProfile } from '../pages/customer/Profile'
import { StationAdminPage } from '../pages/station-admin/Page'

const adminPage = (title: string, description: string) => <StationAdminPage title={title} description={description} />

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/customer" replace /> },
  { path: '/join/:code', element: <QRLanding /> },
  { path: '/customer/register', element: <CustomerRegister /> },
  { path: '/customer/containers', element: <CustomerContainers /> },
  {
    path: '/customer',
    element: <CustomerLayout />,
    children: [
      { index: true, element: <CustomerHome /> },
      { path: 'orders', element: <CustomerOrders /> },
      { path: 'profile', element: <CustomerProfile /> },
    ],
  },
  {
    path: '/station-admin',
    element: <DashboardLayout />,
    children: [
      { index: true, element: adminPage('Dashboard', 'Operational overview for the selected water station.') },
      { path: 'orders', element: adminPage('Orders', 'Incoming, active and completed customer orders.') },
      { path: 'customers', element: adminPage('Customers', 'Customers registered through this station and its QR codes.') },
      { path: 'drivers', element: adminPage('Drivers', 'Drivers and their assigned service areas.') },
      { path: 'service-areas', element: adminPage('Service Areas', 'Areas used to route each order to the correct driver.') },
      { path: 'locations', element: adminPage('Locations', 'Station branches and operating settings.') },
      { path: 'qr-codes', element: adminPage('QR Codes', 'Location-linked QR codes for customer registration.') },
      { path: 'payments', element: adminPage('Payments', 'Cash, CliQ, coupon and pending payment records.') },
      { path: 'reports', element: adminPage('Reports', 'Operational reporting based only on live data.') },
      { path: 'settings', element: adminPage('Settings', 'Branding, container types, prices, users and permissions.') },
    ],
  },
  { path: '*', element: <Navigate to="/customer" replace /> },
])
