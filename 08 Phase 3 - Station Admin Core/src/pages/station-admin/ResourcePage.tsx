import { Search } from 'lucide-react'
import { EmptyState } from '../../components/common/EmptyState'
import { PageHeader } from '../../components/common/PageHeader'

export function ResourcePage({
  title,
  description,
  searchPlaceholder = 'Search',
  filters = [],
  emptyTitle,
  emptyDescription,
}: {
  title: string
  description: string
  searchPlaceholder?: string
  filters?: string[]
  emptyTitle: string
  emptyDescription: string
}) {
  return (
    <section>
      <PageHeader title={title} description={description} />

      <div className="mb-4 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3">
        <div className="flex min-w-80 items-center gap-2 rounded-xl border border-slate-200 px-3 py-2">
          <Search size={16} className="text-slate-400" />
          <input className="w-full border-0 bg-transparent text-sm outline-none" placeholder={searchPlaceholder} />
        </div>
        {filters.map((filter) => (
          <button key={filter} className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600">
            {filter}
          </button>
        ))}
      </div>

      <EmptyState title={emptyTitle} description={emptyDescription} />
    </section>
  )
}
