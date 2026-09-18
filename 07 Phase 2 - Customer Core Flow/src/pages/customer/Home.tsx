import { Minus, Plus, MapPin, WalletCards } from 'lucide-react'
import { useState } from 'react'

export function CustomerHome() {
  const [quantity, setQuantity] = useState(0)

  return (
    <section>
      <p className="text-sm font-medium text-slate-500">Droply</p>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">Quick order</h1>
      <p className="mt-2 text-sm leading-6 text-slate-500">Your linked station, saved address and container types will appear here once live data is connected.</p>

      <div className="mt-6 rounded-2xl border border-slate-200 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Quantity</p>
        <div className="mt-4 flex items-center justify-between">
          <button onClick={() => setQuantity((value) => Math.max(0, value - 1))} className="grid size-11 place-items-center rounded-xl border border-slate-200 bg-white"><Minus size={18} /></button>
          <span className="text-3xl font-semibold text-slate-950">{quantity}</span>
          <button onClick={() => setQuantity((value) => value + 1)} className="grid size-11 place-items-center rounded-xl bg-slate-950 text-white"><Plus size={18} /></button>
        </div>
      </div>

      <div className="mt-3 grid gap-3">
        <div className="flex items-start gap-3 rounded-2xl border border-slate-200 p-4">
          <MapPin className="mt-0.5 text-slate-400" size={18} />
          <div><p className="text-sm font-medium text-slate-800">Delivery address</p><p className="mt-1 text-sm text-slate-400">No saved address loaded.</p></div>
        </div>
        <div className="flex items-start gap-3 rounded-2xl border border-slate-200 p-4">
          <WalletCards className="mt-0.5 text-slate-400" size={18} />
          <div><p className="text-sm font-medium text-slate-800">Payment</p><p className="mt-1 text-sm text-slate-400">Cash / CliQ options load from station settings.</p></div>
        </div>
      </div>

      <button disabled className="mt-6 w-full rounded-xl bg-slate-200 px-4 py-3 text-sm font-semibold text-slate-400">
        Order Now
      </button>
      <p className="mt-2 text-center text-xs text-slate-400">Ordering activates when live station and customer data are connected.</p>
    </section>
  )
}
