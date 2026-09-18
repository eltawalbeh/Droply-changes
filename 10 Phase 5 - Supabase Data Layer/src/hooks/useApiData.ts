import { useCallback, useEffect, useState } from 'react'

export function useApiData<T>(loader: () => Promise<T>, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const reload = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      setData(await loader())
    } catch (reason) {
      setData(null)
      setError(reason instanceof Error ? reason.message : 'Request failed')
    } finally {
      setIsLoading(false)
    }
  }, deps)

  useEffect(() => {
    void reload()
  }, [reload])

  return { data, error, isLoading, reload }
}
