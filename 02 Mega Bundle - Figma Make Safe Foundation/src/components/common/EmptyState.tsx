import type { ReactNode } from 'react'

export function EmptyState({title,description,action}:{title:string;description:string;action?:ReactNode}) {
  return <div className="grid min-h-[360px] place-items-center rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center"><div className="max-w-md"><h2 className="text-lg font-semibold text-slate-900">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>{action ? <div className="mt-5">{action}</div> : null}</div></div>
}
