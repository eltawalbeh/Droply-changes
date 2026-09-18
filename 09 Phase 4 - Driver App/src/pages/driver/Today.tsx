import { ClipboardList } from 'lucide-react'

export function DriverToday() {
  return (
    <section>
      <p className="text-sm font-medium text-slate-500">Droply Driver</p>
      <h1 className="mt-1 text-2xl font-semibold text-slate-950">Today</h1>
      <p className="mt-2 text-sm leading-6 text-slate-500">
        Assigned orders will appear here automatically based on your service area.
      </p>

      <div className="mt-6 grid min-h-72 place-items-center rounded-2xl border border-dashed border-slate-300 p-6 text-center">
        <div>
          <ClipboardList className="mx-auto text-slate-300" size={30} />
          <p className="mt-3 font-medium text-slate-700">No assigned orders yet</p>
          <p className="mt-1 text-sm leading-6 text-slate-400">
            New, accepted and out-for-delivery orders will appear here from live station data.
          </p>
        </div>
      </div>
    </section>
  )
}
