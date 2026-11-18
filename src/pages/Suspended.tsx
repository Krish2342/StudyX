import { LogOut, ShieldAlert } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/features/auth/useAuth'

export function Suspended() {
  const { signOut } = useAuth()
  const navigate = useNavigate()
  return (
    <main className="grid min-h-dvh place-items-center bg-ink px-5 py-12 text-center">
      <section className="max-w-md">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl border border-sky/30 bg-sky-wash text-sky">
          <ShieldAlert className="size-7" aria-hidden="true" />
        </span>
        <h1 className="mt-6 font-display text-3xl font-semibold text-paper">Account access paused</h1>
        <p className="mt-3 text-sm leading-6 text-paper-dim">
          This account has been suspended. Contact StudyX support if you believe this is a mistake.
        </p>
        <div className="mt-7 flex justify-center gap-3">
          <Link to="/">
            <Button variant="secondary">Return home</Button>
          </Link>
          <Button
            icon={<LogOut className="size-4" />}
            onClick={() => void signOut().then(() => navigate('/login', { replace: true }))}
          >
            Sign out
          </Button>
        </div>
      </section>
    </main>
  )
}
