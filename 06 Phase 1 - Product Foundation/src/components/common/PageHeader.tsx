import type { ReactNode } from 'react'

export function PageHeader({
  eyebrow = 'Droply',
  title,
  description,
  action,
}: {
  eyebrow?: string
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <header className="mb-6 flex items-start justify-between gap-6">
      <div>
        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">{eyebrow}</div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{title}</h1>
        {description ? <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">{description}</p> : null}
      </div>
      {action}
    </header>
  )
}
