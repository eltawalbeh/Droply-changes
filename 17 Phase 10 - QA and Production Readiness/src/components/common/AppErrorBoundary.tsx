import { Component, type ErrorInfo, type ReactNode } from 'react'

export class AppErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Droply UI error', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="grid min-h-screen place-items-center bg-slate-50 px-4">
          <div className="max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center">
            <h1 className="text-2xl font-semibold text-slate-950">Something went wrong</h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">Reload the page and try again. Your saved data is not changed by this screen error.</p>
            <button onClick={() => window.location.reload()} className="mt-6 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white">
              Reload
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
