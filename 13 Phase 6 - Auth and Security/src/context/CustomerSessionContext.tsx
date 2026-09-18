import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

const STORAGE_KEY = 'droply_customer_session'

interface StoredCustomerSession {
  token: string
  customerId: string
  expiresAt: string
}

interface CustomerSessionContextValue {
  session: StoredCustomerSession | null
  isAuthenticated: boolean
  setSession: (session: StoredCustomerSession) => void
  clearSession: () => void
}

const CustomerSessionContext = createContext<CustomerSessionContextValue | undefined>(undefined)

function readStoredSession(): StoredCustomerSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null

    const parsed = JSON.parse(raw) as StoredCustomerSession

    if (!parsed.token || !parsed.customerId || !parsed.expiresAt) {
      localStorage.removeItem(STORAGE_KEY)
      return null
    }

    if (new Date(parsed.expiresAt).getTime() <= Date.now()) {
      localStorage.removeItem(STORAGE_KEY)
      return null
    }

    return parsed
  } catch {
    return null
  }
}

export function CustomerSessionProvider({ children }: { children: ReactNode }) {
  const [session, setSessionState] = useState<StoredCustomerSession | null>(() =>
    readStoredSession(),
  )

  const value = useMemo<CustomerSessionContextValue>(
    () => ({
      session,
      isAuthenticated: Boolean(session),
      setSession: (next) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
        setSessionState(next)
      },
      clearSession: () => {
        localStorage.removeItem(STORAGE_KEY)
        setSessionState(null)
      },
    }),
    [session],
  )

  return (
    <CustomerSessionContext.Provider value={value}>
      {children}
    </CustomerSessionContext.Provider>
  )
}

export function useCustomerSession() {
  const context = useContext(CustomerSessionContext)

  if (!context) {
    throw new Error('useCustomerSession must be used within CustomerSessionProvider')
  }

  return context
}
