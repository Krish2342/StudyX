import { useEffect, useState } from 'react'
import { Bookmark } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ResourceCard } from '@/components/resources/ResourceCard'
import { Card } from '@/components/ui/Card'
import { useAuth } from '@/features/auth/useAuth'
import { fetchSavedResources, toggleBookmark, type ResourceRecord } from '@/services/resourceService'
import { supabase } from '@/lib/supabase'

export function SavedResources() {
  const { user } = useAuth()
  const [resources, setResources] = useState<ResourceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!supabase || !user) return
    let active = true
    fetchSavedResources(supabase, user.id)
      .then((items) => active && setResources(items))
      .catch((reason: unknown) => active && setError(reason instanceof Error ? reason.message : 'Unable to load saved resources.'))
      .finally(() => active && setLoading(false))
    return () => { active = false }
  }, [user])

  async function remove(resource: ResourceRecord) {
    if (!supabase || !user) return
    try {
      await toggleBookmark(supabase, user.id, resource.id, true)
      setResources((current) => current.filter((item) => item.id !== resource.id))
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to remove saved resource.')
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <header>
        <p className="text-xs font-semibold tracking-[0.16em] text-sky uppercase">Your library</p>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-paper sm:text-4xl">Saved resources</h1>
        <p className="mt-2 text-sm leading-6 text-paper-dim">Keep the notes, books, and papers you want to revisit close by.</p>
      </header>
      {error && <p className="rounded-xl border border-sky/30 bg-sky-wash px-4 py-3 text-sm text-sky" role="alert">{error}</p>}
      {loading ? <p className="py-12 text-center text-sm text-paper-faint">Loading saved resources...</p> : resources.length ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {resources.map((resource) => <ResourceCard key={resource.id} resource={resource} onBookmark={remove} />)}
        </div>
      ) : (
        <Card interactive={false} className="p-10 text-center">
          <Bookmark className="mx-auto size-7 text-sky" aria-hidden="true" />
          <h2 className="mt-4 font-display text-xl font-semibold text-paper">Nothing saved yet</h2>
          <p className="mt-2 text-sm text-paper-dim">Save useful resources from Explore to find them here later.</p>
          <Link to="/app/explore" className="mt-5 inline-flex text-sm font-semibold text-sky hover:text-sky-bright">Explore resources</Link>
        </Card>
      )}
    </div>
  )
}
