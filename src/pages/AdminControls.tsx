import { useEffect, useState } from 'react'
import { Check, Search, ShieldAlert } from 'lucide-react'
import { AdminShell } from '@/features/admin/components/AdminShell'
import { AdminStatusPill } from '@/features/admin/components/AdminBrand'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { supabase } from '@/lib/supabase'
import { useAdminAuth } from '@/features/admin/auth/adminAuthContext'
import {
  fetchAcademicRecords,
  fetchAdminUsers,
  fetchAnalytics,
  fetchAuditLogs,
  fetchSettings,
  saveSetting,
  setUserSuspension,
  updateAcademicRecord,
  type AcademicRecord,
  type AdminSetting,
  type AdminUser,
  type AuditLog,
} from '@/services/adminService'

export function AdminControls({ section }: { section: string }) {
  if (section === 'students') return <Students />
  if (section === 'academics') return <Academics />
  if (section === 'analytics') return <Analytics />
  if (section === 'settings' || section === 'ai') return <SettingsPage aiOnly={section === 'ai'} />
  if (section === 'activity') return <Activity />
  return <Queue section={section} />
}

function Frame({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return <AdminShell><div className="flex flex-col gap-6"><div><AdminStatusPill tone="ok">Milestone 8 control</AdminStatusPill><h1 className="mt-4 font-display text-3xl font-semibold text-paper sm:text-4xl">{title}</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-paper-dim">{description}</p></div>{children}</div></AdminShell>
}

function Students() {
  const { user } = useAdminAuth()
  const [search, setSearch] = useState('')
  const [users, setUsers] = useState<AdminUser[]>([])
  const [error, setError] = useState<string | null>(null)
  useEffect(() => { if (!supabase || !user) return; void fetchAdminUsers(supabase, search).then(setUsers).catch((e) => setError(e instanceof Error ? e.message : 'Unable to load students.')) }, [search, user])
  async function toggle(item: AdminUser) { if (!supabase) return; try { await setUserSuspension(supabase, item.id, !item.is_suspended); setUsers((current) => current.map((candidate) => candidate.id === item.id ? { ...candidate, is_suspended: !item.is_suspended } : candidate)) } catch (e) { setError(e instanceof Error ? e.message : 'Unable to update student.') } }
  return <Frame title="Student management" description="Search profiles, review academic context, and suspend or restore accounts. Every change is recorded in the admin activity log."><Input label="Search students" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Name or email" icon={<Search className="size-4" />} />{error && <ErrorText text={error} />}<div className="grid gap-3">{users.map((item) => <Card key={item.id} interactive={false} className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center"><div><h2 className="font-medium text-paper">{item.full_name || 'Unnamed student'}</h2><p className="mt-1 text-sm text-paper-dim">{item.email || 'No email'} · {item.college?.name || 'College not set'} · {item.branch?.name || 'Branch not set'} · {item.semester?.label || 'Semester not set'}</p><p className="mt-2 text-xs text-paper-faint">{item.is_suspended ? 'Suspended account' : 'Active account'}</p></div><Button variant={item.is_suspended ? 'primary' : 'danger'} size="sm" onClick={() => void toggle(item)} disabled={item.id === user?.id}>{item.is_suspended ? 'Restore access' : 'Suspend access'}</Button></Card>)}</div></Frame>
}

function Academics() {
  const [table, setTable] = useState('colleges')
  const [records, setRecords] = useState<AcademicRecord[]>([])
  const [error, setError] = useState<string | null>(null)
  useEffect(() => { if (!supabase) return; void fetchAcademicRecords(supabase, table).then(setRecords).catch((e) => setError(e instanceof Error ? e.message : 'Unable to load catalog.')) }, [table])
  async function toggle(record: AcademicRecord) { if (!supabase) return; try { await updateAcademicRecord(supabase, table, record.id, { is_active: !record.is_active }); setRecords((current) => current.map((item) => item.id === record.id ? { ...item, is_active: !record.is_active } : item)) } catch (e) { setError(e instanceof Error ? e.message : 'Unable to update catalog record.') } }
  return <Frame title="Academic management" description="Keep the catalog clean by activating or deactivating colleges, branches, semesters, and subjects without deleting records referenced by resources."><div className="flex flex-wrap gap-2">{['colleges', 'branches', 'semesters', 'subjects', 'resource_categories'].map((name) => <button key={name} type="button" onClick={() => setTable(name)} className={`rounded-lg px-3 py-2 text-sm capitalize ${table === name ? 'bg-admin-wash text-admin-accent' : 'text-paper-dim hover:text-paper'}`}>{name.replace('_', ' ')}</button>)}</div>{error && <ErrorText text={error} />}<div className="grid gap-3">{records.map((record) => <Card key={record.id} interactive={false} className="flex items-center justify-between gap-4 p-4"><div><p className="font-medium text-paper">{record.name || record.label}</p>{record.slug && <p className="text-xs text-paper-faint">{record.slug}</p>}</div><Button size="sm" variant={record.is_active ? 'danger' : 'primary'} onClick={() => void toggle(record)}>{record.is_active ? 'Deactivate' : 'Activate'}</Button></Card>)}</div></Frame>
}

function Analytics() {
  const [range, setRange] = useState(30)
  const [data, setData] = useState<Record<string, number> | null>(null)
  useEffect(() => { if (!supabase) return; const since = new Date(Date.now() - range * 86400000).toISOString(); void fetchAnalytics(supabase, since).then(setData).catch(() => setData(null)) }, [range])
  return <Frame title="Analytics" description="Operational metrics from tracked resources, AI requests, reports, and support tickets."><div className="flex gap-2">{[1, 7, 30, 90].map((days) => <button key={days} type="button" onClick={() => setRange(days)} className={`rounded-lg px-3 py-2 text-sm ${range === days ? 'bg-admin-wash text-admin-accent' : 'text-paper-dim'}`}>{days === 1 ? 'Today' : `${days} days`}</button>)}</div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{Object.entries(data ?? {}).map(([key, value]) => <Card key={key} interactive={false} className="p-5"><p className="text-xs uppercase text-paper-faint">{key}</p><p className="mt-3 font-display text-3xl text-paper">{value}</p><p className="mt-1 text-xs text-paper-dim">Last {range} days</p></Card>)}</div></Frame>
}

function SettingsPage({ aiOnly }: { aiOnly: boolean }) {
  const [settings, setSettings] = useState<AdminSetting[]>([])
  const [key, setKey] = useState(aiOnly ? 'ai_limits' : 'platform')
  const [value, setValue] = useState(aiOnly ? '{"daily_requests":20,"max_input_characters":4000}' : '{"maintenance_mode":false,"support_email":""}')
  const [message, setMessage] = useState<string | null>(null)
  useEffect(() => { if (!supabase) return; void fetchSettings(supabase).then(setSettings).catch(() => setSettings([])) }, [])
  async function save() { if (!supabase) return; try { await saveSetting(supabase, key, JSON.parse(value) as Record<string, unknown>); setMessage('Saved and added to the audit log.'); setSettings(await fetchSettings(supabase)) } catch (e) { setMessage(e instanceof Error ? e.message : 'Enter valid JSON before saving.') } }
  return <Frame title={aiOnly ? 'AI management' : 'Website settings'} description={aiOnly ? 'Control provider-independent AI limits and feature configuration. Provider credentials remain in Supabase Function Secrets.' : 'Manage platform-wide settings without placing secrets in the browser.'}><Card interactive={false} className="grid gap-4 p-5"><Input label="Setting key" value={key} onChange={(e) => setKey(e.target.value)} /><label className="text-sm font-medium text-paper">JSON value<textarea value={value} onChange={(e) => setValue(e.target.value)} rows={5} className="mt-1 w-full rounded-control border border-white/12 bg-white/4 p-3 font-mono text-sm text-paper focus:border-sky/70 focus:outline-none" /></label><Button onClick={() => void save()} icon={<Check className="size-4" />}>Save setting</Button>{message && <p className="text-sm text-paper-dim" role="status">{message}</p>}</Card><div className="grid gap-3">{settings.map((item) => <Card key={item.key} interactive={false} className="p-4"><p className="font-medium text-paper">{item.key}</p><pre className="mt-2 overflow-auto text-xs text-paper-faint">{JSON.stringify(item.value, null, 2)}</pre></Card>)}</div></Frame>
}

function Activity() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  useEffect(() => { if (supabase) void fetchAuditLogs(supabase).then(setLogs) }, [])
  return <Frame title="Admin activity logs" description="A read-only record of privileged changes, including the previous and new values where available."><div className="grid gap-3">{logs.map((log) => <Card key={log.id} interactive={false} className="p-4"><div className="flex flex-wrap justify-between gap-2"><p className="font-medium text-paper">{log.action} · {log.entity_type}</p><time className="text-xs text-paper-faint">{new Date(log.created_at).toLocaleString()}</time></div><p className="mt-2 text-xs text-paper-faint">{log.entity_id || 'Platform setting'}</p></Card>)}</div></Frame>
}

function Queue({ section }: { section: string }) {
  const labels: Record<string, string> = { requests: 'Resource requests', community: 'Community moderation', support: 'Support center', referrals: 'Referral management', notifications: 'Admin notifications' }
  const table = section === 'requests' ? 'resource_requests' : section === 'community' ? 'community_reports' : section === 'support' ? 'support_tickets' : section === 'referrals' ? 'referral_events' : 'notifications'
  const [rows, setRows] = useState<Array<Record<string, unknown>>>([])
  useEffect(() => { if (!supabase) return; void supabase.from(table).select('*').order('created_at', { ascending: false }).limit(50).then(({ data }) => setRows((data ?? []) as Array<Record<string, unknown>>)) }, [table])
  async function updateStatus(id: string, status: string) {
    if (!supabase) return
    const { error } = await supabase.from(table).update({ status }).eq('id', id)
    if (!error) setRows((current) => current.map((row) => row.id === id ? { ...row, status } : row))
  }
  const statusOptions = section === 'requests' ? ['pending', 'added', 'not_available'] : section === 'support' ? ['open', 'in_progress', 'resolved'] : section === 'community' ? ['open', 'reviewing', 'resolved', 'dismissed'] : section === 'referrals' ? ['pending', 'qualified', 'rejected', 'rewarded'] : []
  return <Frame title={labels[section] || 'Admin queue'} description="Review live records using the database-backed moderation and workflow queue. Status changes are protected by admin row-level security."><div className="grid gap-3">{rows.map((row) => <Card key={String(row.id)} interactive={false} className="p-5"><div className="flex flex-wrap justify-between gap-2"><p className="font-medium text-paper">{String(row.subject || row.title || row.reason || row.resource_type || row.type || 'Queue item')}</p>{statusOptions.length ? <select aria-label="Update status" value={String(row.status || '')} onChange={(event) => void updateStatus(String(row.id), event.target.value)} className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-paper"><option value="">Select status</option>{statusOptions.map((option) => <option key={option} value={option}>{option.replace('_', ' ')}</option>)}</select> : <span className="text-xs text-paper-faint">{String(row.status || 'unread')}</span>}</div><p className="mt-2 text-sm text-paper-dim">{String(row.message || row.details || row.request_description || row.body || '')}</p></Card>)}</div>{!rows.length && <Card interactive={false} className="p-8 text-center"><ShieldAlert className="mx-auto size-6 text-admin-accent" /><p className="mt-3 text-sm text-paper-dim">No records are currently waiting for admin attention.</p></Card>}</Frame>
}

function ErrorText({ text }: { text: string }) {
  return <p className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-paper" role="alert">{text}</p>
}
