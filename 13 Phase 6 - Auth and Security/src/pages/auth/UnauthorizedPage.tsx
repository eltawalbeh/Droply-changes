import { Link } from 'react-router'

export function UnauthorizedPage() {
  return (
    <div className="grid min-h-screen place-items-center bg-slate-50 px-4">
      <div className="max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center">
        <h1 className="text-2xl font-semibold text-slate-950">Access unavailable</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">Your account does not have permission to open this area.</p>
        <Link to="/login" className="mt-6 inline-block rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white">Back to sign in</Link>
      </div>
    </div>
  )
}
