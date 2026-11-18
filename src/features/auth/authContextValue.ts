import { createContext } from 'react'
import type { User } from '@supabase/supabase-js'
import type { ProfileRecord } from '@/services/profileService'
import type { AuthStatus } from '@/features/auth/authContext'

export interface AuthContextValue {
  status: AuthStatus
  user: User | null
  profile: ProfileRecord | null
  errorMessage: string | null
  signInWithGoogle: (forceOnboarding?: boolean, pendingFullName?: string) => Promise<void>
  signInWithEmail: (email: string, password: string) => Promise<void>
  signUpWithEmail: (email: string, password: string, fullName: string) => Promise<{ needsVerification: boolean }>
  resetPassword: (email: string) => Promise<void>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<ProfileRecord>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
