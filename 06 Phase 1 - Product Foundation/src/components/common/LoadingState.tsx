export function LoadingState({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="grid min-h-40 place-items-center rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-500">
      {label}
    </div>
  )
}
