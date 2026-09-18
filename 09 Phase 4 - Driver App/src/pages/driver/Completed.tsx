import { CheckCircle2 } from 'lucide-react'

export function DriverCompleted() {
  return (
    <section>
      <h1 className="text-2xl font-semibold text-slate-950">Completed Today</h1>
      <p className="mt-2 text-sm leading-6 text-slate-500">
        Deliveries completed today will appear here after live order updates.
      </p>

      <div className="mt-6 grid min-h-72 place-items-center rounded-2xl border border-dashed border-slate-300 p-6 text-center">
        <div>
          <CheckCircle2 className="mx-auto text-slate-300" size={30} />
          <p className="mt-3 font-medium text-slate-700">Nothing completed yet</p>
          <p className="mt-1 text-sm text-slate-400">Completed delivery history will appear here.</p>
        </div>
      </div>
    </section>
  )
}
