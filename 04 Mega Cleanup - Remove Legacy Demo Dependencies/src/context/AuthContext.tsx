import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { UserRole } from '../types'
import { supabase } from '../lib/supabase'

export interface AuthUser {
  id: string
  role: UserRole
  stationId?: string | null
  fullName?: string | null
  phone?: string | null
}

interface AuthContextValue {
  user: AuthUser | null
  role: UserRole | null
  isAuthenticated: boolean
  isLoading: boolean
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return

      const sessionUser = data.session?.user

      if (!sessionUser) {
        setUser(null)
        setIsLoading(false)
        return
      }

      setUser({
        id: sessionUser.id,
        role: (sessionUser.user_metadata?.role as UserRole | undefined) ?? 'customer',
        stationId: sessionUser.user_metadata?.station_id ?? null,
        fullName: sessionUser.user_metadata?.full_name ?? null,
        phone: sessionUser.phone ?? null,
      })
      setIsLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const sessionUser = session?.user

      if (!sessionUser) {
        setUser(null)
        setIsLoading(false)
        return
      }

      setUser({
        id: sessionUser.id,
        role: (sessionUser.user_metadata?.role as UserRole | undefined) ?? 'customer',
        stationId: sessionUser.user_metadata?.station_id ?? null,
        fullName: sessionUser.user_metadata?.full_name ?? null,
        phone: sessionUser.phone ?? null,
      })
      setIsLoading(false)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      role: user?.role ?? null,
      isAuthenticated: Boolean(user),
      isLoading,
      logout: async () => {
        await supabase.auth.signOut()
      },
    }),
    [user, isLoading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}
