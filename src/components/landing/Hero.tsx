import { motion } from 'motion/react'
import { ArrowRight, Play, Search, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Reveal } from '@/components/landing/Reveal'
import { useReducedMotion } from '@/hooks/useReducedMotion'

/**
 * Hero with a CSS-perspective floating panel.
 * The 3D tilt is decorative only and is disabled for reduced-motion users.
 */
export function Hero() {
  const reduced = useReducedMotion()

  return (
    <section className="relative overflow-hidden">
      {/* Soft blue wash behind the headline â€” the only gradient in the hero */}
      <div className="glow-sky pointer-events-none absolute inset-x-0 top-0 h-130" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.028)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.028)_1px,transparent_1px)] bg-size-[64px_64px] mask-[radial-gradient(ellipse_70%_60%_at_50%_20%,#000,transparent)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 pt-16 pb-20 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:pt-24 lg:pb-28">
        {/* ---- Copy ---- */}
        <div className="flex flex-col items-start gap-7">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-sky/30 bg-sky-wash px-3.5 py-1.5 text-xs font-medium text-sky">
              <Sparkles className="size-3.5" aria-hidden="true" />
              Built for college students
            </span>
          </Reveal>

          <Reveal delay={0.08}>
            <h1 className="font-display text-[2.6rem] leading-[1.06] font-semibold tracking-tight text-paper sm:text-6xl lg:text-[4.1rem]">
              Find it. Study it.
              <br />
              <span className="text-sky">Actually understand</span> it.
            </h1>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="max-w-xl text-lg leading-8 text-paper-dim">
              StudyX brings your notes, previous papers and AI study tools into one dark, focused
              workspace â€” so you spend less time searching and more time learning.
            </p>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link to="/login">
                <Button size="lg" icon={<ArrowRight className="size-4.5" />}>
                  Start exploring free
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button size="lg" variant="secondary" icon={<Play className="size-4" />}>
                  See how it works
                </Button>
              </a>
            </div>
          </Reveal>

        </div>

        {/* ---- 3D perspective preview ---- */}
        <Reveal delay={0.2} className="perspective-1200">
          <motion.div
            initial={reduced ? false : { rotateX: 12, rotateY: -14, y: 24, opacity: 0 }}
            animate={{ rotateX: 6, rotateY: -8, y: 0, opacity: 1 }}
            whileHover={
              reduced
                ? undefined
                : { rotateX: 2, rotateY: -3, transition: { type: 'spring', stiffness: 200, damping: 24 } }
            }
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformStyle: 'preserve-3d' }}
            className="relative mx-auto w-full max-w-lg rounded-[1.4rem] border border-white/12 bg-ink-raised p-4 shadow-[0_2px_4px_rgba(0,0,0,0.5),0_40px_80px_-20px_rgba(0,0,0,0.8)] surface-lit"
          >
            {/* Floating search chip â€” sits "in front" of the panel */}
            <motion.div
              style={{ transform: 'translateZ(48px)' }}
              initial={reduced ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="absolute -top-5 left-4 flex items-center gap-2 rounded-full border border-white/14 bg-ink-raised-2 px-3.5 py-2 text-xs font-medium text-paper shadow-[0_12px_30px_rgba(0,0,0,0.5)]"
            >
              <Search className="size-3.5 text-sky" aria-hidden="true" />
              Operating Systems notes
            </motion.div>

            <div className="rounded-xl border border-white/8 bg-ink p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[11px] font-semibold tracking-[0.16em] text-paper-faint uppercase">
                  AI Study Tools
                </span>
                <span className="rounded-full bg-sky-wash px-2 py-0.5 text-[10px] font-semibold text-sky">
                  Preview
                </span>
              </div>

              <ul className="flex flex-col gap-2.5">
                {[
                  ['Exam Ready Answer Generator', 'Process scheduling, 5 marks'],
                  ['Quiz Generator', 'Deadlocks â€” 10 questions'],
                  ['Summary Generator', 'Unit 3 â†’ 1 revision page'],
                ].map(([title, meta], i) => (
                  <motion.li
                    key={title}
                    initial={reduced ? false : { opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + i * 0.1, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-center gap-3 rounded-lg border border-white/7 bg-white/3 px-3 py-2.5"
                  >
                    <span className="grid size-7 shrink-0 place-items-center rounded-md bg-sky-wash text-sky">
                      <Sparkles className="size-3.5" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-medium text-paper">{title}</span>
                      <span className="block truncate text-[11px] text-paper-faint">{meta}</span>
                    </span>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-3.5 flex items-center justify-between rounded-lg border border-sky/25 bg-sky-wash px-3 py-2.5">
                <span className="text-[12px] font-medium text-sky">Generating study planâ€¦</span>
                <span className="flex gap-1" aria-hidden="true">
                  {[0, 1, 2].map((d) => (
                    <motion.span
                      key={d}
                      className="size-1.5 rounded-full bg-sky"
                      animate={reduced ? undefined : { opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.1, repeat: Infinity, delay: d * 0.18 }}
                    />
                  ))}
                </span>
              </div>
            </div>

            {/* Depth shadow plate */}
            <div
              aria-hidden="true"
              className="absolute inset-x-6 -bottom-4 h-10 rounded-full bg-black/60 blur-2xl"
              style={{ transform: 'translateZ(-40px)' }}
            />
          </motion.div>
        </Reveal>
      </div>
    </section>
  )
}
