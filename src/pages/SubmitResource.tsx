import { useEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { ResourceForm } from '@/components/resources/ResourceForm'
import { Card } from '@/components/ui/Card'
import { useAuth } from '@/features/auth/useAuth'
import { fetchAcademicCatalog, type CatalogOption } from '@/services/profileService'
import { createResource } from '@/services/resourceService'
import { supabase } from '@/lib/supabase'

export function SubmitResource() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [catalog, setCatalog] = useState<{ colleges: CatalogOption[]; branches: CatalogOption[]; semesters: CatalogOption[]; subjects: CatalogOption[] } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!supabase) return
    fetchAcademicCatalog(supabase).then(setCatalog).catch((reason: unknown) => setError(reason instanceof Error ? reason.message : 'Unable to load academic options.'))
  }, [])

  async function submit(input: Parameters<typeof createResource>[2]) {
    if (!supabase || !user) throw new Error('You must be signed in to submit a resource.')
    setSubmitting(true)
    try {
      await createResource(supabase, user.id, input)
      navigate('/app/study-space')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/app/explore" className="inline-flex items-center gap-2 text-sm text-paper-dim hover:text-sky"><ArrowLeft className="size-4" aria-hidden="true" /> Back to explore</Link>
      <Card interactive={false} className="mt-6 p-6 sm:p-8">
        <p className="text-xs font-semibold tracking-[0.16em] text-sky uppercase">Share knowledge</p>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-paper">Submit a resource</h1>
        <p className="mt-2 text-sm leading-6 text-paper-dim">Your submission stays private until the Super Admin reviews it.</p>
        {error ? <p className="mt-6 text-sm text-sky" role="alert">{error}</p> : catalog ? <div className="mt-8"><ResourceForm {...catalog} submitting={submitting} onSubmit={submit} /></div> : <p className="mt-8 text-sm text-paper-faint">Loading academic options...</p>}
      </Card>
    </div>
  )
}
