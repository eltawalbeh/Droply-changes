import { PageHeader } from '../../components/common/PageHeader'

const metrics = [
  'Orders Today',
  'New Orders',
  'Out for Delivery',
  'Delivered',
  'Cash Collected',
  'CliQ',
  'Pending Payments',
  'Active Customers',
]

export function StationDashboard() {
  return (
    <section>
      <PageHeader title="Dashboard" description="Operational view of this station. Metrics populate from live Supabase data only." />

      <div className="grid grid-cols-4 gap-4">
        {metrics.map((label) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-3 text-3xl font-semibold text-slate-300">—</p>
            <p className="mt-2 text-xs text-slate-400">No live data loaded</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="min-h-80 rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="font-semibold text-slate-900">Order activity</h2>
          <p className="mt-1 text-sm text-slate-400">Chart becomes available when live orders exist.</p>
        </div>
        <div className="min-h-80 rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="font-semibold text-slate-900">Payment mix</h2>
          <p className="mt-1 text-sm text-slate-400">Cash, CliQ and coupon data will be summarized here.</p>
        </div>
      </div>
    </section>
  )
}
