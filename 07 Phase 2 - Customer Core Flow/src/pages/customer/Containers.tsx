import { Link } from 'react-router'
import { Droplets } from 'lucide-react'

export function CustomerContainers() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid size-12 place-items-center rounded-2xl bg-slate-100 text-slate-700">
          <Droplets size={22} />
        </div>
        <h1 className="mt-5 text-2xl font-semibold text-slate-950">Your containers</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Container types will come from the linked station. You will be able to save how many returnable bottles or gallons you already have.
        </p>
        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 p-5 text-center text-sm text-slate-500">
          No station container types loaded yet.
        </div>
        <Link to="/customer" className="mt-6 block rounded-xl bg-slate-950 px-4 py-3 text-center text-sm font-semibold text-white">
          Continue to Home
        </Link>
      </div>
    </div>
  )
}
