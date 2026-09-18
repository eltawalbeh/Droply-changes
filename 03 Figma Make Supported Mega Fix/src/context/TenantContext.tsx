import { createContext, useContext, type ReactNode } from 'react'
import type { Station } from '../types'

interface TenantContextValue {
  activeStation: Station | null
  isLoading: boolean
}

const TenantContext = createContext<TenantContextValue>({
  activeStation: null,
  isLoading: false,
})

export function TenantProvider({ children }: { children: ReactNode }) {
  return (
    <TenantContext.Provider value={{ activeStation: null, isLoading: false }}>
      {children}
    </TenantContext.Provider>
  )
}

export function useTenant() {
  return useContext(TenantContext)
}
