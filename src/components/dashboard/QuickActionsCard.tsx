import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { quickActions } from '@/components/navigation/navConfig'
import { Card } from '@/components/ui/Card'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { motion } from 'motion/react'

/** Four one-tap shortcuts Ã¢â‚¬â€ the "Quick actions" bento tile. */
export function QuickActionsCard({ className = '' }: { className?: string }) {
  const reduced = useReducedMotion()

  return (
    <Card interactive={false} className={className}>
      <div className="border-b border-white/7 px-5 py-4">
        <h2 className="font-display text-[15px] font-semibold text-paper">Quick actions</h2>
      </div>

      <ul className="grid grid-cols-1 gap-2 p-3 sm:grid-cols-2">
        {quickActions.map((action) => (
          <li key={action.label}>
            <motion.div whileHover={reduced ? undefined : { x: 3 }} transition={{ type: 'spring', stiffness: 400, damping: 30 }}>
              <Link
                to={action.path}
                className="group flex items-center gap-3 rounded-xl border border-white/7 bg-white/2.5 px-3.5 py-3 transition-colors hover:border-sky/35 hover:bg-sky-wash"
              >
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-white/6 text-paper-dim transition-colors group-hover:bg-sky group-hover:text-ink">
                  <action.icon className="size-4" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-medium text-paper">{action.label}</span>
                  <span className="block truncate text-[11px] text-paper-faint">{action.hint}</span>
                </span>
                <ArrowUpRight
                  className="size-4 shrink-0 text-paper-faint opacity-0 transition-opacity group-hover:opacity-100"
                  aria-hidden="true"
                />
              </Link>
            </motion.div>
          </li>
        ))}
      </ul>
    </Card>
  )
}
