import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { isSupabaseConfigured, supabase } from '@/lib/supabase'
import {
  ensureProfile,
  fetchProfile,
  type ProfileRecord,
} from '@/services/profileService'
import { AuthContext } from '@/features/auth/authContextValue'

export type AuthStatus =
  | 'unconfigured'
  | 'loading'
  | 'signed-out'
  | 'needs-profile'
  | 'authenticated'
  | 'suspended'
  | 'error'

const FORCE_ONBOARDING_KEY = 'studyx-force-onboarding'
const PENDING_FULL_NAME_KEY = 'studyx-pending-full-name'

function profileNeedsCompletion(profile: ProfileRecord): boolean {
  return !profile.full_name?.trim() || !profile.college_id || !profile.branch_id || !profile.semester_id
}

function consumeForceOnboarding(): boolean {
  return sessionStorage.getItem(FORCE_ONBOARDING_KEY) === '1'
}

function clearForceOnboarding(): void {
  sessionStorage.removeItem(FORCE_ONBOARDING_KEY)
}

function clearPendingFullName(): void {
  sessionStorage.removeItem(PENDING_FULL_NAME_KEY)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>(
    isSupabaseConfigured ? 'loading' : 'unconfigured',
  )
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<ProfileRecord | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const requestId = useRef(0)

  const loadSession = useCallback(async (session: Session | null) => {
    const client = supabase
    const ticket = ++requestId.current
    if (!client) return

    if (!session) {
      setUser(null)
      setProfile(null)
      setStatus('signed-out')
      setErrorMessage(null)
      return
    }

    setStatus('loading')
    setUser(session.user)
    setErrorMessage(null)

    try {
      await ensureProfile(client, session.user)
      const pendingFullName = sessionStorage.getItem(PENDING_FULL_NAME_KEY)?.trim()
      if (pendingFullName) {
        const { error: nameError } = await client
          .from('profiles')
          .update({ full_name: pendingFullName })
          .eq('id', session.user.id)
        if (nameError) throw new Error(`Unable to use your entered name: ${nameError.message}`)
      }
      const currentProfile = await fetchProfile(client, session.user.id)
      if (ticket !== requestId.current) return

      setProfile(currentProfile)
      const forceOnboarding = consumeForceOnboarding()
      if (currentProfile.is_suspended) {
        setStatus('suspended')
      } else if (forceOnboarding || profileNeedsCompletion(currentProfile)) {
        setStatus('needs-profile')
      } else {
        setStatus('authenticated')
      }
    } catch (error) {
      if (ticket !== requestId.current) return
      setErrorMessage(error instanceof Error ? error.message : 'Unable to load your StudyX profile.')
      setStatus('error')
    }
  }, [])

  useEffect(() => {
    const client = supabase
    if (!client) return
    let active = true

    void client.auth.getSession().then(({ data, error }) => {
      if (!active) return
      if (error) {
        setErrorMessage(error.message)
        setStatus('error')
        return
      }
      void loadSession(data.session)
    })

    const { data: subscription } = client.auth.onAuthStateChange((_event, session) => {
      window.setTimeout(() => {
        if (active) void loadSession(session)
      }, 0)
    })

    return () => {
      active = false
      subscription.subscription.unsubscribe()
    }
  }, [loadSession])

  const signInWithGoogle = useCallback(async (forceOnboarding = false, pendingFullName = '') => {
    if (!supabase) {
      setStatus('unconfigured')
      return
    }
    if (forceOnboarding) {
      sessionStorage.setItem(FORCE_ONBOARDING_KEY, '1')
    } else {
      sessionStorage.removeItem(FORCE_ONBOARDING_KEY)
    }
    if (pendingFullName.trim()) {
      sessionStorage.setItem(PENDING_FULL_NAME_KEY, pendingFullName.trim())
    } else {
      sessionStorage.removeItem(PENDING_FULL_NAME_KEY)
    }
    setStatus('loading')
    setErrorMessage(null)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/app` },
    })
    if (error) {
      setErrorMessage(error.message)
      setStatus('error')
    }
  }, [])

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    if (!supabase) { setStatus('unconfigured'); return }
    setStatus('loading')
    setErrorMessage(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setErrorMessage(error.message)
      setStatus('error')
    }
    // On success, onAuthStateChange fires and loadSession runs automatically
  }, [])

  const signUpWithEmail = useCallback(async (email: string, password: string, fullName: string): Promise<{ needsVerification: boolean }> => {
    if (!supabase) { setStatus('unconfigured'); return { needsVerification: false } }
    setErrorMessage(null)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/app`,
      },
    })
    if (error) {
      setErrorMessage(error.message)
      throw new Error(error.message)
    }
    // If session is null but user exists, email confirmation is required
    const needsVerification = Boolean(data.user && !data.session)
    return { needsVerification }
  }, [])

  const resetPassword = useCallback(async (email: string) => {
    if (!supabase) return
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) throw new Error(error.message)
  }, [])

  const signOut = useCallback(async () => {
    if (!supabase) return
    const { error } = await supabase.auth.signOut()
    if (error) throw new Error(error.message)
    setUser(null)
    setProfile(null)
    setErrorMessage(null)
    clearForceOnboarding()
    clearPendingFullName()
    setStatus('signed-out')
  }, [])

  const refreshProfile = useCallback(async () => {
    if (!supabase || !user) throw new Error('You must be signed in to load your profile.')
    const currentProfile = await fetchProfile(supabase, user.id)
    setProfile(currentProfile)
    clearForceOnboarding()
    clearPendingFullName()
    setStatus(
      currentProfile.is_suspended
        ? 'suspended'
        : profileNeedsCompletion(currentProfile)
          ? 'needs-profile'
          : 'authenticated',
    )
    return currentProfile
  }, [user])

  const value = useMemo(
    () => ({
      status,
      user,
      profile,
      errorMessage,
      signInWithGoogle,
      signInWithEmail,
      signUpWithEmail,
      resetPassword,
      signOut,
      refreshProfile,
    }),
    [status, user, profile, errorMessage, signInWithGoogle, signInWithEmail, signUpWithEmail, resetPassword, signOut, refreshProfile],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
