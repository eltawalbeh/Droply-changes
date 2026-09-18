import { Home, PackageSearch, UserRound } from 'lucide-react'
import { NavLink, Outlet } from 'react-router'

const nav = [
  { label: 'Home', to: '/customer', icon: Home, end: true },
  { label: 'Orders', to: '/customer/orders', icon: PackageSearch },
  { label: 'Profile', to: '/customer/profile', icon: UserRound },
]

export function CustomerLayout() {
  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto min-h-screen max-w-md bg-white pb-20 shadow-sm">
        <main className="px-4 py-5">
          <Outlet />
        </main>

        <nav className="fixed inset-x-0 bottom-0 z-20 mx-auto grid max-w-md grid-cols-3 border-t border-slate-200 bg-white">
          {nav.map(({ label, to, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                [
                  'flex flex-col items-center gap-1 px-3 py-3 text-xs',
                  isActive ? 'font-semibold text-slate-950' : 'text-slate-400',
                ].join(' ')
              }
            >
              <Icon size={20} strokeWidth={1.8} />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  )
}
