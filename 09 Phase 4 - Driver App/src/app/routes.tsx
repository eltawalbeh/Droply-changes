import { createBrowserRouter, Navigate } from 'react-router'
import { CustomerLayout } from '../components/layouts/CustomerLayout'
import { DashboardLayout } from '../components/layouts/DashboardLayout'
import { DriverLayout } from '../components/layouts/DriverLayout'
import { QRLanding } from '../pages/customer/QRLanding'
import { CustomerRegister } from '../pages/customer/Register'
import { CustomerContainers } from '../pages/customer/Containers'
import { CustomerHome } from '../pages/customer/Home'
import { CustomerOrders } from '../pages/customer/Orders'
import { CustomerProfile } from '../pages/customer/Profile'
import { DriverToday } from '../pages/driver/Today'
import { DriverActive } from '../pages/driver/Active'
import { DriverCompleted } from '../pages/driver/Completed'
import { DriverOrderDetails } from '../pages/driver/OrderDetails'
import { CompleteDelivery } from '../pages/driver/CompleteDelivery'
import { DriverProfile } from '../pages/driver/Profile'
import { StationDashboard } from '../pages/station-admin/Dashboard'
import { ResourcePage } from '../pages/station-admin/ResourcePage'
import { StationSettingsPage } from '../pages/station-admin/Settings'

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
    path: '/driver',
    element: <DriverLayout />,
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
    element: <DashboardLayout />,
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
      {
        path: 'qr-codes',
        element: <ResourcePage title="QR Codes" description="Location-linked QR codes used for registration and attribution." searchPlaceholder="Search QR reference" filters={['Location', 'Status']} emptyTitle="No QR codes yet" emptyDescription="Generated station/location QR codes will appear here." />,
      },
      {
        path: 'payments',
        element: <ResourcePage title="Payments" description="Cash, CliQ, coupon and pending payment records." searchPlaceholder="Search order or customer" filters={['Method', 'Status', 'Driver']} emptyTitle="No payment records yet" emptyDescription="Live payment records will appear here." />,
      },
      {
        path: 'reports',
        element: <ResourcePage title="Reports" description="Operational reporting based only on live station data." searchPlaceholder="Search report" filters={['Date Range', 'Driver', 'Area']} emptyTitle="No report data yet" emptyDescription="Reports will populate when operational data exists." />,
      },
      { path: 'settings', element: <StationSettingsPage /> },
    ],
  },

  { path: '*', element: <Navigate to="/customer" replace /> },
])
