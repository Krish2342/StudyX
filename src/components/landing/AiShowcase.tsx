import { motion } from 'motion/react'
import {
  ArrowRight,
  Brain,
  CalendarDays,
  ClipboardList,
  FileText,
  Languages,
  Layers,
  Lightbulb,
  PenLine,
  TrendingUp,
  Zap,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Reveal, Stagger, StaggerItem } from '@/components/landing/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const iconMap: Record<string, typeof Brain> = {
  PenLine,
  Zap,
  Brain,
  Languages,
  FileText,
  ClipboardList,
  Layers,
  Lightbulb,
  CalendarDays,
  TrendingUp,
}

/** AI tools showcase - available tools and honest feature guidance. */
export function AiShowcase() {
  const reduced = useReducedMotion()
  const availableTools = [
    { id: 'explain', name: 'Simple Explanation', description: 'Re-explain a hard concept in clear, focused language.', icon: 'Lightbulb' },
    { id: 'translate', name: 'Text Translator', description: 'Translate study text between supported languages.', icon: 'Languages' },
  ]
  const rail = [...availableTools, ...availableTools]

  return (
    <section id="ai-tools" className="relative overflow-hidden border-y border-white/7 bg-ink-raised/50 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="AI study tools"
            title="Tools that help you understand your studies"
            description="Start with focused explanations and text translation. Additional study tools are being prepared."
          />
        </Reveal>
      </div>

      {/* Marquee rail */}
      <div className="relative mt-14 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
        <motion.div
          className="flex w-max gap-3 pl-4"
          animate={reduced ? undefined : { x: ['0%', '-50%'] }}
          transition={{ duration: 46, repeat: Infinity, ease: 'linear' }}
        >
          {rail.map((tool, i) => {
            const Icon = tool.icon === 'Languages' ? Languages : iconMap[tool.icon] ?? Brain
            return (
              <div
                key={`${tool.id}-${i}`}
                className="group flex w-64 shrink-0 flex-col gap-3 rounded-2xl border border-white/9 bg-ink-raised p-5 transition-colors duration-200 hover:border-sky/35 surface-lit"
                aria-hidden={i >= availableTools.length}
              >
                <span className="grid size-10 place-items-center rounded-xl bg-sky-wash text-sky transition-colors group-hover:bg-sky group-hover:text-ink">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span className="font-display text-[15px] font-semibold text-paper">{tool.name}</span>
                <span className="text-[13px] leading-5 text-paper-faint">{tool.description}</span>
                <span className="mt-auto flex items-center gap-1.5 pt-1 text-[12px] font-medium text-sky opacity-0 transition-opacity group-hover:opacity-100">
                  Open tool <ArrowRight className="size-3.5" aria-hidden="true" />
                </span>
              </div>
            )
          })}
        </motion.div>
      </div>

      {/* Feature trio underneath */}
      <div className="mx-auto mt-16 grid max-w-7xl gap-4 px-5 sm:px-8 md:grid-cols-3">
        <Stagger className="contents">
          {[
            {
              title: 'Exam-ready answers',
              body: 'Point-wise answers shaped the way markers award marks â€” 2, 4, 5, 7 or 10.',
              icon: Zap,
            },
            {
              title: 'Three languages',
              body: 'Output in English, Hindi or Gujarati, for text and full documents.',
              icon: Languages,
            },
            {
              title: 'Study guidance, not guarantees',
              body: 'Paper prediction highlights repeated topics. It never claims to know your exam.',
              icon: TrendingUp,
            },
          ].map((f) => (
            <StaggerItem key={f.title}>
              <div className="h-full rounded-2xl border border-white/9 bg-ink-raised p-6">
                <f.icon className="mb-4 size-5 text-sky" aria-hidden="true" />
                <h3 className="mb-2 font-display text-base font-semibold text-paper">{f.title}</h3>
                <p className="text-sm leading-6 text-paper-dim">{f.body}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>

      <Reveal delay={0.1} className="mt-12 flex justify-center">
        <Link
          to="/app/ai"
          className="inline-flex items-center gap-2 rounded-full border border-white/12 px-6 py-3 text-sm font-medium text-paper transition-colors hover:border-sky/50 hover:bg-sky-wash"
        >
          Explore AI tools
          <ArrowRight className="size-4 text-sky" aria-hidden="true" />
        </Link>
      </Reveal>
    </section>
  )
}
