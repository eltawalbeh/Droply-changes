import { createBrowserRouter, Navigate } from 'react-router'
import { RequireCustomerSession } from '../components/auth/RequireCustomerSession'
import { RequireRole } from '../components/auth/RequireRole'
import { CustomerLayout } from '../components/layouts/CustomerLayout'
import { DashboardLayout } from '../components/layouts/DashboardLayout'
import { DriverLayout } from '../components/layouts/DriverLayout'
import { LoginPage } from '../pages/auth/LoginPage'
import { UnauthorizedPage } from '../pages/auth/UnauthorizedPage'
import { QRLanding } from '../pages/customer/QRLanding'
import { CustomerRegister } from '../pages/customer/Register'
import { CustomerContainers } from '../pages/customer/Containers'
import { CustomerHome } from '../pages/customer/Home'
import { CustomerOrders } from '../pages/customer/Orders'
import { CustomerProfile } from '../pages/customer/Profile'
import { CustomerLogin } from '../pages/customer/Login'
import { CustomerRecovery } from '../pages/customer/Recovery'
import { DriverToday } from '../pages/driver/Today'
import { DriverActive } from '../pages/driver/Active'
import { DriverCompleted } from '../pages/driver/Completed'
import { DriverOrderDetails } from '../pages/driver/OrderDetails'
import { CompleteDelivery } from '../pages/driver/CompleteDelivery'
import { DriverProfile } from '../pages/driver/Profile'
import { StationDashboard } from '../pages/station-admin/Dashboard'
import { ResourcePage } from '../pages/station-admin/ResourcePage'
import { StationSettingsPage } from '../pages/station-admin/Settings'
import { StationQrCodesPage } from '../pages/station-admin/QrCodes'
import { StationPaymentsPage } from '../pages/station-admin/Payments'

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/customer" replace /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/unauthorized', element: <UnauthorizedPage /> },

  { path: '/join/:code', element: <QRLanding /> },
  { path: '/customer/login', element: <CustomerLogin /> },
  { path: '/customer/recovery', element: <CustomerRecovery /> },
  { path: '/customer/register', element: <CustomerRegister /> },
  { path: '/customer/containers', element: <CustomerContainers /> },
  {
    path: '/customer',
    element: (
      <RequireCustomerSession>
        <CustomerLayout />
      </RequireCustomerSession>
    ),
    children: [
      { index: true, element: <CustomerHome /> },
      { path: 'orders', element: <CustomerOrders /> },
      { path: 'profile', element: <CustomerProfile /> },
    ],
  },

  {
    path: '/driver',
    element: (
      <RequireRole roles={['driver']}>
        <DriverLayout />
      </RequireRole>
    ),
    children: [
      { index: true, element: <DriverToday /> },
      { path: 'active', element: <DriverActive /> },
      { path: 'completed', element: <DriverCompleted /> },
      { path: 'profile', element: <DriverProfile /> },
      { path: 'orders/:orderId', element: <DriverOrderDetails /> },
      { path: 'orders/:orderId/complete', element: <CompleteDelivery /> },
    ],
  },

  {
    path: '/station-admin',
    element: (
      <RequireRole roles={['station_admin', 'station_staff']}>
        <DashboardLayout />
      </RequireRole>
    ),
    children: [
      { index: true, element: <StationDashboard /> },
      {
        path: 'orders',
        element: <ResourcePage title="Orders" description="Manage incoming and active deliveries." searchPlaceholder="Search order or customer" filters={['Status', 'Driver', 'Area', 'Payment']} emptyTitle="No orders yet" emptyDescription="Live customer orders will appear here." />,
      },
      {
        path: 'customers',
        element: <ResourcePage title="Customers" description="Customers registered through this station and its QR codes." searchPlaceholder="Search name or mobile" filters={['Area', 'Status']} emptyTitle="No customers yet" emptyDescription="Registered customers will appear here." />,
      },
      {
        path: 'drivers',
        element: <ResourcePage title="Drivers" description="Drivers and their assigned service areas." searchPlaceholder="Search driver" filters={['Status', 'Area']} emptyTitle="No drivers yet" emptyDescription="Station drivers will appear here after live data is connected." />,
      },
      {
        path: 'service-areas',
        element: <ResourcePage title="Service Areas" description="Geographic areas used to route orders to the correct driver." searchPlaceholder="Search area" filters={['Location', 'Driver']} emptyTitle="No service areas yet" emptyDescription="Configured delivery areas will appear here." />,
      },
      {
        path: 'locations',
        element: <ResourcePage title="Locations" description="Station branches, contact information and operating configuration." searchPlaceholder="Search location" filters={['Status']} emptyTitle="No locations yet" emptyDescription="Station locations will appear here." />,
      },
      { path: 'qr-codes', element: <StationQrCodesPage /> },
      { path: 'payments', element: <StationPaymentsPage /> },
      {
        path: 'reports',
        element: <ResourcePage title="Reports" description="Operational reporting based only on live station data." searchPlaceholder="Search report" filters={['Date Range', 'Driver', 'Area']} emptyTitle="No report data yet" emptyDescription="Reports will populate when operational data exists." />,
      },
      { path: 'settings', element: <StationSettingsPage /> },
    ],
  },

  { path: '*', element: <Navigate to="/customer" replace /> },
])
