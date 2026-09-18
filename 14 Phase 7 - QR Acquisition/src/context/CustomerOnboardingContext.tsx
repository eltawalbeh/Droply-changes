import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

export interface CustomerOnboardingDraft {
  qrCode: string
  scanId?: string | null
  phone: string
  fullName: string
  addressText: string
  pin: string
  latitude?: number | null
  longitude?: number | null
  notes?: string | null
}

interface CustomerOnboardingContextValue {
  draft: CustomerOnboardingDraft | null
  setDraft: (draft: CustomerOnboardingDraft) => void
  clearDraft: () => void
}

const CustomerOnboardingContext = createContext<CustomerOnboardingContextValue | undefined>(undefined)

export function CustomerOnboardingProvider({ children }: { children: ReactNode }) {
  const [draft, setDraftState] = useState<CustomerOnboardingDraft | null>(null)

  const value = useMemo<CustomerOnboardingContextValue>(
    () => ({
      draft,
      setDraft: setDraftState,
      clearDraft: () => setDraftState(null),
    }),
    [draft],
  )

  return (
    <CustomerOnboardingContext.Provider value={value}>
      {children}
    </CustomerOnboardingContext.Provider>
  )
}

export function useCustomerOnboarding() {
  const context = useContext(CustomerOnboardingContext)

  if (!context) {
    throw new Error('useCustomerOnboarding must be used within CustomerOnboardingProvider')
  }

  return context
}
