import { NavLink, Outlet } from 'react-router'
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Truck,
  MapPinned,
  Building2,
  QrCode,
  WalletCards,
  ChartNoAxesCombined,
  Settings,
} from 'lucide-react'

const navigation = [
  { label: 'Dashboard', to: '/station-admin', icon: LayoutDashboard, end: true },
  { label: 'Orders', to: '/station-admin/orders', icon: ShoppingCart },
  { label: 'Customers', to: '/station-admin/customers', icon: Users },
  { label: 'Drivers', to: '/station-admin/drivers', icon: Truck },
  { label: 'Service Areas', to: '/station-admin/service-areas', icon: MapPinned },
  { label: 'Locations', to: '/station-admin/locations', icon: Building2 },
  { label: 'QR Codes', to: '/station-admin/qr-codes', icon: QrCode },
  { label: 'Payments', to: '/station-admin/payments', icon: WalletCards },
  { label: 'Reports', to: '/station-admin/reports', icon: ChartNoAxesCombined },
  { label: 'Settings', to: '/station-admin/settings', icon: Settings },
]

export function DashboardLayout() {
  return (
    <div className="grid min-h-screen grid-cols-[260px_minmax(0,1fr)] bg-slate-50 text-slate-900">
      <aside className="border-r border-slate-200 bg-white px-4 py-6">
        <div className="mb-8 flex items-center gap-3 px-2">
          <div className="grid size-10 place-items-center rounded-xl bg-slate-950 text-sm font-bold text-white">
            D
          </div>
          <div>
            <div className="font-semibold">Droply</div>
            <div className="text-xs text-slate-500">Station Console</div>
          </div>
        </div>

        <nav className="grid gap-1">
          {navigation.map(({ label, to, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                [
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition',
                  isActive
                    ? 'bg-slate-100 font-medium text-slate-950'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950',
                ].join(' ')
              }
            >
              <Icon size={18} strokeWidth={1.8} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="min-w-0 p-8">
        <div className="mx-auto max-w-[1500px]">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
