import { motion } from 'motion/react'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Stagger, StaggerItem } from '@/components/landing/Reveal'
import { Card } from '@/components/ui/Card'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useAuth } from '@/features/auth/useAuth'

function greeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

/** Hero card of the dashboard: greeting, academic info and headline stats. */
export function GreetingCard() {
  const reduced = useReducedMotion()
  const { profile } = useAuth()
  const name = profile?.full_name ?? 'Student'
  const branch = profile?.branch?.name ?? 'Complete your profile'
  const semester = profile?.semester?.number
  const college = profile?.college?.name ?? 'StudyX workspace'

  return (
    <Card interactive={false} className="md:col-span-2 lg:col-span-3">
      <div className="glow-sky pointer-events-none absolute inset-x-0 top-0 h-40" aria-hidden="true" />

      <div className="relative flex flex-col gap-6 p-6 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-sky uppercase">
              {greeting()}
            </p>
            <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-paper sm:text-3xl">
              {name} 👋
            </h1>
            <p className="mt-2 text-sm leading-6 text-paper-dim">
              {branch}{semester ? ` · Semester ${semester}` : ''}
              <span className="mx-2 text-paper-faint">|</span>
              {college}
            </p>
          </div>

          <Link
            to="/app/ai"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-sky px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-sky-bright"
          >
            <Sparkles className="size-4" aria-hidden="true" />
            Ask StudyX AI
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>

        <Stagger className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            ['Your college', college],
            ['Your branch', branch],
            ['Semester', semester ? `Semester ${semester}` : 'Not set'],
            ['Account', 'Active'],
          ].map(([value, label]) => (
            <StaggerItem key={label}>
              <motion.div whileHover={reduced ? undefined : { y: -2 }} className="rounded-xl border border-white/10 bg-white/5 p-3.5">
                <p className="truncate text-sm font-semibold text-paper">{value}</p>
                <p className="mt-1 text-[11px] text-paper-faint">{label}</p>
              </motion.div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Card>
  )
}
