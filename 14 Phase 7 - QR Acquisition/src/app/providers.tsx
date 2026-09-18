import type { ReactNode } from 'react'
import { AuthProvider } from '../context/AuthContext'
import { CustomerOnboardingProvider } from '../context/CustomerOnboardingContext'
import { CustomerSessionProvider } from '../context/CustomerSessionContext'
import { LanguageProvider } from '../context/LanguageContext'
import { TenantProvider } from '../context/TenantContext'

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <AuthProvider>
        <CustomerSessionProvider>
          <CustomerOnboardingProvider>
            <TenantProvider>{children}</TenantProvider>
          </CustomerOnboardingProvider>
        </CustomerSessionProvider>
      </AuthProvider>
    </LanguageProvider>
  )
}
