import { ArrowUpRight, Download, Share2, Star } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { demoResources } from '@/data/dashboard'
import { Reveal, Stagger, StaggerItem } from '@/components/landing/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Badge, RatingBadge } from '@/components/ui/Badge'

/**
 * Resource library showcase — the "proof" band of the landing page.
 * Uses the real demo data so the cards look like the actual product.
 */
export function ResourceShowcase() {
  const featured = demoResources.slice(0, 3)

  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Resource library"
            title="Real material, from your own college"
            description="Every resource is scoped to a college, branch, semester and subject — with ratings, so you know what is worth opening first."
          />
        </Reveal>

        <Stagger className="mt-14 grid gap-5 md:grid-cols-3">
          {featured.map((r) => (
            <StaggerItem key={r.id}>
              <article className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-white/[0.09] bg-ink-raised shadow-[0_1px_2px_rgba(0,0,0,0.45),0_16px_40px_rgba(0,0,0,0.3)] transition-[transform,border-color] duration-300 ease-out-expo hover:-translate-y-1 hover:border-sky/30 surface-lit">
                {/* Cover — abstract, generated from the subject name (no external images) */}
                <div className="relative grid h-36 place-items-center overflow-hidden border-b border-white/[0.08] bg-ink">
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(141,185,240,0.18),transparent_60%)]"
                  />
                  <span className="relative font-display text-xl font-semibold tracking-tight text-paper/85">
                    {r.subject}
                  </span>
                  <span className="absolute top-3 left-3">
                    <Badge tone="accent">{r.category}</Badge>
                  </span>
                </div>

                <div className="flex flex-1 flex-col gap-3 p-5">
                  <h3 className="font-display text-[15px] leading-6 font-semibold text-paper">{r.title}</h3>

                  <p className="text-xs leading-5 text-paper-faint">{r.description}</p>

                  <dl className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px]">
                    <Meta label="Branch" value={r.branch} />
                    <Meta label="Semester" value={`Sem ${r.semester}`} />
                    <Meta label="Added by" value={r.addedBy} />
                    <Meta label="Downloads" value={r.downloads.toLocaleString()} />
                  </dl>

                  <div className="mt-auto flex items-center justify-between gap-3 border-t border-white/[0.08] pt-4">
                    <span className="flex items-center gap-3">
                      <RatingBadge value={r.rating} />
                      <span className="flex items-center gap-1 text-[11px] text-paper-faint">
                        <Download className="size-3" aria-hidden="true" />
                        {r.downloads.toLocaleString()}
                      </span>
                    </span>
                    <span className="flex gap-1.5">
                      <IconBtn label={`Share ${r.title}`}>
                        <Share2 className="size-3.5" />
                      </IconBtn>
                      <IconBtn label={`Save ${r.title}`}>
                        <Star className="size-3.5" />
                      </IconBtn>
                    </span>
                  </div>
                </div>

                <Link
                  to="/app/explore"
                  aria-label={`Open ${r.title}`}
                  className="absolute inset-0"
                >
                  <span className="sr-only">Open notes</span>
                </Link>
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute right-4 bottom-4 grid size-8 translate-y-1 place-items-center rounded-full bg-sky text-ink opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
                >
                  <ArrowUpRight className="size-4" />
                </span>
              </article>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal delay={0.1} className="mt-12 flex justify-center">
          <Link
            to="/app/explore"
            className="inline-flex items-center gap-2 rounded-full border border-white/12 px-6 py-3 text-sm font-medium text-paper transition-colors hover:border-sky/50 hover:bg-sky-wash"
          >
            Browse the full library
            <ArrowUpRight className="size-4 text-sky" aria-hidden="true" />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-paper-faint">{label}</dt>
      <dd className="truncate text-paper-dim">{value}</dd>
    </div>
  )
}

function IconBtn({ label, children }: { label: string; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="relative z-10 grid size-8 place-items-center rounded-lg border border-white/10 text-paper-faint transition-colors hover:border-sky/40 hover:text-sky"
    >
      {children}
    </button>
  )
}
