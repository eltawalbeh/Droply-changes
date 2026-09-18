import { Route } from 'lucide-react'

export function DriverActive() {
  return (
    <section>
      <h1 className="text-2xl font-semibold text-slate-950">Active Deliveries</h1>
      <p className="mt-2 text-sm leading-6 text-slate-500">
        Orders you accepted or marked out for delivery will appear here.
      </p>

      <div className="mt-6 grid min-h-72 place-items-center rounded-2xl border border-dashed border-slate-300 p-6 text-center">
        <div>
          <Route className="mx-auto text-slate-300" size={30} />
          <p className="mt-3 font-medium text-slate-700">No active deliveries</p>
          <p className="mt-1 text-sm text-slate-400">Live active orders will appear here.</p>
        </div>
      </div>
    </section>
  )
}
