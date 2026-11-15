import { Compass, FileText, GraduationCap, ShieldCheck, Users } from 'lucide-react'
import type { ReactNode } from 'react'
import { Reveal, Stagger, StaggerItem } from '@/components/landing/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Badge } from '@/components/ui/Badge'

/**
 * Bento feature grid — deliberately varied card sizes so the layout
 * never reads as a row of identical boxes.
 */
export function BentoFeatures() {
  return (
    <section id="features" className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Why StudyX"
            title="Built for the whole study loop"
            description="Find → study → understand → practice → prepare → share, all inside one focused dark workspace."
          />
        </Reveal>

        <Stagger className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-3 md:grid-rows-5">
          {/* Wide — resource library */}
          <StaggerItem className="md:col-span-2 md:row-span-3">
            <BentoCard
              icon={Compass}
              title="A library that knows your syllabus"
              body="Notes, books, previous year papers, question banks, lab manuals and PPTs — filtered by your college, branch and semester, so nothing irrelevant ever appears."
              badge="10 categories"
              tall
            >
              <div className="mt-auto flex flex-wrap gap-2 pt-4">
                {['Notes', 'PYQs', 'Question Banks', 'Lab Manuals', 'PPTs', 'Assignments'].map((c) => (
                  <Badge key={c}>{c}</Badge>
                ))}
              </div>
            </BentoCard>
          </StaggerItem>

          {/* Tall — AI tools */}
          <StaggerItem className="md:row-span-4">
            <BentoCard
              icon={GraduationCap}
              title="AI that fits how you're examined"
              body="Choose your source, your marks and your output language — then generate, copy, save or regenerate."
              badge="13 tools"
              tall
            >
              <ul className="mt-5 space-y-2.5">
                {['Exam Ready Answer', 'Quiz Generator', 'AI Study Plan', 'Weak Topic Detection', 'Summary Generator'].map(
                  (t) => (
                    <li key={t} className="flex items-center gap-2.5 text-[13px] text-paper-dim">
                      <span className="size-1.5 shrink-0 rounded-full bg-sky" aria-hidden="true" />
                      {t}
                    </li>
                  ),
                )}
              </ul>
            </BentoCard>
          </StaggerItem>

          {/* Small — community */}
          <StaggerItem>
            <BentoCard icon={Users} title="Ask, don't scroll" body="Discussions filtered by subject — no noise." />
          </StaggerItem>

          {/* Small — sharing */}
          <StaggerItem>
            <BentoCard icon={FileText} title="Share once, help many" body="Submit a Drive link; students get a clean card, never a raw URL." />
          </StaggerItem>

          {/* Wide bottom — trust */}
          <StaggerItem className="md:col-span-2">
            <BentoCard
              icon={ShieldCheck}
              title="Calm by design"
              body="No feeds, no streaks, no leaderboards. A focused dark workspace with one accent colour used only where it matters."
              badge="Dark first"
            />
          </StaggerItem>
        </Stagger>
      </div>
    </section>
  )
}

function BentoCard({
  icon: Icon,
  title,
  body,
  badge,
  tall,
  children,
}: {
  icon: typeof Compass
  title: string
  body: string
  badge?: string
  tall?: boolean
  children?: ReactNode
}) {
  return (
    <div
      className={[
        'group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-card)]',
        'border border-white/[0.09] bg-ink-raised p-6',
        'shadow-[0_1px_2px_rgba(0,0,0,0.45),0_16px_40px_rgba(0,0,0,0.3)]',
        'transition-[transform,border-color] duration-300 ease-out-expo hover:-translate-y-1 hover:border-sky/30',
        'surface-lit',
        tall ? 'min-h-64' : 'min-h-44',
      ].join(' ')}
    >
      {/* Layered depth plate that shifts on hover */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-16 -right-16 size-48 rounded-full bg-sky/[0.07] opacity-60 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
      />
      <span className="relative mb-4 grid size-10 place-items-center rounded-xl bg-sky-wash text-sky">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <h3 className="relative font-display text-lg font-semibold text-paper">{title}</h3>
      <p className="relative mt-2 text-sm leading-6 text-paper-dim">{body}</p>
      {children}
      {badge && (
        <span className="absolute top-5 right-5 rounded-full border border-white/12 px-2.5 py-0.5 text-[11px] font-medium text-paper-faint">
          {badge}
        </span>
      )}
    </div>
  )
}
