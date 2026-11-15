import { createContext, useContext } from 'react'
import type { ToastTone } from '@/types'

export interface ToastContextValue {
  toast: (message: string, tone?: ToastTone) => void
}

/**
 * Kept in its own file (no JSX) so components get fast refresh:
 * importing `useToast` never reloads the whole tree.
 */
export const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>')
  return ctx
}
