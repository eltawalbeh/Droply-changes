import { PackageSearch } from 'lucide-react'

export function CustomerOrders() {
  return (
    <section>
      <h1 className="text-2xl font-semibold text-slate-950">My Orders</h1>
      <div className="mt-6 grid min-h-64 place-items-center rounded-2xl border border-dashed border-slate-300 p-6 text-center">
        <div>
          <PackageSearch className="mx-auto text-slate-300" size={28} />
          <p className="mt-3 font-medium text-slate-700">No orders yet</p>
          <p className="mt-1 text-sm text-slate-400">Your live order history will appear here.</p>
        </div>
      </div>
    </section>
  )
}
