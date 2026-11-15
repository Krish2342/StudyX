import { ArrowRight, Brain, CalendarDays, ClipboardList, FileText, Layers, Lightbulb, PenLine, TrendingUp, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'
import { demoAiTools } from '@/data/dashboard'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

const iconMap: Record<string, typeof Brain> = {
  PenLine,
  Zap,
  Brain,
  FileText,
  ClipboardList,
  Layers,
  Lightbulb,
  CalendarDays,
  TrendingUp,
}

/** AI Study Tools — a compact grid of the most-used tools. */
export function AiToolsCard() {
  const featured = demoAiTools.slice(0, 6)

  return (
    <Card className="md:col-span-2 lg:col-span-2">
      <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4">
        <h2 className="flex items-center gap-2 font-display text-[15px] font-semibold text-paper">
          <Sparkle className="size-4 text-sky" /> AI study tools
        </h2>
        <Link to="/app/ai" className="flex items-center gap-0.5 text-xs font-medium text-sky hover:underline">
          All 13 <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-2.5 p-3.5">
        {featured.map((tool) => {
          const Icon = iconMap[tool.icon] ?? Brain
          return (
            <Link
              key={tool.id}
              to="/app/ai"
              className="group flex flex-col gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] p-3.5 transition-[border-color,background-color] duration-200 hover:border-sky/35 hover:bg-sky-wash"
            >
              <span className="flex items-center justify-between">
                <span className="grid size-8 place-items-center rounded-lg bg-sky-wash text-sky transition-colors group-hover:bg-sky group-hover:text-ink">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                <ArrowRight
                  className="size-3.5 text-paper-faint opacity-0 transition-opacity group-hover:opacity-100"
                  aria-hidden="true"
                />
              </span>
              <span className="text-[13px] leading-4 font-medium text-paper">{tool.name}</span>
            </Link>
          )
        })}
      </div>

      <div className="flex items-center justify-between border-t border-white/[0.07] px-5 py-3">
        <Badge tone="accent" dot>
          AI study tools
        </Badge>
        <span className="text-[11px] text-paper-faint">13 tools</span>
      </div>
    </Card>
  )
}

function Sparkle({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2l1.9 5.6L19.5 9.5 13.9 11.4 12 17l-1.9-5.6L4.5 9.5l5.6-1.9L12 2z" />
    </svg>
  )
}
