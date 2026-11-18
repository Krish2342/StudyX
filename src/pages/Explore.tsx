import { useEffect, useMemo, useState } from 'react'
import { Plus, Search, SlidersHorizontal } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ResourceCard } from '@/components/resources/ResourceCard'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useAuth } from '@/features/auth/useAuth'
import { fetchAcademicCatalog, type CatalogOption } from '@/services/profileService'
import { fetchResources, toggleBookmark, type ResourceFilters, type ResourceRecord } from '@/services/resourceService'
import { supabase } from '@/lib/supabase'

export function Explore() {
  const { user } = useAuth()
  const [resources, setResources] = useState<ResourceRecord[]>([])
  const [catalog, setCatalog] = useState<{ colleges: CatalogOption[]; branches: CatalogOption[]; semesters: CatalogOption[]; subjects: CatalogOption[] } | null>(null)
  const [filters, setFilters] = useState<ResourceFilters>({ sort: 'newest' })
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!supabase || !user) return
    let active = true
    Promise.all([fetchResources(supabase, user.id, filters), catalog ? Promise.resolve(catalog) : fetchAcademicCatalog(supabase)])
      .then(([nextResources, nextCatalog]) => {
        if (!active) return
        setResources((current) => filters.page ? [...current, ...nextResources] : nextResources)
        setHasMore(nextResources.length === 12)
        setCatalog(nextCatalog)
        setError(null)
      })
      .catch((reason: unknown) => active && setError(reason instanceof Error ? reason.message : 'Unable to load resources.'))
      .finally(() => active && setLoading(false))
    return () => { active = false }
  }, [filters, user, catalog])

  const filteredBranches = useMemo(
    () => catalog?.branches.filter((item) => !filters.collegeId || item.college_id === filters.collegeId) ?? [],
    [catalog, filters.collegeId],
  )

  async function bookmark(resource: ResourceRecord) {
    if (!supabase || !user) return
    try {
      await toggleBookmark(supabase, user.id, resource.id, resource.is_bookmarked)
      setResources((current) => current.map((item) => item.id === resource.id ? { ...item, is_bookmarked: !item.is_bookmarked } : item))
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to update saved resources.')
    }
  }

  function updateFilter(key: keyof ResourceFilters, value: string) {
    setLoading(true)
    setResources([])
    setFilters((current) => ({ ...current, [key]: value || undefined, page: 0 }))
  }

  function loadMore() {
    setLoading(true)
    setFilters((current) => ({ ...current, page: (current.page ?? 0) + 1 }))
  }

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold tracking-[0.16em] text-sky uppercase">Resource library</p>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-paper sm:text-4xl">Find what helps you study</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-paper-dim">Browse approved notes, books and papers shared by students and reviewed by StudyX.</p>
        </div>
        <Link to="/app/explore/submit"><Button icon={<Plus className="size-4" />}>Submit resource</Button></Link>
      </header>

      <Card interactive={false} className="p-4 sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row">
          <label className="relative min-w-0 flex-1">
            <span className="sr-only">Search resources</span>
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-paper-faint" aria-hidden="true" />
            <input value={filters.query ?? ''} onChange={(event) => updateFilter('query', event.target.value)} placeholder="Search resources, subjects or topics" className="h-11 w-full rounded-control border border-white/12 bg-white/4 pr-3.5 pl-10 text-sm text-paper placeholder:text-paper-faint focus:border-sky/70 focus:outline-none" />
          </label>
          <div className="flex flex-wrap gap-3">
            <Select value={filters.category ?? ''} onChange={(value) => updateFilter('category', value)} options={categories} label="Category" />
            <Select value={filters.collegeId ?? ''} onChange={(value) => updateFilter('collegeId', value)} options={(catalog?.colleges ?? []).map((item) => ({ value: item.id, label: item.name ?? '' }))} label="College" />
            <Select value={filters.branchId ?? ''} onChange={(value) => updateFilter('branchId', value)} options={filteredBranches.map((item) => ({ value: item.id, label: item.name ?? '' }))} label="Branch" />
            <Select value={filters.sort ?? 'newest'} onChange={(value) => updateFilter('sort', value)} options={[{ value: 'newest', label: 'Newest' }, { value: 'title', label: 'Title' }]} label="Sort" />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs text-paper-faint"><SlidersHorizontal className="size-3.5" aria-hidden="true" /> Filters update from the approved resource library.</div>
      </Card>

      {error && <p className="rounded-xl border border-sky/30 bg-sky-wash px-4 py-3 text-sm text-sky" role="alert">{error}</p>}
      {loading ? <p className="py-12 text-center text-sm text-paper-faint">Loading resources...</p> : resources.length ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {resources.map((resource) => <ResourceCard key={resource.id} resource={resource} onBookmark={bookmark} />)}
        </div>
      ) : <EmptyState />}
      {!loading && hasMore && (
        <button type="button" onClick={loadMore} className="mx-auto rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-paper transition-colors hover:border-sky/50 hover:text-sky">
          Load more resources
        </button>
      )}
    </div>
  )
}

const categories = [
  { value: 'notes', label: 'Notes' },
  { value: 'books', label: 'Books' },
  { value: 'assignments', label: 'Assignments' },
  { value: 'previous-year-papers', label: 'Previous Year Papers' },
  { value: 'question-banks', label: 'Question Banks' },
  { value: 'lab-manuals', label: 'Lab Manuals' },
  { value: 'ppts', label: 'PPTs' },
  { value: 'important-questions', label: 'Important Questions' },
  { value: 'study-material', label: 'Study Material' },
  { value: 'other', label: 'Other' },
]

function Select({ value, onChange, options, label }: { value: string; onChange: (value: string) => void; options: Array<{ value: string; label: string }>; label: string }) {
  return <label className="sr-only">{label}<select aria-label={label} value={value} onChange={(event) => onChange(event.target.value)} className="h-11 min-w-32 rounded-control border border-white/12 bg-white/4 px-3 text-sm text-paper"><option value="">All {label.toLowerCase()}s</option>{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
}

function EmptyState() {
  return <Card interactive={false} className="p-10 text-center"><h2 className="font-display text-xl font-semibold text-paper">No matching resources</h2><p className="mt-2 text-sm text-paper-dim">Try a different search or submit the resource you need.</p><Link to="/app/explore/submit" className="mt-5 inline-flex text-sm font-semibold text-sky hover:text-sky-bright">Submit a resource</Link></Card>
}
