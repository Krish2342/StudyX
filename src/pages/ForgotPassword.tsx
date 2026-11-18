import { useState, type FormEvent } from 'react'
import { ArrowLeft, Mail, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuth } from '@/features/auth/useAuth'

export function ForgotPassword() {
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setErrorMessage(null)
    if (!email.trim()) { setErrorMessage('Please enter your email address.'); return }
    setLoading(true)
    try {
      await resetPassword(email.trim())
      setSent(true)
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Unable to send reset email. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-dvh bg-ink px-5 py-8 sm:px-8">
      <div className="mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-md items-center justify-center">
        <div className="w-full rounded-3xl border border-white/10 bg-ink-raised p-8 shadow-float sm:p-10">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5" aria-label="StudyX home">
            <span className="grid size-9 place-items-center rounded-lg bg-sky font-display text-base font-bold text-ink">S</span>
            <span className="font-display text-xl font-semibold text-paper">StudyX</span>
          </Link>

          {sent ? (
            /* ── Success state ── */
            <div className="mt-10 text-center">
              <span className="grid size-16 place-items-center rounded-2xl bg-sky-wash text-sky mx-auto">
                <ShieldCheck className="size-8" aria-hidden="true" />
              </span>
              <h1 className="mt-6 font-display text-2xl font-semibold text-paper">Check your email</h1>
              <p className="mt-3 text-sm leading-6 text-paper-dim">
                We sent a password reset link to{' '}
                <strong className="text-paper">{email}</strong>.
                Follow the link to choose a new password.
              </p>
              <p className="mt-4 text-xs text-paper-faint">
                Didn't receive it? Check your spam folder or{' '}
                <button
                  type="button"
                  className="text-sky hover:text-sky-bright cursor-pointer transition-colors"
                  onClick={() => { setSent(false); setEmail('') }}
                >
                  try again
                </button>.
              </p>
              <div className="mt-8">
                <Link to="/login">
                  <Button variant="secondary" fullWidth icon={<ArrowLeft className="size-4" />}>
                    Back to Sign In
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            /* ── Form state ── */
            <>
              <div className="mt-10">
                <span className="grid size-12 place-items-center rounded-2xl bg-sky-wash text-sky">
                  <Mail className="size-6" aria-hidden="true" />
                </span>
                <h1 className="mt-6 font-display text-2xl font-semibold text-paper">Reset your password</h1>
                <p className="mt-2 text-sm leading-6 text-paper-dim">
                  Enter the email you used to sign up and we'll send you a reset link.
                </p>
              </div>

              <form className="mt-8 grid gap-5" onSubmit={(e) => void handleSubmit(e)}>
                <Input
                  label="Email address"
                  type="email"
                  autoComplete="email"
                  placeholder="you@college.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  icon={<Mail className="size-4" />}
                  required
                />

                {errorMessage && (
                  <p className="rounded-xl border border-sky/30 bg-sky-wash px-4 py-3 text-sm text-sky" role="alert">
                    {errorMessage}
                  </p>
                )}

                <Button type="submit" size="lg" fullWidth disabled={loading}>
                  {loading ? 'Sending…' : 'Send Reset Link'}
                </Button>

                <Link to="/login" className="flex items-center justify-center gap-1.5 text-sm text-paper-dim hover:text-paper transition-colors">
                  <ArrowLeft className="size-4" />
                  Back to Sign In
                </Link>
              </form>
            </>
          )}
        </div>
      </div>
    </main>
  )
}

