import { createContext, useContext } from 'react'
import type { User } from '@supabase/supabase-js'

/**
 * Every state the admin area can be in. The gate renders one screen per state,
 * so an unknown state can never fall through to the dashboard.
 */
export type AdminAuthStatus =
  | 'unconfigured' // VITE_SUPABASE_* missing — nothing can be verified
  | 'loading' // asking Supabase for the stored session
  | 'signed-out' // no session, show the Google sign-in screen
  | 'checking-role' // signed in, waiting for the server-side role answer
  | 'authorized' // verified admin
  | 'forbidden' // signed in, but the server says not an admin
  | 'error' // role could not be verified — deny access

export interface AdminAuthValue {
  status: AdminAuthStatus
  user: User | null
  errorMessage: string | null
  /** ISO timestamp of the successful `is_admin()` answer; null until verified. */
  verifiedAt: string | null
  signInWithGoogle: () => void
  signInWithEmail: (email: string, password: string) => Promise<void>
  signOut: () => void
  retryRoleCheck: () => void
}

/**
 * Kept in its own file (no JSX) so fast refresh only reloads the provider.
 */
export const AdminAuthContext = createContext<AdminAuthValue | null>(null)

export function useAdminAuth(): AdminAuthValue {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) throw new Error('useAdminAuth must be used inside <AdminAuthProvider>')
  return ctx
}
