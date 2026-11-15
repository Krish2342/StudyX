import { motion } from 'motion/react'
import { ChevronRight, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'
import { demoContinue } from '@/data/dashboard'
import { Card } from '@/components/ui/Card'
import { useReducedMotion } from '@/hooks/useReducedMotion'

/** "Continue Studying" — progress bars for in-flight topics. */
export function ContinueCard() {
  const reduced = useReducedMotion()

  return (
    <Card className="md:col-span-2 lg:col-span-2">
      <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4">
        <h2 className="font-display text-[15px] font-semibold text-paper">Continue studying</h2>
        <Link
          to="/app/study-space"
          className="flex items-center gap-0.5 text-xs font-medium text-sky hover:underline"
        >
          My space <ChevronRight className="size-3.5" aria-hidden="true" />
        </Link>
      </div>

      <ul className="flex flex-col gap-1 p-2.5">
        {demoContinue.map((item) => (
          <li key={item.id}>
            <Link
              to="/app/explore"
              className="group flex items-center gap-4 rounded-xl px-3 py-3 transition-colors hover:bg-white/[0.05]"
            >
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-paper">{item.title}</span>
                <span className="mt-0.5 flex items-center gap-1.5 text-[11px] text-paper-faint">
                  {item.subject}
                  <span aria-hidden="true">·</span>
                  <Clock className="size-3" aria-hidden="true" />
                  {item.lastSeen}
                </span>
              </span>

              <span className="w-24 shrink-0 sm:w-32">
                <span className="mb-1 flex justify-between text-[10px] text-paper-faint">
                  <span className="sr-only">Progress</span>
                  <span className="tabular-nums">{item.progress}%</span>
                </span>
                <span
                  className="block h-1.5 w-full overflow-hidden rounded-full bg-white/[0.09]"
                  role="progressbar"
                  aria-valuenow={item.progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${item.title} progress`}
                >
                  <motion.span
                    className="block h-full rounded-full bg-sky"
                    initial={reduced ? false : { width: 0 }}
                    whileInView={{ width: `${item.progress}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  />
                </span>
              </span>

              <ChevronRight
                className="size-4 shrink-0 text-paper-faint transition-colors group-hover:text-sky"
                aria-hidden="true"
              />
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  )
}
