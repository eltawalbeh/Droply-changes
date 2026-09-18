import { NavLink, Outlet } from 'react-router'
import { LayoutDashboard, ShoppingCart, Users, Truck, MapPinned, Building2, QrCode, WalletCards, ChartNoAxesCombined, Settings } from 'lucide-react'

const nav = [
  ['Dashboard','/station-admin',LayoutDashboard,true],
  ['Orders','/station-admin/orders',ShoppingCart,false],
  ['Customers','/station-admin/customers',Users,false],
  ['Drivers','/station-admin/drivers',Truck,false],
  ['Service Areas','/station-admin/service-areas',MapPinned,false],
  ['Locations','/station-admin/locations',Building2,false],
  ['QR Codes','/station-admin/qr-codes',QrCode,false],
  ['Payments','/station-admin/payments',WalletCards,false],
  ['Reports','/station-admin/reports',ChartNoAxesCombined,false],
  ['Settings','/station-admin/settings',Settings,false],
] as const

export function DashboardLayout() {
  return (
    <div className="grid min-h-screen grid-cols-[260px_minmax(0,1fr)] bg-slate-50 text-slate-900">
      <aside className="border-r border-slate-200 bg-white px-4 py-6">
        <div className="mb-8 flex items-center gap-3 px-2">
          <div className="grid size-10 place-items-center rounded-xl bg-slate-950 text-sm font-bold text-white">D</div>
          <div><div className="font-semibold">Droply</div><div className="text-xs text-slate-500">Station Console</div></div>
        </div>
        <nav className="grid gap-1">
          {nav.map(([label,to,Icon,end]) => (
            <NavLink key={to} to={to} end={end} className={({isActive}) => ['flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition', isActive ? 'bg-slate-100 font-medium text-slate-950' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'].join(' ')}>
              <Icon size={18} strokeWidth={1.8}/>{label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="min-w-0 p-8"><div className="mx-auto max-w-[1500px]"><Outlet/></div></main>
    </div>
  )
}
