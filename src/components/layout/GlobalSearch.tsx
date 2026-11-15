import { AnimatePresence, motion } from 'motion/react'
import { CornerDownLeft, Search, X } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { demoResources } from '@/data/dashboard'
import { searchResources, suggest } from '@/services/searchService'
import { useToast } from '@/hooks/useToast'

const RECENT_KEY = 'studyx:recent-searches'

function readRecent(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}

/** Global search: instant results + suggestions + recent searches. */
export function GlobalSearch({ compact = false }: { compact?: boolean }) {
  const [term, setTerm] = useState('')
  const [open, setOpen] = useState(false)
  const [recent, setRecent] = useState<string[]>(readRecent)
  const boxRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const { toast } = useToast()
  // Unique per instance: this component renders in the top bar AND on the
  // dashboard, so a hardcoded id would be duplicated in the DOM.
  const inputId = useId()

  const suggestions = suggest(demoResources, term, 5)
  const results = term.trim() ? searchResources(demoResources, { term }).slice(0, 5) : []

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  function commit(value: string) {
    const clean = value.trim()
    if (!clean) return
    const next = [clean, ...recent.filter((r) => r !== clean)].slice(0, 5)
    setRecent(next)
    localStorage.setItem(RECENT_KEY, JSON.stringify(next))
    setOpen(false)
    setTerm(clean)
    toast(`Searching StudyX for “${clean}”`, 'info')
    navigate('/app/explore')
  }

  function clearRecent() {
    setRecent([])
    localStorage.removeItem(RECENT_KEY)
    toast('Recent searches cleared', 'success')
  }

  return (
    <div ref={boxRef} className="relative w-full">
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault()
          commit(term)
        }}
      >
        <label htmlFor={inputId} className="sr-only">
          Search StudyX
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-paper-faint" aria-hidden="true" />
          <input
            id={inputId}
            value={term}
            onChange={(e) => {
              setTerm(e.target.value)
              setOpen(true)
            }}
            onFocus={() => setOpen(true)}
            placeholder="Search notes, subjects, papers…"
            autoComplete="off"
            className={[
              'h-11 w-full rounded-full border border-white/10 bg-white/[0.04] pr-10 pl-10 text-sm text-paper',
              'placeholder:text-paper-faint transition-[border-color,background-color,box-shadow] duration-150',
              'focus:border-sky/60 focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(141,185,240,0.15)] focus:outline-none',
              compact ? 'lg:w-72 xl:w-96' : '',
            ].join(' ')}
          />
          {term && (
            <button
              type="button"
              onClick={() => {
                setTerm('')
                setOpen(false)
              }}
              aria-label="Clear search"
              className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1 text-paper-faint hover:bg-white/10 hover:text-paper"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
      </form>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-full left-0 z-50 mt-2 w-full min-w-72 overflow-hidden rounded-2xl border border-white/10 bg-ink-raised-2 shadow-[0_2px_4px_rgba(0,0,0,0.4),0_24px_60px_rgba(0,0,0,0.5)]"
          >
            {term.trim() === '' ? (
              <div className="p-3">
                <div className="mb-2 flex items-center justify-between px-1">
                  <span className="text-[11px] font-semibold tracking-widest text-paper-faint uppercase">
                    Recent searches
                  </span>
                  {recent.length > 0 && (
                    <button type="button" onClick={clearRecent} className="text-[11px] text-sky hover:underline">
                      Clear
                    </button>
                  )}
                </div>
                {recent.length === 0 ? (
                  <p className="px-1 py-3 text-sm text-paper-faint">Nothing yet — try “DBMS” or “Operating Systems”.</p>
                ) : (
                  <ul className="flex flex-col gap-0.5">
                    {recent.map((r) => (
                      <li key={r}>
                        <button
                          type="button"
                          onClick={() => commit(r)}
                          className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left text-sm text-paper-dim transition-colors hover:bg-white/[0.07] hover:text-paper"
                        >
                          <Search className="size-3.5 shrink-0 text-paper-faint" />
                          {r}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : results.length === 0 ? (
              <div className="px-4 py-5 text-sm text-paper-faint">
                No matches for “{term}”. Try a subject name like “Networks”.
              </div>
            ) : (
              <ul className="flex flex-col gap-0.5 p-2" role="listbox">
                {results.map((r) => (
                  <li key={r.id}>
                    <button
                      type="button"
                      onClick={() => commit(r.title)}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-white/[0.07]"
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-paper">{r.title}</span>
                        <span className="block truncate text-xs text-paper-faint">
                          {r.subject} · Semester {r.semester} · {r.category}
                        </span>
                      </span>
                      <CornerDownLeft className="size-3.5 shrink-0 text-paper-faint" aria-hidden="true" />
                    </button>
                  </li>
                ))}
                {suggestions.length > 0 && (
                  <li className="mt-1 border-t border-white/[0.08] px-3 pt-2 pb-1 text-[11px] text-paper-faint">
                    {suggestions.length} suggestion{suggestions.length > 1 ? 's' : ''} found
                  </li>
                )}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
