import { useContext } from 'react'
import { AuthContext } from '@/features/auth/authContextValue'
import type { AuthContextValue } from '@/features/auth/authContextValue'

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside <AuthProvider>')
  return context
}
