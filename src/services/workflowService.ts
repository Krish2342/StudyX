import type { SupabaseClient } from '@supabase/supabase-js'

export interface RequestRecord {
  id: string
  resource_type: string
  request_description: string
  additional_message: string | null
  status: 'pending' | 'added' | 'not_available'
  admin_note: string | null
  created_at: string
}

export interface TicketRecord {
  id: string
  ticket_number: string
  category: string
  subject: string
  message: string
  status: 'open' | 'in_progress' | 'resolved'
  created_at: string
}

export interface DiscussionRecord {
  id: string
  title: string
  body: string
  created_at: string
  user_id: string
  author: { full_name: string | null } | null
  subject: { name: string } | null
  replies: Array<{ id: string; body: string; created_at: string; user_id: string; author: { full_name: string | null } | null }>
}

export interface NotificationRecord {
  id: string
  type: string
  title: string
  body: string
  target_url: string | null
  is_read: boolean
  created_at: string
}

export async function fetchRequests(client: SupabaseClient, userId: string): Promise<RequestRecord[]> {
  const { data, error } = await client.from('resource_requests').select('id, resource_type, request_description, additional_message, status, admin_note, created_at').eq('user_id', userId).order('created_at', { ascending: false })
  if (error) throw new Error(`Unable to load resource requests: ${error.message}`)
  return data ?? []
}

export async function createRequest(client: SupabaseClient, userId: string, input: { resourceType: string; description: string; message: string }): Promise<void> {
  const { error } = await client.from('resource_requests').insert({
    user_id: userId,
    resource_type: input.resourceType.trim(),
    request_description: input.description.trim(),
    additional_message: input.message.trim() || null,
  })
  if (error) throw new Error(`Unable to submit resource request: ${error.message}`)
}

export async function fetchTickets(client: SupabaseClient, userId: string): Promise<TicketRecord[]> {
  const { data, error } = await client.from('support_tickets').select('id, ticket_number, category, subject, message, status, created_at').eq('user_id', userId).order('created_at', { ascending: false })
  if (error) throw new Error(`Unable to load support tickets: ${error.message}`)
  return data ?? []
}

export async function createTicket(client: SupabaseClient, userId: string, input: { category: string; subject: string; message: string }): Promise<void> {
  const ticketNumber = `SX-${crypto.randomUUID().replaceAll('-', '').slice(0, 10).toUpperCase()}`
  const { error } = await client.from('support_tickets').insert({
    user_id: userId,
    ticket_number: ticketNumber,
    category: input.category,
    subject: input.subject.trim(),
    message: input.message.trim(),
  })
  if (error) throw new Error(`Unable to create support ticket: ${error.message}`)
}

export async function fetchDiscussions(client: SupabaseClient): Promise<DiscussionRecord[]> {
  const { data, error } = await client
    .from('community_posts')
    .select('id, title, body, created_at, user_id, author:profiles!community_posts_user_id_fkey(full_name), subject:subjects(name), replies:community_replies(id, body, created_at, user_id, author:profiles!community_replies_user_id_fkey(full_name))')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
  if (error) throw new Error(`Unable to load discussions: ${error.message}`)
  return (data ?? []) as unknown as DiscussionRecord[]
}

export async function createDiscussion(client: SupabaseClient, userId: string, input: { title: string; body: string; subjectId?: string }): Promise<void> {
  const { error } = await client.from('community_posts').insert({
    user_id: userId,
    title: input.title.trim(),
    body: input.body.trim(),
    subject_id: input.subjectId || null,
  })
  if (error) throw new Error(`Unable to create discussion: ${error.message}`)
}

export async function replyToDiscussion(client: SupabaseClient, userId: string, postId: string, body: string): Promise<void> {
  const { error } = await client.from('community_replies').insert({ post_id: postId, user_id: userId, body: body.trim() })
  if (error) throw new Error(`Unable to post reply: ${error.message}`)
}

export async function fetchNotifications(client: SupabaseClient, userId: string): Promise<NotificationRecord[]> {
  const { data, error } = await client.from('notifications').select('id, type, title, body, target_url, is_read, created_at').eq('user_id', userId).order('created_at', { ascending: false })
  if (error) throw new Error(`Unable to load notifications: ${error.message}`)
  return data ?? []
}

export async function markNotificationRead(client: SupabaseClient, userId: string, notificationId: string): Promise<void> {
  const { error } = await client.from('notifications').update({ is_read: true }).eq('id', notificationId).eq('user_id', userId)
  if (error) throw new Error(`Unable to update notification: ${error.message}`)
}

export async function markAllNotificationsRead(client: SupabaseClient, userId: string): Promise<void> {
  const { error } = await client.from('notifications').update({ is_read: true }).eq('user_id', userId).eq('is_read', false)
  if (error) throw new Error(`Unable to update notifications: ${error.message}`)
}
