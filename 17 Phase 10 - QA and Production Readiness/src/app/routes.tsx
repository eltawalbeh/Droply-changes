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
import { PlatformAdminLayout } from '../components/layouts/PlatformAdminLayout'
import { PlatformOverview } from '../pages/platform-admin/Overview'
import { PlatformStations } from '../pages/platform-admin/Stations'
import { PlatformUsers } from '../pages/platform-admin/Users'
import { StationOrdersPage } from '../pages/station-admin/Orders'
import { StationCustomersPage } from '../pages/station-admin/Customers'
import { StationDriversPage } from '../pages/station-admin/Drivers'
import { StationServiceAreasPage } from '../pages/station-admin/ServiceAreas'
import { StationLocationsPage } from '../pages/station-admin/Locations'
import { StationReportsPage } from '../pages/station-admin/Reports'

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
    path: '/platform-admin',
    element: (
      <RequireRole roles={['platform_admin']}>
        <PlatformAdminLayout />
      </RequireRole>
    ),
    children: [
      { index: true, element: <PlatformOverview /> },
      { path: 'stations', element: <PlatformStations /> },
      { path: 'users', element: <PlatformUsers /> },
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
      { path: 'orders', element: <StationOrdersPage /> },
      { path: 'customers', element: <StationCustomersPage /> },
      { path: 'drivers', element: <StationDriversPage /> },
      { path: 'service-areas', element: <StationServiceAreasPage /> },
      { path: 'locations', element: <StationLocationsPage /> },
      { path: 'qr-codes', element: <StationQrCodesPage /> },
      { path: 'payments', element: <StationPaymentsPage /> },
      { path: 'reports', element: <StationReportsPage /> },
      { path: 'settings', element: <StationSettingsPage /> },
    ],
  },

  { path: '*', element: <Navigate to="/customer" replace /> },
])
