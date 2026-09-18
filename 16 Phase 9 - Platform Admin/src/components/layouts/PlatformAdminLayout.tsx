import { Building2, LayoutDashboard, Users } from 'lucide-react'
import { NavLink, Outlet } from 'react-router'

const nav = [
  { label: 'Overview', to: '/platform-admin', icon: LayoutDashboard, end: true },
  { label: 'Stations', to: '/platform-admin/stations', icon: Building2 },
  { label: 'Users', to: '/platform-admin/users', icon: Users },
]

export function PlatformAdminLayout() {
  return (
    <div className="min-h-screen min-w-[1180px] bg-slate-50 text-slate-900">
      <div className="grid min-h-screen grid-cols-[260px_minmax(0,1fr)]">
        <aside className="border-r border-slate-200 bg-white px-4 py-6">
          <div className="mb-8 flex items-center gap-3 px-2">
            <div className="grid size-10 place-items-center rounded-xl bg-slate-950 font-bold text-white">D</div>
            <div>
              <div className="font-semibold">Droply</div>
              <div className="text-xs text-slate-500">Platform Admin</div>
            </div>
          </div>

          <nav className="grid gap-1">
            {nav.map(({ label, to, icon: Icon, end }) => (
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
                <Icon size={18} />
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
    </div>
  )
}
