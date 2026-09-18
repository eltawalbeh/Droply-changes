export function ErrorState({
  title = 'Something went wrong',
  description = 'Please try again.',
}: {
  title?: string
  description?: string
}) {
  return (
    <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6">
      <h2 className="font-semibold text-rose-900">{title}</h2>
      <p className="mt-1 text-sm text-rose-700">{description}</p>
    </div>
  )
}
