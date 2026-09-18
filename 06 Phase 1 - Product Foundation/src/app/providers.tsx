import type { ReactNode } from 'react'
import { AuthProvider } from '../context/AuthContext'
import { LanguageProvider } from '../context/LanguageContext'
import { TenantProvider } from '../context/TenantContext'

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <AuthProvider>
        <TenantProvider>{children}</TenantProvider>
      </AuthProvider>
    </LanguageProvider>
  )
}
