import { AnimatePresence, motion } from 'motion/react'
import { Search } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminHref, adminNavItems } from '@/features/admin/nav/adminNav'
import type { AdminNavItem } from '@/features/admin/nav/adminNav'

export interface AdminQuickSearchProps {
  open: boolean
  onClose: () => void
}

/**
 * Jump to any section by name.
 *
 * Phase 1 searches the navigation itself ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â genuinely useful, and it needs no
 * database. Record-level search (resources, students, tickets) joins it once
 * those tables exist.
 */
export function AdminQuickSearch({ open, onClose }: AdminQuickSearchProps) {
  const [query, setQuery] = useState('')
  const [cursor, setCursor] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  const results = useMemo<AdminNavItem[]>(() => {
    const q = query.trim().toLowerCase()
    if (!q) return adminNavItems
    return adminNavItems.filter((item) =>
      `${item.label} ${item.blurb} ${item.deliverables.join(' ')}`.toLowerCase().includes(q),
    )
  }, [query])

  // Reset each time the palette opens, then move focus into the input.
  useEffect(() => {
    if (!open) return
    const id = window.setTimeout(() => {
      setQuery('')
      setCursor(0)
      inputRef.current?.focus()
    }, 0)
    return () => window.clearTimeout(id)
  }, [open])

  function closePalette() {
    setQuery('')
    setCursor(0)
    onClose()
  }

  function go(item: AdminNavItem) {
    navigate(adminHref(item.path))
    closePalette()
  }

  function onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      event.preventDefault()
      closePalette()
      return
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setCursor((c) => (results.length ? (c + 1) % results.length : 0))
      return
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setCursor((c) => (results.length ? (c - 1 + results.length) % results.length : 0))
      return
    }
    if (event.key === 'Enter' && results[cursor]) {
      event.preventDefault()
      go(results[cursor])
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-70 flex items-start justify-center bg-black/70 px-4 pt-[12vh] backdrop-blur-sm"
          onClick={closePalette}
        >
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Search admin sections"
          initial={{ opacity: 0, y: -8, scale: 0.99 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.99 }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          onClick={(event) => event.stopPropagation()}
          onKeyDown={onKeyDown}
          className="w-full max-w-xl overflow-hidden rounded-card border border-white/12 bg-ink-raised shadow-float"
        >
          <div className="flex items-center gap-3 border-b border-white/8 px-4">
            <Search className="size-4 shrink-0 text-paper-faint" aria-hidden="true" />
            <input
              ref={inputRef}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setCursor(0)
              }}
              placeholder="Search sections ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â resources, students, ticketsÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦"
              aria-label="Search admin sections"
              className="h-13 w-full bg-transparent text-[15px] text-paper outline-none placeholder:text-paper-faint"
            />
            <kbd className="hidden shrink-0 rounded border border-white/12 px-1.5 py-0.5 text-[10px] font-medium text-paper-faint sm:block">
              Esc
            </kbd>
          </div>

          <ul className="max-h-[52vh] overflow-y-auto p-2" role="listbox" aria-label="Sections">
            {results.length === 0 && (
              <li className="px-3 py-8 text-center">
                <p className="text-sm text-paper-dim">No section matches ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œ{query}ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â.</p>
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="mt-2 rounded text-sm font-medium text-admin-accent outline-none hover:text-paper focus-visible:ring-2 focus-visible:ring-admin-accent"
                >
                  Clear search
                </button>
              </li>
            )}

            {results.map((item, index) => (
              <li key={item.path || 'overview'} role="option" aria-selected={index === cursor}>
                <button
                  type="button"
                  onMouseEnter={() => setCursor(index)}
                  onClick={() => go(item)}
                  className={[
                    'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left outline-none',
                    'transition-colors duration-100',
                    index === cursor ? 'bg-admin-wash' : 'hover:bg-white/5',
                  ].join(' ')}
                >
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-white/6">
                    <item.icon className="size-4 text-admin-accent" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-paper">
                      {item.label}
                    </span>
                    <span className="block truncate text-xs text-paper-faint">{item.blurb}</span>
                  </span>
                  <span className="shrink-0 text-[10px] font-semibold tracking-wider text-paper-faint uppercase">
                    Phase {item.phase}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
