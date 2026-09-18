import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { UserRole } from '../types'
import { supabase } from '../lib/supabase'

export interface AuthUser {
  id: string
  role: UserRole
  stationId?: string | null
  driverId?: string | null
  fullName?: string | null
  phone?: string | null
  email?: string | null
}

interface AuthContextValue {
  user: AuthUser | null
  role: UserRole | null
  isAuthenticated: boolean
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<AuthUser>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function mapUser(user: {
  id: string
  email?: string | null
  phone?: string | null
  app_metadata?: Record<string, unknown>
  user_metadata?: Record<string, unknown>
}): AuthUser {
  const app = user.app_metadata ?? {}
  const role = app.role as UserRole | undefined

  if (!role || !['platform_admin', 'station_admin', 'station_staff', 'driver'].includes(role)) {
    throw new Error('This account does not have a Droply internal role.')
  }

  return {
    id: user.id,
    role,
    stationId: typeof app.station_id === 'string' ? app.station_id : null,
    driverId: typeof app.driver_id === 'string' ? app.driver_id : null,
    fullName:
      typeof user.user_metadata?.full_name === 'string'
        ? user.user_metadata.full_name
        : null,
    phone: user.phone ?? null,
    email: user.email ?? null,
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    supabase.auth.getUser().then(({ data, error }) => {
      if (!mounted) return

      if (error || !data.user) {
        setUser(null)
      } else {
        try {
          setUser(mapUser(data.user))
        } catch {
          setUser(null)
        }
      }

      setIsLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return

      if (!session?.user) {
        setUser(null)
        setIsLoading(false)
        return
      }

      try {
        setUser(mapUser(session.user))
      } catch {
        setUser(null)
      }

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
      signIn: async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })

        if (error || !data.user) {
          throw new Error(error?.message || 'Unable to sign in')
        }

        const mapped = mapUser(data.user)
        setUser(mapped)
        return mapped
      },
      logout: async () => {
        await supabase.auth.signOut()
        setUser(null)
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
