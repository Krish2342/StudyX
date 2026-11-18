import type { SupabaseClient, User } from '@supabase/supabase-js'

export interface CatalogOption {
  id: string
  name?: string
  label?: string
  number?: number
  college_id?: string
  branch_id?: string
  semester_id?: string
  code?: string | null
}

export interface ProfileRecord {
  id: string
  full_name: string | null
  email: string | null
  avatar_url: string | null
  college_id: string | null
  branch_id: string | null
  semester_id: string | null
  preferred_language: string
  preferred_answer_style: string | null
  is_suspended: boolean
  college: { id: string; name: string } | null
  branch: { id: string; name: string } | null
  semester: { id: string; label: string; number: number } | null
}

export interface ProfileUpdate {
  full_name: string
  college_id: string
  branch_id: string
  semester_id: string
  preferred_language: 'English' | 'Hindi' | 'Gujarati'
}

export async function ensureProfile(client: SupabaseClient, user: User): Promise<void> {
  const { error } = await client.from('profiles').upsert(
    {
      id: user.id,
      full_name: user.user_metadata.full_name ?? user.user_metadata.name ?? null,
      email: user.email ?? null,
      avatar_url: user.user_metadata.avatar_url ?? user.user_metadata.picture ?? null,
    },
    { onConflict: 'id', ignoreDuplicates: true },
  )
  if (error) throw new Error(`Unable to create your profile: ${error.message}`)
}

export async function fetchProfile(client: SupabaseClient, userId: string): Promise<ProfileRecord> {
  const { data, error } = await client
    .from('profiles')
    .select(
      'id, full_name, email, avatar_url, college_id, branch_id, semester_id, preferred_language, preferred_answer_style, is_suspended, college:colleges(id, name), branch:branches(id, name), semester:semesters(id, label, number)',
    )
    .eq('id', userId)
    .single()

  if (error || !data) throw new Error(error?.message ?? 'Your profile could not be found.')
  return data as unknown as ProfileRecord
}

export async function fetchAcademicCatalog(client: SupabaseClient) {
  const [colleges, branches, semesters, subjects] = await Promise.all([
    client.from('colleges').select('id, name').eq('is_active', true).order('name'),
    client.from('branches').select('id, name, college_id').eq('is_active', true).order('name'),
    client.from('semesters').select('id, label, number').eq('is_active', true).order('number'),
    client.from('subjects').select('id, name, code, college_id, branch_id, semester_id').eq('is_active', true).order('name'),
  ])
  const failure = [colleges, branches, semesters, subjects].find((result) => result.error)
  if (failure?.error) throw new Error(`Academic catalog unavailable: ${failure.error.message}`)
  return {
    colleges: (colleges.data ?? []) as CatalogOption[],
    branches: (branches.data ?? []) as CatalogOption[],
    semesters: (semesters.data ?? []) as unknown as CatalogOption[],
    subjects: (subjects.data ?? []) as CatalogOption[],
  }
}

export async function updateProfile(
  client: SupabaseClient,
  userId: string,
  input: ProfileUpdate,
): Promise<void> {
  const { error } = await client
    .from('profiles')
    .update(input)
    .eq('id', userId)
  if (error) throw new Error(`Unable to save your profile: ${error.message}`)
}

export async function submitCollegeRequest(
  client: SupabaseClient,
  userId: string,
  collegeName: string,
  city: string,
  state: string,
  message: string,
): Promise<void> {
  const { error } = await client.from('college_requests').insert({
    user_id: userId,
    college_name: collegeName,
    city: city || null,
    state: state || null,
    message: message || null,
  })
  if (error) throw new Error(`Unable to submit college request: ${error.message}`)
}
