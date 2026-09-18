import { CheckCircle2 } from 'lucide-react'

export function CompleteDelivery() {
  return (
    <section>
      <div className="grid size-12 place-items-center rounded-2xl bg-slate-100 text-slate-600">
        <CheckCircle2 size={22} />
      </div>

      <h1 className="mt-5 text-2xl font-semibold text-slate-950">Complete delivery</h1>
      <p className="mt-2 text-sm leading-6 text-slate-500">
        Delivery quantity and payment confirmation are recorded independently.
      </p>

      <div className="mt-6 grid gap-3">
        <div className="rounded-2xl border border-slate-200 p-4">
          <p className="text-sm font-medium text-slate-800">Delivered items</p>
          <p className="mt-1 text-sm text-slate-400">Loaded from the live order before completion.</p>
        </div>

        <div className="rounded-2xl border border-slate-200 p-4">
          <p className="text-sm font-medium text-slate-800">Payment method</p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {['Cash', 'CliQ', 'Coupon'].map((method) => (
              <button key={method} disabled className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-400">
                {method}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 p-4">
          <p className="text-sm font-medium text-slate-800">Payment status</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {['Paid', 'Pending'].map((status) => (
              <button key={status} disabled className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-400">
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button disabled className="mt-6 w-full rounded-xl bg-slate-200 px-4 py-3 text-sm font-semibold text-slate-400">
        Confirm Delivery
      </button>
    </section>
  )
}
