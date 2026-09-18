import { CheckCircle2, ClipboardList, Route, UserRound } from 'lucide-react'
import { NavLink, Outlet } from 'react-router'

const nav = [
  { label: 'Today', to: '/driver', icon: ClipboardList, end: true },
  { label: 'Active', to: '/driver/active', icon: Route },
  { label: 'Completed', to: '/driver/completed', icon: CheckCircle2 },
  { label: 'Profile', to: '/driver/profile', icon: UserRound },
]

export function DriverLayout() {
  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto min-h-screen max-w-md bg-white pb-20 shadow-sm">
        <main className="px-4 py-5">
          <Outlet />
        </main>

        <nav className="fixed inset-x-0 bottom-0 z-20 mx-auto grid max-w-md grid-cols-4 border-t border-slate-200 bg-white">
          {nav.map(({ label, to, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                [
                  'flex flex-col items-center gap-1 px-2 py-3 text-[11px]',
                  isActive ? 'font-semibold text-slate-950' : 'text-slate-400',
                ].join(' ')
              }
            >
              <Icon size={19} strokeWidth={1.8} />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  )
}
