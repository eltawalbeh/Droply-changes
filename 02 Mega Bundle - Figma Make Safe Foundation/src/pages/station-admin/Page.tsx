import { EmptyState } from '../../components/common/EmptyState'

export function StationAdminPage({title,description}:{title:string;description:string}) {
  return <section><header className="mb-6"><div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Droply</div><h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{title}</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">{description}</p></header><EmptyState title="No data yet" description="This screen is ready for live Supabase data. No demo records, fake analytics, or simulated actions are included."/></section>
}
