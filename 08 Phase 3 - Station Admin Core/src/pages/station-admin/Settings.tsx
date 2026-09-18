import { PageHeader } from '../../components/common/PageHeader'

const sections = [
  ['Branding', 'Station name, logo and customer-facing identity.'],
  ['Container Types & Prices', 'Returnable container types, sizes and prices.'],
  ['Payment Methods', 'Cash, CliQ and optional coupon configuration.'],
  ['Users & Permissions', 'Station admin and staff access.'],
]

export function StationSettingsPage() {
  return (
    <section>
      <PageHeader title="Settings" description="Configuration for the current station tenant." />
      <div className="grid grid-cols-2 gap-4">
        {sections.map(([title, description]) => (
          <div key={title} className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="font-semibold text-slate-900">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
            <button disabled className="mt-5 rounded-xl bg-slate-100 px-3 py-2 text-sm font-medium text-slate-400">
              Available with live station data
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}
