import { Reveal, Stagger, StaggerItem } from '@/components/landing/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'

const steps = [
  {
    step: '01',
    title: 'Find',
    body: 'Search across notes, books, papers and question banks — filtered to your own college, branch and semester.',
  },
  {
    step: '02',
    title: 'Study & Understand',
    body: 'Open a resource, then use Simple Explanation or Text Translator when a concept will not click.',
  },
  {
    step: '03',
    title: 'Practice & Prepare',
    body: 'Generate quizzes, flashcards and a day-by-day study plan, then review repeated questions before the exam.',
  },
  {
    step: '04',
    title: 'Share',
    body: 'Submit your own material once. It reaches the students who actually need it — never as a raw link.',
  },
]

/** The four-step "how StudyX works" band. */
export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-y border-white/[0.07] bg-ink-raised/50 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="How StudyX works"
            title="Four steps from stuck to prepared"
            description="The same loop every semester — without hunting through five group chats for one PDF."
          />
        </Reveal>

        <Stagger className="relative mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Connector line behind the steps (desktop only) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-7 right-8 left-8 hidden h-px bg-gradient-to-r from-transparent via-white/15 to-transparent lg:block"
          />

          {steps.map((s) => (
            <StaggerItem key={s.step} className="relative">
              <div className="flex h-full flex-col gap-4">
                <span className="relative z-10 grid size-14 place-items-center rounded-2xl border border-sky/30 bg-ink font-display text-base font-semibold text-sky shadow-[0_8px_24px_rgba(0,0,0,0.4)]">
                  {s.step}
                </span>
                <h3 className="font-display text-lg font-semibold text-paper">{s.title}</h3>
                <p className="text-sm leading-6 text-paper-dim">{s.body}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
