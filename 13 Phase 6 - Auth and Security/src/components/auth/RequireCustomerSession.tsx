import type { ReactNode } from 'react'
import { Navigate } from 'react-router'
import { useCustomerSession } from '../../context/CustomerSessionContext'

export function RequireCustomerSession({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useCustomerSession()

  if (!isAuthenticated) {
    return <Navigate to="/customer/login" replace />
  }

  return <>{children}</>
}
