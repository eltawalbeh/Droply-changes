import type { ReactNode } from 'react'
import { Navigate } from 'react-router'
import type { UserRole } from '../../types'
import { useAuth } from '../../context/AuthContext'

export function RequireRole({
  roles,
  children,
}: {
  roles: UserRole[]
  children: ReactNode
}) {
  const { isLoading, isAuthenticated, role } = useAuth()

  if (isLoading) {
    return <div className="grid min-h-screen place-items-center text-sm text-slate-500">Checking access…</div>
  }

  if (!isAuthenticated || !role) {
    return <Navigate to="/login" replace />
  }

  if (!roles.includes(role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return <>{children}</>
}
