import { Link } from 'react-router'

export function CustomerProfile() {
  return (
    <section>
      <h1 className="text-2xl font-semibold text-slate-950">Profile</h1>
      <div className="mt-6 divide-y divide-slate-200 rounded-2xl border border-slate-200">
        <Link to="/customer/containers" className="block px-4 py-4 text-sm font-medium text-slate-700">My Containers</Link>
        <div className="px-4 py-4 text-sm text-slate-400">Addresses — available after live account connection</div>
        <div className="px-4 py-4 text-sm text-slate-400">Change PIN — available after secure PIN flow is connected</div>
        <div className="px-4 py-4 text-sm text-slate-400">Contact Station — available after station link is loaded</div>
      </div>
    </section>
  )
}
