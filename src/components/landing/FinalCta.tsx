import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Reveal } from '@/components/landing/Reveal'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/hooks/useToast'

/** Final conversion band before the footer. */
export function FinalCta() {
  const { toast } = useToast()

  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <div className="glow-sky relative overflow-hidden rounded-[1.75rem] border border-white/[0.1] bg-ink-raised px-6 py-16 text-center sm:px-12">
            {/* Perspective floor grid — subtle depth, CSS only */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-40 [background-image:linear-gradient(rgba(141,185,240,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(141,185,240,0.16)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:linear-gradient(to_top,#000,transparent)] [transform:perspective(420px)_rotateX(58deg)] origin-bottom"
            />

            <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-6">
              <h2 className="font-display text-3xl font-semibold tracking-tight text-paper sm:text-5xl">
                Your next exam starts with one search.
              </h2>
              <p className="text-base leading-7 text-paper-dim sm:text-lg">
                Join the students already using StudyX to find material faster, understand hard topics
                and walk into exams prepared.
              </p>

              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                <Link to="/app" className="w-full sm:w-auto">
                  <Button size="lg" fullWidth icon={<ArrowRight className="size-4.5" />}>
                    Get started — it's free
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="secondary"
                  fullWidth
                  onClick={() => toast('The product tour is coming soon.', 'info')}
                >
                  Watch 60-second tour
                </Button>
              </div>

              <p className="text-xs text-paper-faint">
                Takes less than a minute · No credit card required
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
