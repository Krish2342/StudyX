import { Navigate, Outlet } from 'react-router-dom'
import { PageLoader } from '@/components/ui/PageLoader'
import { useAuth } from '@/features/auth/useAuth'

export function StudentRoute() {
  const { status } = useAuth()
  if (status === 'loading') return <PageLoader />
  if (status === 'unconfigured') return <Navigate to="/login" replace />
  if (status === 'signed-out' || status === 'error') return <Navigate to="/login" replace />
  if (status === 'needs-profile') return <Navigate to="/onboarding" replace />
  if (status === 'suspended') return <Navigate to="/suspended" replace />
  return <Outlet />
}

export function OnboardingRoute() {
  const { status } = useAuth()
  if (status === 'loading') return <PageLoader />
  if (status === 'signed-out') return <Navigate to="/login" replace />
  if (status === 'suspended') return <Navigate to="/suspended" replace />
  if (status === 'authenticated') return <Navigate to="/app" replace />
  return <Outlet />
}
