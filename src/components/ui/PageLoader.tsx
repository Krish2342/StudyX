/**
 * Shown while a lazily-loaded route chunk downloads.
 *
 * Deliberately animation-library free so the entry bundle stays small:
 * the pulse is CSS, and `motion-reduce:animate-none` turns it off for users
 * who asked for less motion.
 */
export function PageLoader() {
  return (
    <div
      className="flex min-h-[70dvh] flex-col items-center justify-center gap-4 bg-ink"
      role="status"
      aria-live="polite"
    >
      <span className="grid size-12 animate-pulse place-items-center rounded-xl bg-sky font-display text-lg font-bold text-ink motion-reduce:animate-none">
        S
      </span>
      <span className="text-xs font-medium tracking-[0.16em] text-paper-faint uppercase">
        Loading
      </span>
    </div>
  )
}
