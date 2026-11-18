import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { isSupabaseConfigured, supabase } from '@/lib/supabase'
import { AdminAuthContext } from '@/features/admin/auth/adminAuthContext'
import type { AdminAuthStatus } from '@/features/admin/auth/adminAuthContext'

/**
 * Holds the admin session and answers one question: "does the server say this
 * person is a Super Admin?"
 *
 * Security notes:
 * - The role is NEVER read from the session, user metadata or localStorage.
 *   Those are client-controlled. The answer comes from `public.is_admin()`,
 *   which runs inside Postgres and reads the protected `user_roles` table.
 * - The check fails closed: any error means "not authorized".
 * - This gate is only the user experience. Real protection is RLS + server
 *   checks, so calling the API directly without the UI still fails.
 */
export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AdminAuthStatus>(
    isSupabaseConfigured ? 'loading' : 'unconfigured',
  )
  const [user, setUser] = useState<User | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [verifiedAt, setVerifiedAt] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)

  // Guards against a slow reply overwriting a newer one.
  const requestId = useRef(0)

  useEffect(() => {
    const client = supabase
    if (!client) return
    const configuredClient = client

    let active = true

    async function verify(session: Session | null) {
      const ticket = ++requestId.current
      if (!active) return

      if (!session) {
        setUser(null)
        setVerifiedAt(null)
        setStatus('signed-out')
        return
      }

      setUser(session.user)
      setStatus('checking-role')

      const { data, error } = await configuredClient.rpc('is_super_admin')

      // A newer verification started, or the provider unmounted — ignore.
      if (!active || ticket !== requestId.current) return

      if (error) {
        setErrorMessage(error.message)
        setVerifiedAt(null)
        setStatus('error')
        return
      }

      setErrorMessage(null)
      if (data === true) {
        setVerifiedAt(new Date().toISOString())
        setStatus('authorized')
      } else {
        setVerifiedAt(null)
        setStatus('forbidden')
      }
    }

    void configuredClient.auth.getSession().then(({ data }) => verify(data.session))

    const { data: subscription } = configuredClient.auth.onAuthStateChange((_event, session) => {
      // Supabase warns that awaiting inside this callback can deadlock the auth
      // client, so verification is deferred to the next tick.
      window.setTimeout(() => {
        void verify(session)
      }, 0)
    })

    return () => {
      active = false
      subscription.subscription.unsubscribe()
    }
  }, [attempt])

  const signInWithGoogle = useCallback(() => {
    if (!supabase) return
    setStatus('loading')
    setErrorMessage(null)

    void supabase.auth
      .signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/admin` },
      })
      .then(({ error }) => {
        if (!error) return
        setErrorMessage(error.message)
        setStatus('error')
      })
  }, [])

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    if (!supabase) return
    setStatus('loading')
    setErrorMessage(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setErrorMessage(error.message)
      setStatus('error')
    }
    // On success onAuthStateChange fires → verify() runs automatically
  }, [])

  const signOut = useCallback(() => {
    if (!supabase) return
    void supabase.auth.signOut().then(() => {
      setUser(null)
      setVerifiedAt(null)
      setStatus('signed-out')
    })
  }, [])

  const retryRoleCheck = useCallback(() => {
    setErrorMessage(null)
    setVerifiedAt(null)
    setStatus('loading')
    setAttempt((n) => n + 1)
  }, [])

  const value = useMemo(
    () => ({ status, user, errorMessage, verifiedAt, signInWithGoogle, signInWithEmail, signOut, retryRoleCheck }),
    [status, user, errorMessage, verifiedAt, signInWithGoogle, signInWithEmail, signOut, retryRoleCheck],
  )

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
}
