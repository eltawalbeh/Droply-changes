export function DriverProfile() {
  return (
    <section>
      <h1 className="text-2xl font-semibold text-slate-950">Driver Profile</h1>
      <div className="mt-6 divide-y divide-slate-200 rounded-2xl border border-slate-200">
        <div className="px-4 py-4">
          <p className="text-sm font-medium text-slate-700">Assigned service areas</p>
          <p className="mt-1 text-sm text-slate-400">Loads from station configuration.</p>
        </div>
        <div className="px-4 py-4">
          <p className="text-sm font-medium text-slate-700">Station</p>
          <p className="mt-1 text-sm text-slate-400">Loads from authenticated driver profile.</p>
        </div>
        <div className="px-4 py-4">
          <p className="text-sm font-medium text-slate-700">Account</p>
          <p className="mt-1 text-sm text-slate-400">Authentication settings will be connected in the auth phase.</p>
        </div>
      </div>
    </section>
  )
}
