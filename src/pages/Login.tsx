import { useState, type FormEvent } from 'react'
import { CheckCircle2, Eye, EyeOff, GraduationCap, Lock, Mail, ShieldCheck, User } from 'lucide-react'
import { Link, Navigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuth } from '@/features/auth/useAuth'

type Tab = 'signin' | 'signup'

export function Login() {
  const { status, errorMessage, signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth()
  const [tab, setTab] = useState<Tab>('signin')

  // Sign-in state
  const [signInEmail, setSignInEmail] = useState('')
  const [signInPassword, setSignInPassword] = useState('')
  const [showSignInPw, setShowSignInPw] = useState(false)
  const [signInError, setSignInError] = useState<string | null>(null)
  const [signingIn, setSigningIn] = useState(false)

  // Sign-up state
  const [signUpName, setSignUpName] = useState('')
  const [signUpEmail, setSignUpEmail] = useState('')
  const [signUpPassword, setSignUpPassword] = useState('')
  const [signUpConfirm, setSignUpConfirm] = useState('')
  const [showSignUpPw, setShowSignUpPw] = useState(false)
  const [signUpError, setSignUpError] = useState<string | null>(null)
  const [signingUp, setSigningUp] = useState(false)
  const [verificationSent, setVerificationSent] = useState(false)

  if (status === 'authenticated') return <Navigate to="/app" replace />
  if (status === 'needs-profile') return <Navigate to="/onboarding" replace />
  if (status === 'suspended') return <Navigate to="/suspended" replace />

  const isUnavailable = status === 'unconfigured'

  /* ── Sign In ── */
  async function handleSignIn(e: FormEvent) {
    e.preventDefault()
    setSignInError(null)
    if (!signInEmail.trim() || !signInPassword) {
      setSignInError('Please enter your email and password.')
      return
    }
    setSigningIn(true)
    try {
      await signInWithEmail(signInEmail.trim(), signInPassword)
    } catch {
      setSignInError('Incorrect email or password. Please try again.')
    } finally {
      setSigningIn(false)
    }
  }

  /* ── Sign Up ── */
  async function handleSignUp(e: FormEvent) {
    e.preventDefault()
    setSignUpError(null)

    if (!signUpName.trim()) { setSignUpError('Please enter your full name.'); return }
    if (!signUpEmail.trim()) { setSignUpError('Please enter your email address.'); return }
    if (signUpPassword.length < 8) { setSignUpError('Password must be at least 8 characters.'); return }
    if (signUpPassword !== signUpConfirm) { setSignUpError('Passwords do not match.'); return }

    setSigningUp(true)
    try {
      const { needsVerification } = await signUpWithEmail(signUpEmail.trim(), signUpPassword, signUpName.trim())
      if (needsVerification) setVerificationSent(true)
    } catch (err) {
      setSignUpError(err instanceof Error ? err.message : 'Sign-up failed. Please try again.')
    } finally {
      setSigningUp(false)
    }
  }

  return (
    <main className="min-h-dvh bg-ink px-5 py-8 sm:px-8">
      <div className="mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-3xl border border-white/10 bg-ink-raised shadow-float lg:grid-cols-[1.05fr_0.95fr]">

          {/* ── Left panel (desktop only) ── */}
          <section className="hidden flex-col justify-between bg-sky p-10 text-ink lg:flex xl:p-14">
            <Link to="/" className="flex items-center gap-2.5" aria-label="StudyX home">
              <span className="grid size-9 place-items-center rounded-lg bg-ink font-display text-base font-bold text-paper">S</span>
              <span className="font-display text-xl font-semibold">StudyX</span>
            </Link>
            <div>
              <p className="text-sm font-semibold tracking-[0.16em] uppercase">Study with direction</p>
              <h1 className="mt-5 max-w-lg font-display text-5xl font-semibold tracking-tight">
                Find the right material. Make it yours.
              </h1>
              <p className="mt-6 max-w-md text-base leading-7 text-ink/70">
                Sign in or create an account to access your college resources, notes, and study tools in one focused workspace.
              </p>
            </div>
            <ul className="grid gap-3 text-sm text-ink/70">
              {[
                'Personalised resources for your college & branch',
                'Your study history stays with your account',
                'No ads, no distractions — just focused study',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5">
                  <CheckCircle2 className="size-4 shrink-0 text-ink" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* ── Right panel ── */}
          <section className="p-6 sm:p-10 lg:p-12">
            {/* Mobile logo */}
            <Link to="/" className="flex items-center gap-2.5 lg:hidden" aria-label="StudyX home">
              <span className="grid size-9 place-items-center rounded-lg bg-sky font-display text-base font-bold text-ink">S</span>
              <span className="font-display text-xl font-semibold text-paper">StudyX</span>
            </Link>

            <div className="mt-10 lg:mt-0">
              <span className="grid size-12 place-items-center rounded-2xl bg-sky-wash text-sky">
                <GraduationCap className="size-6" aria-hidden="true" />
              </span>
              <h2 className="mt-6 font-display text-3xl font-semibold tracking-tight text-paper">
                {tab === 'signin' ? 'Welcome back' : 'Create your account'}
              </h2>
              <p className="mt-2 text-sm leading-6 text-paper-dim">
                {tab === 'signin'
                  ? 'Sign in to continue to your study workspace.'
                  : 'Join StudyX and access resources tailored for your studies.'}
              </p>
            </div>

            {/* ── Tabs ── */}
            <div className="mt-8 flex rounded-xl border border-white/10 bg-white/4 p-1">
              {(['signin', 'signup'] as Tab[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => { setTab(t); setSignInError(null); setSignUpError(null) }}
                  className={[
                    'flex-1 rounded-lg py-2 text-sm font-semibold transition-all duration-150 cursor-pointer',
                    tab === t
                      ? 'bg-sky text-ink shadow'
                      : 'text-paper-dim hover:text-paper',
                  ].join(' ')}
                >
                  {t === 'signin' ? 'Sign In' : 'Sign Up'}
                </button>
              ))}
            </div>

            {isUnavailable && (
              <p className="mt-4 rounded-xl border border-sky/30 bg-sky-wash px-4 py-3 text-sm text-sky" role="alert">
                Authentication is unavailable — Supabase is not configured for this environment.
              </p>
            )}

            {/* ── Google button ── */}
            {!isUnavailable && (
              <>
                <Button
                  className="mt-6 w-full"
                  size="lg"
                  variant="secondary"
                  onClick={() => void signInWithGoogle(tab === 'signup', tab === 'signup' ? signUpName : '')}
                  icon={<GoogleMark />}
                >
                  Continue with Google
                </Button>

                <div className="my-6 flex items-center gap-3">
                  <div className="h-px flex-1 bg-white/8" />
                  <span className="text-xs font-medium text-paper-faint">or use email</span>
                  <div className="h-px flex-1 bg-white/8" />
                </div>
              </>
            )}

            {/* ── SIGN IN form ── */}
            {tab === 'signin' && !isUnavailable && (
              <form className="grid gap-4" onSubmit={(e) => void handleSignIn(e)}>
                <Input
                  label="Email address"
                  type="email"
                  autoComplete="email"
                  placeholder="you@college.edu"
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  icon={<Mail className="size-4" />}
                  required
                />
                <Input
                  label="Password"
                  type={showSignInPw ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Your password"
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  icon={<Lock className="size-4" />}
                  trailing={
                    <button
                      type="button"
                      onClick={() => setShowSignInPw((v) => !v)}
                      className="text-paper-faint hover:text-paper transition-colors p-1 cursor-pointer"
                      aria-label={showSignInPw ? 'Hide password' : 'Show password'}
                    >
                      {showSignInPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  }
                  required
                />

                <div className="flex justify-end">
                  <Link
                    to="/forgot-password"
                    className="text-xs text-sky hover:text-sky-bright transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                {(signInError ?? errorMessage) && (
                  <p className="rounded-xl border border-sky/30 bg-sky-wash px-4 py-3 text-sm text-sky" role="alert">
                    {signInError ?? errorMessage}
                  </p>
                )}

                <Button type="submit" size="lg" fullWidth disabled={signingIn}>
                  {signingIn ? 'Signing in…' : 'Sign In'}
                </Button>

                <p className="text-center text-xs text-paper-faint">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    className="text-sky hover:text-sky-bright cursor-pointer transition-colors"
                    onClick={() => setTab('signup')}
                  >
                    Sign up free
                  </button>
                </p>
              </form>
            )}

            {/* ── SIGN UP form ── */}
            {tab === 'signup' && !isUnavailable && (
              <>
                {verificationSent ? (
                  <div className="mt-2 rounded-2xl border border-sky/30 bg-sky-wash px-6 py-8 text-center">
                    <span className="grid size-14 place-items-center rounded-2xl bg-sky/10 text-sky mx-auto">
                      <ShieldCheck className="size-7" />
                    </span>
                    <h3 className="mt-5 font-display text-xl font-semibold text-paper">Check your email</h3>
                    <p className="mt-2 text-sm leading-6 text-paper-dim">
                      We sent a verification link to <strong className="text-paper">{signUpEmail}</strong>.
                      Click it to activate your account.
                    </p>
                    <p className="mt-4 text-xs text-paper-faint">
                      Didn't receive it? Check spam or{' '}
                      <button
                        type="button"
                        className="text-sky hover:text-sky-bright cursor-pointer transition-colors"
                        onClick={() => { setVerificationSent(false); setSignUpError(null) }}
                      >
                        try again
                      </button>.
                    </p>
                  </div>
                ) : (
                  <form className="grid gap-4" onSubmit={(e) => void handleSignUp(e)}>
                    <Input
                      label="Full name"
                      type="text"
                      autoComplete="name"
                      placeholder="Krish Patel"
                      value={signUpName}
                      onChange={(e) => setSignUpName(e.target.value)}
                      icon={<User className="size-4" />}
                      required
                    />
                    <Input
                      label="Email address"
                      type="email"
                      autoComplete="email"
                      placeholder="you@college.edu"
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                      icon={<Mail className="size-4" />}
                      required
                    />
                    <Input
                      label="Password"
                      type={showSignUpPw ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="Minimum 8 characters"
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      icon={<Lock className="size-4" />}
                      hint="At least 8 characters"
                      trailing={
                        <button
                          type="button"
                          onClick={() => setShowSignUpPw((v) => !v)}
                          className="text-paper-faint hover:text-paper transition-colors p-1 cursor-pointer"
                          aria-label={showSignUpPw ? 'Hide password' : 'Show password'}
                        >
                          {showSignUpPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                      }
                      required
                    />
                    <Input
                      label="Confirm password"
                      type={showSignUpPw ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="Re-enter your password"
                      value={signUpConfirm}
                      onChange={(e) => setSignUpConfirm(e.target.value)}
                      icon={<Lock className="size-4" />}
                      required
                    />

                    {signUpError && (
                      <p className="rounded-xl border border-sky/30 bg-sky-wash px-4 py-3 text-sm text-sky" role="alert">
                        {signUpError}
                      </p>
                    )}

                    <Button type="submit" size="lg" fullWidth disabled={signingUp}>
                      {signingUp ? 'Creating account…' : 'Create Account'}
                    </Button>

                    <p className="text-center text-xs text-paper-faint">
                      Already have an account?{' '}
                      <button
                        type="button"
                        className="text-sky hover:text-sky-bright cursor-pointer transition-colors"
                        onClick={() => setTab('signin')}
                      >
                        Sign in
                      </button>
                    </p>

                    <p className="text-center text-xs leading-5 text-paper-faint">
                      By creating an account you agree to our{' '}
                      <span className="text-paper-dim">Terms of Service</span> and{' '}
                      <span className="text-paper-dim">Privacy Policy</span>.
                    </p>
                  </form>
                )}
              </>
            )}
          </section>
        </div>
      </div>
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
