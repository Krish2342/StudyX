import type { Resource, ResourceCategory } from '@/types'

/* ==========================================================================
   SEARCH SERVICE
   Pure functions only — no React, no DOM, no network.
   This keeps search logic separate from the UI so a real search API
   (Elasticsearch, Algolia, a backend endpoint…) can replace it later
   without touching a single component.
   ========================================================================== */

export interface SearchFilters {
  category?: ResourceCategory | 'All'
  semester?: number | 'All'
  minRating?: number
}

export type SortKey = 'relevance' | 'rating' | 'downloads' | 'newest'

export interface SearchQuery {
  term: string
  filters?: SearchFilters
  sort?: SortKey
}

const normalize = (value: string) => value.trim().toLowerCase()

/** Every string field we are willing to match against. */
function haystack(resource: Resource): string {
  return normalize(
    [
      resource.title,
      resource.subject,
      resource.category,
      resource.college,
      resource.branch,
      resource.description,
      resource.addedBy,
      String(resource.semester),
    ].join(' '),
  )
}

/** Rank: exact title hit > title contains > subject hit > anywhere else. */
function score(resource: Resource, term: string): number {
  const q = normalize(term)
  if (!q) return 0
  const title = normalize(resource.title)
  const subject = normalize(resource.subject)
  if (title === q) return 100
  if (title.startsWith(q)) return 80
  if (title.includes(q)) return 60
  if (subject.includes(q)) return 40
  if (haystack(resource).includes(q)) return 20
  return 0
}

function sortResources(list: Resource[], sort: SortKey, term: string): Resource[] {
  const out = [...list]
  switch (sort) {
    case 'rating':
      return out.sort((a, b) => b.rating - a.rating)
    case 'downloads':
      return out.sort((a, b) => b.downloads - a.downloads)
    case 'newest':
      return out.sort((a, b) => b.id.localeCompare(a.id))
    case 'relevance':
    default:
      return out.sort((a, b) => score(b, term) - score(a, term) || b.rating - a.rating)
  }
}

function matchesFilters(resource: Resource, filters: SearchFilters): boolean {
  if (filters.category && filters.category !== 'All' && resource.category !== filters.category) return false
  if (filters.semester && filters.semester !== 'All' && resource.semester !== filters.semester) return false
  if (filters.minRating && resource.rating < filters.minRating) return false
  return true
}

/** Main entry point: filter → score → sort. */
export function searchResources(all: Resource[], query: SearchQuery): Resource[] {
  const term = normalize(query.term)
  const filters = query.filters ?? {}
  const sort = query.sort ?? 'relevance'

  const filtered = all.filter((r) => matchesFilters(r, filters))
  if (!term) return sortResources(filtered, sort, '')

  return sortResources(
    filtered.filter((r) => score(r, term) > 0),
    sort,
    term,
  )
}

/** Up to `limit` suggestions for the search-as-you-type dropdown. */
export function suggest(all: Resource[], term: string, limit = 6): string[] {
  const q = normalize(term)
  if (!q) return []
  const seen = new Set<string>()
  const out: string[] = []
  for (const r of sortResources(all, 'relevance', q)) {
    for (const candidate of [r.title, r.subject]) {
      if (normalize(candidate).includes(q) && !seen.has(candidate)) {
        seen.add(candidate)
        out.push(candidate)
        if (out.length >= limit) return out
      }
    }
  }
  return out
}

/** Cheap keyword extraction used for the "related" chips. */
export function topKeywords(all: Resource[], limit = 8): string[] {
  const counts = new Map<string, number>()
  for (const r of all) {
    for (const word of normalize(`${r.subject} ${r.category}`).split(/\s+/)) {
      if (word.length < 3) continue
      counts.set(word, (counts.get(word) ?? 0) + 1)
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word]) => word)
}
