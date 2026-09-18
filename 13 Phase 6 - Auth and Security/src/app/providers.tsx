import type { ReactNode } from 'react'
import { AuthProvider } from '../context/AuthContext'
import { CustomerSessionProvider } from '../context/CustomerSessionContext'
import { LanguageProvider } from '../context/LanguageContext'
import { TenantProvider } from '../context/TenantContext'

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <AuthProvider>
        <CustomerSessionProvider>
          <TenantProvider>{children}</TenantProvider>
        </CustomerSessionProvider>
      </AuthProvider>
    </LanguageProvider>
  )
}
