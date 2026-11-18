import { useCallback, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import type { ToastItem, ToastTone } from '@/types'
import { ToastContext } from '@/hooks/useToast'
import { ToastViewport } from '@/components/ui/Toast'

const AUTO_DISMISS_MS = 3200

/**
 * Toasts live in React state and vanish on refresh — nothing is stored.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const nextId = useRef(1)

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((t) => t.id !== id))
  }, [])

  const toast = useCallback(
    (message: string, tone: ToastTone = 'info') => {
      const id = nextId.current++
      setToasts((current) => [...current.slice(-2), { id, message, tone }])
      window.setTimeout(() => dismiss(id), AUTO_DISMISS_MS)
    },
    [dismiss],
  )

  const value = useMemo(() => ({ toast }), [toast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  )
}
