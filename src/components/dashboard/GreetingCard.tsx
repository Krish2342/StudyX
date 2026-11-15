import { motion } from 'motion/react'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { demoStats } from '@/data/dashboard'
import { demoStudent } from '@/data/student'
import { Stagger, StaggerItem } from '@/components/landing/Reveal'
import { Card } from '@/components/ui/Card'
import { useReducedMotion } from '@/hooks/useReducedMotion'

function greeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

/** Hero card of the dashboard: greeting, academic info and headline stats. */
export function GreetingCard() {
  const reduced = useReducedMotion()

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
              {demoStudent.name} 👋
            </h1>
            <p className="mt-2 text-sm leading-6 text-paper-dim">
              {demoStudent.branch} · Semester {demoStudent.semester}
              <span className="mx-2 text-paper-faint">|</span>
              {demoStudent.college}
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
          {demoStats.map((s) => (
            <StaggerItem key={s.label}>
              <motion.div
                whileHover={reduced ? undefined : { y: -2 }}
                className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-3.5"
              >
                <p className="font-display text-xl font-semibold tabular-nums text-paper">{s.value}</p>
                <p className="mt-0.5 truncate text-[11px] text-paper-faint">{s.label}</p>
                <p className="mt-1 text-[10px] font-medium text-sky">{s.delta}</p>
              </motion.div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Card>
  )
}
