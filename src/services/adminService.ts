import type { SupabaseClient } from '@supabase/supabase-js'

export interface AdminMetric {
  label: string
  value: number
  detail: string
}

export interface AdminUser {
  id: string
  full_name: string | null
  email: string | null
  is_suspended: boolean
  created_at: string
  college: { name: string } | null
  branch: { name: string } | null
  semester: { label: string } | null
}

export interface AcademicRecord {
  id: string
  name?: string
  label?: string
  number?: number
  slug?: string
  is_active: boolean
}

export interface AdminSetting {
  key: string
  value: Record<string, unknown>
  updated_at: string
}

export interface AuditLog {
  id: string
  action: string
  entity_type: string
  entity_id: string | null
  created_at: string
  before_data: Record<string, unknown> | null
  after_data: Record<string, unknown> | null
}

async function count(client: SupabaseClient, table: string, filter?: (query: any) => any) {
  let query = client.from(table).select('*', { count: 'exact', head: true })
  if (filter) query = filter(query)
  const { count: total, error } = await query
  if (error) throw new Error(`Unable to load ${table} count: ${error.message}`)
  return total ?? 0
}

export async function fetchAdminMetrics(client: SupabaseClient): Promise<AdminMetric[]> {
  const [students, resources, pending, tickets, reports, aiRequests] = await Promise.all([
    count(client, 'profiles'),
    count(client, 'resources'),
    count(client, 'resources', (query) => query.eq('status', 'pending')),
    count(client, 'support_tickets', (query) => query.in('status', ['open', 'in_progress'])),
    count(client, 'community_reports', (query) => query.in('status', ['open', 'reviewing'])),
    count(client, 'ai_history'),
  ])
  return [
    { label: 'Students', value: students, detail: 'Registered profiles' },
    { label: 'Resources', value: resources, detail: 'All submission states' },
    { label: 'Pending review', value: pending, detail: 'Resources awaiting action' },
    { label: 'Open support', value: tickets, detail: 'Open or in progress' },
    { label: 'Open reports', value: reports, detail: 'Community moderation queue' },
    { label: 'AI requests', value: aiRequests, detail: 'Recorded generations' },
  ]
}

export async function fetchAdminUsers(client: SupabaseClient, search = ''): Promise<AdminUser[]> {
  let query = client
    .from('profiles')
    .select('id, full_name, email, is_suspended, created_at, college:colleges(name), branch:branches(name), semester:semesters(label)')
    .order('created_at', { ascending: false })
    .limit(100)
  if (search.trim()) query = query.or(`full_name.ilike.%${search.trim()}%,email.ilike.%${search.trim()}%`)
  const { data, error } = await query
  if (error) throw new Error(`Unable to load students: ${error.message}`)
  return (data ?? []) as unknown as AdminUser[]
}

export async function setUserSuspension(client: SupabaseClient, userId: string, suspended: boolean) {
  const { error } = await client.rpc('admin_set_user_suspension', { p_user_id: userId, p_suspended: suspended })
  if (error) throw new Error(`Unable to update student: ${error.message}`)
}

export async function fetchAcademicRecords(client: SupabaseClient, table: string): Promise<AcademicRecord[]> {
  const columns = table === 'semesters' ? 'id, label, number, is_active' : 'id, name, slug, is_active'
  const { data, error } = await client.from(table).select(columns).order(table === 'semesters' ? 'number' : 'name')
  if (error) throw new Error(`Unable to load ${table}: ${error.message}`)
  return (data ?? []) as AcademicRecord[]
}

export async function updateAcademicRecord(client: SupabaseClient, table: string, id: string, changes: Record<string, unknown>) {
  const { error } = await client.from(table).update(changes).eq('id', id)
  if (error) throw new Error(`Unable to update ${table}: ${error.message}`)
}

export async function fetchSettings(client: SupabaseClient): Promise<AdminSetting[]> {
  const { data, error } = await client.from('platform_settings').select('key, value, updated_at').order('key')
  if (error) throw new Error(`Unable to load settings: ${error.message}`)
  return (data ?? []) as AdminSetting[]
}

export async function saveSetting(client: SupabaseClient, key: string, value: Record<string, unknown>) {
  const { error } = await client.rpc('admin_upsert_setting', { p_key: key, p_value: value })
  if (error) throw new Error(`Unable to save setting: ${error.message}`)
}

export async function fetchAuditLogs(client: SupabaseClient): Promise<AuditLog[]> {
  const { data, error } = await client
    .from('admin_audit_logs')
    .select('id, action, entity_type, entity_id, created_at, before_data, after_data')
    .order('created_at', { ascending: false })
    .limit(100)
  if (error) throw new Error(`Unable to load activity logs: ${error.message}`)
  return (data ?? []) as AuditLog[]
}

export async function fetchAnalytics(client: SupabaseClient, since: string) {
  const [resources, approvals, ai, reports, tickets] = await Promise.all([
    count(client, 'resources', (query) => query.gte('created_at', since)),
    count(client, 'resources', (query) => query.gte('updated_at', since).eq('status', 'approved')),
    count(client, 'ai_history', (query) => query.gte('created_at', since)),
    count(client, 'community_reports', (query) => query.gte('created_at', since)),
    count(client, 'support_tickets', (query) => query.gte('created_at', since)),
  ])
  return { resources, approvals, ai, reports, tickets }
}
