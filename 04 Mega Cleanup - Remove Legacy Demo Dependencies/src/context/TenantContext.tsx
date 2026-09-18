import { createContext, useContext, useMemo, type ReactNode } from 'react'
import type { Station } from '../types'

interface TenantContextValue {
  activeStation: Station | null
  activeTenant: Station | null
  tenants: Station[]
  isLoading: boolean
  isLoadingTenants: boolean
  setActiveTenantId: (_tenantId: string) => void
}

const TenantContext = createContext<TenantContextValue | undefined>(undefined)

export function TenantProvider({ children }: { children: ReactNode }) {
  const value = useMemo<TenantContextValue>(
    () => ({
      activeStation: null,
      activeTenant: null,
      tenants: [],
      isLoading: false,
      isLoadingTenants: false,
      setActiveTenantId: () => {},
    }),
    [],
  )

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>
}

export function useTenant() {
  const context = useContext(TenantContext)

  if (!context) {
    throw new Error('useTenant must be used within TenantProvider')
  }

  return context
}
