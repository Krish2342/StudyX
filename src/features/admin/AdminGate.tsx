import { useState, type FormEvent } from 'react'
import { AlertTriangle, ArrowLeft, Eye, EyeOff, Lock, LogIn, Mail, RefreshCw, ShieldCheck } from 'lucide-react'
import { Link, Navigate, Outlet, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { AdminAuthProvider } from '@/features/admin/auth/AdminAuthProvider'
import { useAdminAuth } from '@/features/admin/auth/adminAuthContext'

export function AdminRoute() {
  return (
    <AdminAuthProvider>
      <AdminAccess />
    </AdminAuthProvider>
  )
}

function AdminAccess() {
  const { status, errorMessage, signInWithGoogle, signInWithEmail, retryRoleCheck } = useAdminAuth()
  const location = useLocation()

  if (status === 'authorized') return <Outlet />
  if (status === 'forbidden') return <DeniedScreen />
  if (status === 'signed-out') {
    return (
      <AdminLoginScreen
        signInWithGoogle={signInWithGoogle}
        signInWithEmail={signInWithEmail}
        errorMessage={errorMessage}
      />
    )
  }
  if (status === 'unconfigured') {
    return (
      <AccessScreen
        title="Supabase setup required"
        description="The admin console cannot verify access until the public Supabase URL and publishable key are configured."
        actionLabel="Return to StudyX"
        actionIcon={<ArrowLeft className="size-4" />}
        href="/"
      />
    )
  }
  if (status === 'error') {
    return (
      <AccessScreen
        title="Admin verification failed"
        description={errorMessage ?? 'The role check failed closed. No admin content was opened.'}
        actionLabel="Try again"
        actionIcon={<RefreshCw className="size-4" />}
        onAction={retryRoleCheck}
        secondaryHref="/"
      />
    )
  }

  if (status === 'loading' || status === 'checking-role') {
    return (
      <div className="grid min-h-dvh place-items-center bg-ink px-6 text-center">
        <div>
          <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-admin-wash text-admin-accent">
            <ShieldCheck className="size-7 animate-pulse" aria-hidden="true" />
          </span>
          <p className="mt-5 text-sm text-paper-dim">Verifying Super Admin access…</p>
        </div>
      </div>
    )
  }

  return <Navigate to="/admin" replace state={{ from: location.pathname }} />
}

/* ── Admin Login Screen with email + Google ── */
function AdminLoginScreen({
  signInWithGoogle,
  signInWithEmail,
  errorMessage,
}: {
  signInWithGoogle: () => void
  signInWithEmail: (email: string, password: string) => Promise<void>
  errorMessage: string | null
}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleEmailSignIn(e: FormEvent) {
    e.preventDefault()
    setLocalError(null)
    if (!email.trim() || !password) {
      setLocalError('Enter your admin email and password.')
      return
    }
    setLoading(true)
    try {
      await signInWithEmail(email.trim(), password)
    } catch {
      setLocalError('Invalid credentials. Only the Super Admin account can access this area.')
    } finally {
      setLoading(false)
    }
  }

  const displayError = localError ?? errorMessage

  return (
    <main className="grid min-h-dvh place-items-center bg-ink px-6 py-12">
      <section className="w-full max-w-md rounded-[1.5rem] border border-white/10 bg-ink-raised p-7 shadow-float sm:p-9">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-admin-wash text-admin-accent">
          <ShieldCheck className="size-7" aria-hidden="true" />
        </span>
        <h1 className="mt-6 text-center font-display text-2xl font-semibold tracking-tight text-paper">
          Super Admin Access
        </h1>
        <p className="mt-2 text-center text-sm leading-6 text-paper-dim">
          Sign in with your designated Super Admin account.
        </p>

        {/* Email form */}
        <form className="mt-7 grid gap-4" onSubmit={(e) => void handleEmailSignIn(e)}>
          <Input
            label="Admin email"
            type="email"
            autoComplete="email"
            placeholder="admin@yourdomain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail className="size-4" />}
            required
          />
          <Input
            label="Password"
            type={showPw ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="Admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock className="size-4" />}
            trailing={
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="text-paper-faint hover:text-paper transition-colors p-1 cursor-pointer"
                aria-label={showPw ? 'Hide password' : 'Show password'}
              >
                {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            }
            required
          />

          {displayError && (
            <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400" role="alert">
              {displayError}
            </p>
          )}

          <Button type="submit" fullWidth size="lg" icon={<LogIn className="size-4" />} disabled={loading}>
            {loading ? 'Verifying…' : 'Sign In as Admin'}
          </Button>
        </form>

        {/* Divider */}
        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-white/8" />
          <span className="text-xs font-medium text-paper-faint">or</span>
          <div className="h-px flex-1 bg-white/8" />
        </div>

        {/* Google fallback */}
        <Button variant="secondary" fullWidth onClick={signInWithGoogle} icon={<GoogleMark />}>
          Continue with Google
        </Button>

        <Link
          to="/"
          className="mt-6 flex items-center justify-center gap-2 text-sm text-paper-dim hover:text-paper transition-colors"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Return to StudyX
        </Link>
      </section>
    </main>
  )
}

function AccessScreen({
  title,
  description,
  actionLabel,
  actionIcon,
  onAction,
  href,
  secondaryHref,
}: {
  title: string
  description: string
  actionLabel: string
  actionIcon: React.ReactNode
  onAction?: () => void
  href?: string
  secondaryHref?: string
}) {
  return (
    <main className="grid min-h-dvh place-items-center bg-ink px-6 py-12">
      <section className="w-full max-w-md rounded-[1.5rem] border border-white/10 bg-ink-raised p-7 text-center shadow-float sm:p-9">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-admin-wash text-admin-accent">
          <ShieldCheck className="size-7" aria-hidden="true" />
        </span>
        <h1 className="mt-6 font-display text-3xl font-semibold tracking-tight text-paper">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-paper-dim">{description}</p>
        {href ? (
          <Link to={href} className="mt-7 inline-flex">
            <Button icon={actionIcon}>{actionLabel}</Button>
          </Link>
        ) : onAction ? (
          <Button className="mt-7" icon={actionIcon} onClick={onAction}>
            {actionLabel}
          </Button>
        ) : null}
        {(secondaryHref || !href) && (
          <Link
            to={secondaryHref ?? '/'}
            className="mt-5 inline-flex items-center gap-2 text-sm text-paper-dim hover:text-paper"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Return to StudyX
          </Link>
        )}
      </section>
    </main>
  )
}

function DeniedScreen() {
  return (
    <main className="grid min-h-dvh place-items-center bg-ink px-6 py-12">
      <section className="w-full max-w-md rounded-[1.5rem] border border-admin-pink/30 bg-ink-raised p-7 text-center shadow-float sm:p-9">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-admin-pink-wash text-admin-pink">
          <AlertTriangle className="size-7" aria-hidden="true" />
        </span>
        <h1 className="mt-6 font-display text-3xl font-semibold tracking-tight text-paper">Access denied</h1>
        <p className="mt-3 text-sm leading-6 text-paper-dim">
          This account is not configured as the StudyX Super Admin. Only the designated admin account can access this area.
        </p>
        <Link to="/app" className="mt-7 inline-flex">
          <Button variant="secondary" icon={<ArrowLeft className="size-4" />}>
            Back to StudyX
          </Button>
        </Link>
      </section>
    </main>
  )
}

function GoogleMark() {
  return (
    <span aria-hidden="true" className="grid size-5 place-items-center rounded-full bg-white text-xs font-bold text-sky">
      G
    </span>
  )
}
