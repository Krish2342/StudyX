import { useEffect, useMemo, useState } from 'react'
import type { FormEvent, SelectHTMLAttributes } from 'react'
import { ArrowRight, Building2, Loader2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { useAuth } from '@/features/auth/useAuth'
import { supabase } from '@/lib/supabase'
import {
  fetchAcademicCatalog,
  submitCollegeRequest,
  updateProfile,
} from '@/services/profileService'
import type { CatalogOption } from '@/services/profileService'

/** Group colleges by city for <optgroup> display */
function groupByCity(colleges: CatalogOption[]) {
  const map = new Map<string, CatalogOption[]>()
  for (const c of colleges) {
    const city = (c as { city?: string }).city || 'Other'
    if (!map.has(city)) map.set(city, [])
    map.get(city)!.push(c)
  }
  return map
}

export function Onboarding() {
  const { user, profile, refreshProfile } = useAuth()
  const navigate = useNavigate()

  /* Catalog from Supabase */
  const [colleges, setColleges] = useState<CatalogOption[]>([])
  const [allBranches, setAllBranches] = useState<CatalogOption[]>([])
  const [semesters, setSemesters] = useState<CatalogOption[]>([])
  const [catalogLoaded, setCatalogLoaded] = useState(false)
  const [catalogError, setCatalogError] = useState<string | null>(null)

  /* Form state */
  const [fullName, setFullName] = useState(profile?.full_name ?? user?.user_metadata.name ?? '')
  const [collegeId, setCollegeId] = useState(profile?.college_id ?? '')
  const [branchId, setBranchId] = useState(profile?.branch_id ?? '')
  const [semesterId, setSemesterId] = useState(profile?.semester_id ?? '')
  const [language, setLanguage] = useState<'English' | 'Hindi' | 'Gujarati'>('English')

  /* College request state */
  const [requestName, setRequestName] = useState('')
  const [requestCity, setRequestCity] = useState('')
  const [requestState, setRequestState] = useState('')
  const [message, setMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [requestSent, setRequestSent] = useState(false)

  /* Load college catalog from Supabase */
  useEffect(() => {
    if (!supabase) { setCatalogLoaded(true); return }

    void (async () => {
      try {
        // Fetch colleges with city for grouping
        const { data: collegesData, error: collegesErr } = await supabase
          .from('colleges')
          .select('id, name, city')
          .eq('is_active', true)
          .order('city')
          .order('name')

        if (collegesErr) throw new Error(collegesErr.message)

        const catalog = await fetchAcademicCatalog(supabase)

        setColleges((collegesData ?? []) as CatalogOption[])
        setAllBranches(catalog.branches)
        setSemesters(catalog.semesters)
        setCatalogLoaded(true)
      } catch (err) {
        setCatalogError(err instanceof Error ? err.message : 'Unable to load academic catalog.')
        setCatalogLoaded(true)
      }
    })()
  }, [])

  /* Branches filtered for selected college */
  const branches = useMemo(
    () => allBranches.filter((b) => b.college_id === collegeId),
    [allBranches, collegeId],
  )

  /* Group colleges by city */
  const cityGroups = useMemo(() => groupByCity(colleges), [colleges])

  /* Show "Can't find your college?" only when user selects "Other" */
  const isOtherSelected = collegeId === 'other'

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!supabase || !user) return
    if (isOtherSelected) {
      setErrorMessage('Please use the form below to request your college, or select a listed college.')
      return
    }
    if (!collegeId || !branchId || !semesterId) {
      setErrorMessage('Please select your college, branch, and semester.')
      return
    }
    setSaving(true)
    setErrorMessage(null)
    try {
      await updateProfile(supabase, user.id, {
        full_name: fullName.trim(),
        college_id: collegeId,
        branch_id: branchId,
        semester_id: semesterId,
        preferred_language: language,
      })
      const updatedProfile = await refreshProfile()
      if (
        updatedProfile.full_name?.trim()
        && updatedProfile.college_id
        && updatedProfile.branch_id
        && updatedProfile.semester_id
      ) {
        navigate('/app', { replace: true })
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to save your profile.')
    } finally {
      setSaving(false)
    }
  }

  async function sendCollegeRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!supabase || !user || !requestName.trim()) return
    setSaving(true)
    setErrorMessage(null)
    try {
      await submitCollegeRequest(
        supabase,
        user.id,
        requestName.trim(),
        requestCity.trim(),
        requestState.trim(),
        message.trim(),
      )
      setRequestSent(true)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to submit the college request.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="min-h-dvh bg-ink px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <Link to="/" className="flex items-center gap-2.5" aria-label="StudyX home">
          <span className="grid size-9 place-items-center rounded-lg bg-sky font-display text-base font-bold text-ink">S</span>
          <span className="font-display text-xl font-semibold text-paper">StudyX</span>
        </Link>

        <div className="mt-12 max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.16em] text-sky uppercase">One-time setup</p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-paper">Tell us how you study</h1>
          <p className="mt-3 text-base leading-7 text-paper-dim">
            Complete your academic profile so resources and study tools match your college, branch, and semester.
          </p>
        </div>

        {/* Loading state */}
        {!catalogLoaded && (
          <Card interactive={false} className="mt-8 p-10 text-center">
            <Loader2 className="mx-auto size-8 animate-spin text-sky" />
            <p className="mt-4 text-sm text-paper-dim">Loading colleges…</p>
          </Card>
        )}

        {/* Catalog error */}
        {catalogError && colleges.length === 0 && (
          <Card interactive={false} className="mt-8 p-6 sm:p-8">
            <p className="rounded-xl border border-sky/30 bg-sky-wash px-4 py-3 text-sm text-sky" role="alert">
              {catalogError}. Please run the seed SQL in your Supabase dashboard.
            </p>
          </Card>
        )}

        {/* Main form */}
        {catalogLoaded && (
          <Card interactive={false} className="mt-8 p-6 sm:p-8">
            <form className="grid gap-5 md:grid-cols-2" onSubmit={(event) => void saveProfile(event)}>
              {/* Full name */}
              <div className="md:col-span-2">
                <Input
                  label="Full name"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  required
                />
              </div>

              {/* College — grouped by city */}
              <label className="flex flex-col gap-1.5 text-sm font-medium text-paper">
                College
                <select
                  value={collegeId}
                  onChange={(e) => { setCollegeId(e.target.value); setBranchId('') }}
                  required
                  className="h-11 rounded-control border border-white/12 bg-ink-raised-2 px-3.5 text-sm text-paper focus:border-sky/70 focus:outline-none disabled:opacity-50"
                >
                  <option value="">— Select your college —</option>
                  {Array.from(cityGroups.entries()).map(([city, cols]) => (
                    <optgroup key={city} label={`── ${city} ──`}>
                      {cols.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </optgroup>
                  ))}
                  <optgroup label="── Other ──">
                    <option value="other">Other (not listed)</option>
                  </optgroup>
                </select>
              </label>

              {/* Branch */}
              <label className="flex flex-col gap-1.5 text-sm font-medium text-paper">
                Branch
                <select
                  value={branchId}
                  onChange={(e) => setBranchId(e.target.value)}
                  required={!isOtherSelected}
                  disabled={!collegeId || isOtherSelected}
                  className="h-11 rounded-control border border-white/12 bg-ink-raised-2 px-3.5 text-sm text-paper focus:border-sky/70 focus:outline-none disabled:opacity-50"
                >
                  <option value="">
                    {isOtherSelected
                      ? '— Request your college below —'
                      : collegeId
                        ? '— Select your branch —'
                        : '— Select a college first —'}
                  </option>
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
                {!collegeId && (
                  <span className="text-xs text-paper-faint">Choose your college to see branches</span>
                )}
              </label>

              {/* Semester */}
              <Select
                label="Semester"
                value={semesterId}
                onChange={(event) => setSemesterId(event.target.value)}
                required
              >
                <option value="">— Select your semester —</option>
                {semesters.map((s) => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </Select>

              {/* Language */}
              <Select
                label="Preferred language"
                value={language}
                onChange={(event) => setLanguage(event.target.value as typeof language)}
              >
                <option>English</option>
                <option>Hindi</option>
                <option>Gujarati</option>
              </Select>

              {errorMessage && (
                <p className="md:col-span-2 rounded-xl border border-sky/30 bg-sky-wash px-4 py-3 text-sm text-sky" role="alert">
                  {errorMessage}
                </p>
              )}

              <div className="md:col-span-2 flex justify-end">
                <Button
                  type="submit"
                  disabled={saving || isOtherSelected}
                  icon={<ArrowRight className="size-4" />}
                >
                  {saving ? 'Saving…' : 'Continue to StudyX'}
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* "Can't find your college?" — only shown when "Other" is selected */}
        {isOtherSelected && (
          <Card interactive={false} className="mt-5 p-6 sm:p-8">
            <div className="flex items-start gap-3">
              <Building2 className="mt-0.5 size-5 text-sky" aria-hidden="true" />
              <div>
                <h2 className="font-display text-lg font-semibold text-paper">Can't find your college?</h2>
                <p className="mt-1 text-sm leading-6 text-paper-dim">
                  Send a request to the StudyX team. It will be reviewed and added to the catalog.
                </p>
              </div>
            </div>
            {requestSent ? (
              <p className="mt-5 rounded-xl border border-sky/30 bg-sky-wash px-4 py-3 text-sm text-sky">
                Your college request was submitted for review. We'll add it soon!
              </p>
            ) : (
              <form className="mt-5 grid gap-4 md:grid-cols-2" onSubmit={(event) => void sendCollegeRequest(event)}>
                <Input label="College name" value={requestName} onChange={(event) => setRequestName(event.target.value)} required />
                <Input label="City" value={requestCity} onChange={(event) => setRequestCity(event.target.value)} />
                <Input label="State" value={requestState} onChange={(event) => setRequestState(event.target.value)} />
                <Input label="Additional note" value={message} onChange={(event) => setMessage(event.target.value)} />
                <div className="md:col-span-2 flex justify-end">
                  <Button type="submit" variant="secondary" disabled={saving}>
                    Request college review
                  </Button>
                </div>
              </form>
            )}
          </Card>
        )}
      </div>
    </main>
  )
}

function Select({ label, children, ...props }: SelectHTMLAttributes<HTMLSelectElement> & { label: string }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm font-medium text-paper">
      {label}
      <select
        {...props}
        className="h-11 rounded-control border border-white/12 bg-ink-raised-2 px-3.5 text-sm text-paper focus:border-sky/70 focus:outline-none disabled:opacity-50"
      >
        {children}
      </select>
    </label>
  )
}
