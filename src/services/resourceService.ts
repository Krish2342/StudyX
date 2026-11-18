import type { SupabaseClient } from '@supabase/supabase-js'

export type ResourceStatus = 'pending' | 'approved' | 'rejected' | 'removed'
export type ResourceSort = 'newest' | 'title'
export type ResourceReportReason = 'broken_link' | 'incorrect_content' | 'copyright' | 'other'
export const RESOURCE_PAGE_SIZE = 12

export interface ResourceRecord {
  id: string
  title: string
  slug: string
  description: string | null
  resource_type: string
  google_drive_url: string
  cover_image_url: string | null
  drive_access_status: string
  status: ResourceStatus
  admin_note: string | null
  view_count: number
  share_count: number
  created_at: string
  college: { id: string; name: string } | null
  branch: { id: string; name: string } | null
  semester: { id: string; label: string; number: number } | null
  subject: { id: string; name: string; code: string | null } | null
  creator: { id: string; full_name: string | null } | null
  rating: number
  rating_count: number
  is_bookmarked: boolean
}

export interface ResourceFilters {
  query?: string
  category?: string
  collegeId?: string
  branchId?: string
  semesterId?: string
  subjectId?: string
  sort?: ResourceSort
  page?: number
}

export interface ResourceInput {
  title: string
  description: string
  resourceType: string
  collegeId: string
  branchId: string
  semesterId: string
  subjectId: string
  googleDriveUrl: string
  coverImageUrl?: string
}

const resourceSelect = `
  id, title, slug, description, resource_type, google_drive_url,
  cover_image_url, drive_access_status, status, admin_note, view_count,
  share_count, created_at,
  college:colleges(id, name),
  branch:branches(id, name),
  semester:semesters(id, label, number),
  subject:subjects(id, name, code)
`

function isGoogleDriveUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' && (
      url.hostname === 'drive.google.com' ||
      url.hostname === 'docs.google.com'
    )
  } catch {
    return false
  }
}

function withEngagement(
  resource: Omit<ResourceRecord, 'rating' | 'rating_count' | 'is_bookmarked'>,
  ratings: Array<{ resource_id: string; rating: number }>,
  bookmarks: Array<{ resource_id: string }>,
): ResourceRecord {
  const resourceRatings = ratings.filter((item) => item.resource_id === resource.id)
  return {
    ...resource,
    rating: resourceRatings.length
      ? resourceRatings.reduce((sum, item) => sum + item.rating, 0) / resourceRatings.length
      : 0,
    rating_count: resourceRatings.length,
    is_bookmarked: bookmarks.some((item) => item.resource_id === resource.id),
  }
}

async function addEngagement(
  client: SupabaseClient,
  resources: Array<Omit<ResourceRecord, 'rating' | 'rating_count' | 'is_bookmarked'>>,
  userId: string,
): Promise<ResourceRecord[]> {
  if (!resources.length) return []
  const ids = resources.map((resource) => resource.id)
  const [ratings, bookmarks] = await Promise.all([
    client.from('resource_ratings').select('resource_id, rating').in('resource_id', ids),
    client.from('bookmarks').select('resource_id').eq('user_id', userId).in('resource_id', ids),
  ])
  if (ratings.error) throw new Error(`Unable to load resource ratings: ${ratings.error.message}`)
  if (bookmarks.error) throw new Error(`Unable to load saved resources: ${bookmarks.error.message}`)
  return resources.map((resource) => withEngagement(resource, ratings.data ?? [], bookmarks.data ?? []))
}

export async function fetchResources(
  client: SupabaseClient,
  userId: string,
  filters: ResourceFilters = {},
): Promise<ResourceRecord[]> {
  let query = client.from('resources').select(resourceSelect).eq('status', 'approved')
  if (filters.query?.trim()) {
    const value = filters.query.trim().replace(/[%(),]/g, ' ')
    query = query.or(`title.ilike.%${value}%,description.ilike.%${value}%`)
  }
  if (filters.category) query = query.eq('resource_type', filters.category)
  if (filters.collegeId) query = query.eq('college_id', filters.collegeId)
  if (filters.branchId) query = query.eq('branch_id', filters.branchId)
  if (filters.semesterId) query = query.eq('semester_id', filters.semesterId)
  if (filters.subjectId) query = query.eq('subject_id', filters.subjectId)
  query = query.order(filters.sort === 'title' ? 'title' : 'created_at', { ascending: filters.sort === 'title' })
  const page = Math.max(0, filters.page ?? 0)
  query = query.range(page * RESOURCE_PAGE_SIZE, (page + 1) * RESOURCE_PAGE_SIZE - 1)
  const { data, error } = await query
  if (error) throw new Error(`Unable to load resources: ${error.message}`)
  return addEngagement(client, (data ?? []) as unknown as Array<Omit<ResourceRecord, 'rating' | 'rating_count' | 'is_bookmarked'>>, userId)
}

export async function fetchSavedResources(
  client: SupabaseClient,
  userId: string,
): Promise<ResourceRecord[]> {
  const { data: saved, error: savedError } = await client
    .from('bookmarks')
    .select('resource_id')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (savedError) throw new Error(`Unable to load saved resources: ${savedError.message}`)
  const ids = (saved ?? []).map((item) => item.resource_id)
  if (!ids.length) return []
  const { data, error } = await client
    .from('resources')
    .select(resourceSelect)
    .in('id', ids)
    .eq('status', 'approved')
  if (error) throw new Error(`Unable to load saved resources: ${error.message}`)
  const resources = await addEngagement(
    client,
    (data ?? []) as unknown as Array<Omit<ResourceRecord, 'rating' | 'rating_count' | 'is_bookmarked'>>,
    userId,
  )
  return ids.map((id) => resources.find((resource) => resource.id === id)).filter(
    (resource): resource is ResourceRecord => Boolean(resource),
  )
}

export async function fetchResource(
  client: SupabaseClient,
  userId: string,
  resourceId: string,
): Promise<ResourceRecord> {
  const { data, error } = await client.from('resources').select(resourceSelect).eq('id', resourceId).single()
  if (error || !data) throw new Error(error?.message ?? 'Resource not found.')
  const [resource] = await addEngagement(
    client,
    [data as unknown as Omit<ResourceRecord, 'rating' | 'rating_count' | 'is_bookmarked'>],
    userId,
  )
  return resource
}

export async function fetchMySubmissions(client: SupabaseClient, userId: string): Promise<ResourceRecord[]> {
  const { data, error } = await client
    .from('resources')
    .select(resourceSelect)
    .eq('created_by', userId)
    .order('created_at', { ascending: false })
  if (error) throw new Error(`Unable to load your submissions: ${error.message}`)
  return addEngagement(client, (data ?? []) as unknown as Array<Omit<ResourceRecord, 'rating' | 'rating_count' | 'is_bookmarked'>>, userId)
}

export async function createResource(
  client: SupabaseClient,
  userId: string,
  input: ResourceInput,
): Promise<void> {
  if (!isGoogleDriveUrl(input.googleDriveUrl)) {
    throw new Error('Enter a valid Google Drive or Google Docs URL.')
  }
  const slug = `${input.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-${crypto.randomUUID().slice(0, 8)}`
  const { error } = await client.from('resources').insert({
    title: input.title.trim(),
    slug,
    description: input.description.trim() || null,
    resource_type: input.resourceType,
    college_id: input.collegeId,
    branch_id: input.branchId,
    semester_id: input.semesterId,
    subject_id: input.subjectId,
    google_drive_url: input.googleDriveUrl.trim(),
    cover_image_url: input.coverImageUrl?.trim() || null,
    created_by: userId,
    status: 'pending',
  })
  if (error) throw new Error(`Unable to submit resource: ${error.message}`)
}

export async function toggleBookmark(
  client: SupabaseClient,
  userId: string,
  resourceId: string,
  saved: boolean,
): Promise<void> {
  const result = saved
    ? await client.from('bookmarks').delete().eq('user_id', userId).eq('resource_id', resourceId)
    : await client.from('bookmarks').insert({ user_id: userId, resource_id: resourceId })
  if (result.error) throw new Error(`Unable to update saved resources: ${result.error.message}`)
}

export async function reportResource(
  client: SupabaseClient,
  userId: string,
  resourceId: string,
  reason: ResourceReportReason,
  details: string,
): Promise<void> {
  const { error } = await client.from('resource_reports').upsert(
    {
      user_id: userId,
      resource_id: resourceId,
      reason,
      details: details.trim() || null,
    },
    { onConflict: 'resource_id,user_id' },
  )
  if (error) throw new Error(`Unable to report resource: ${error.message}`)
}

export async function trackResourceEvent(
  client: SupabaseClient,
  resourceId: string,
  event: 'view' | 'share',
): Promise<void> {
  const { error } = await client.rpc('track_resource_event', {
    p_resource_id: resourceId,
    p_event: event,
  })
  if (error) throw new Error(`Unable to track resource ${event}: ${error.message}`)
}

export async function rateResource(
  client: SupabaseClient,
  userId: string,
  resourceId: string,
  rating: number,
): Promise<void> {
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) throw new Error('Rating must be between 1 and 5.')
  const { error } = await client.from('resource_ratings').upsert(
    { user_id: userId, resource_id: resourceId, rating },
    { onConflict: 'resource_id,user_id' },
  )
  if (error) throw new Error(`Unable to save rating: ${error.message}`)
}

export async function fetchAdminResources(
  client: SupabaseClient,
  status: ResourceStatus,
): Promise<ResourceRecord[]> {
  const { data, error } = await client
    .from('resources')
    .select(resourceSelect)
    .eq('status', status)
    .order('created_at', { ascending: false })
  if (error) throw new Error(`Unable to load admin resources: ${error.message}`)
  return (data ?? []) as unknown as ResourceRecord[]
}

export async function reviewResource(
  client: SupabaseClient,
  resourceId: string,
  status: Exclude<ResourceStatus, 'pending'>,
  note: string,
): Promise<void> {
  const { error } = await client.rpc('admin_review_resource', {
    p_resource_id: resourceId,
    next_status: status,
    review_note: note.trim() || null,
  })
  if (error) throw new Error(`Unable to review resource: ${error.message}`)
}
