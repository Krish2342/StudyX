import { useState } from 'react'
import type { FormEvent, SelectHTMLAttributes } from 'react'
import { Pencil } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { fetchAcademicCatalog, type ProfileRecord } from '@/services/profileService'
import type { ResourceRecord } from '@/services/resourceService'
import type { RequestRecord, TicketRecord } from '@/services/workflowService'

export function Overview({
  editing, setEditing, profile, catalog, saving, onSave, tickets,
}: {
  editing: boolean
  setEditing: (value: boolean) => void
  profile: ProfileRecord | null
  catalog: Awaited<ReturnType<typeof fetchAcademicCatalog>>
  saving: boolean
  onSave: (event: FormEvent<HTMLFormElement>) => Promise<void>
  tickets: TicketRecord[]
}) {
  const [collegeId, setCollegeId] = useState(profile?.college_id ?? '')
  const [branchId, setBranchId] = useState(profile?.branch_id ?? '')
  const filteredBranches = catalog.branches.filter((branch) => branch.college_id === collegeId)

  if (!editing) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <Card interactive={false} className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div><h2 className="font-display text-xl font-semibold text-paper">Academic profile</h2><p className="mt-1 text-sm text-paper-dim">Information used for resource recommendations.</p></div>
            <Button variant="secondary" size="sm" icon={<Pencil className="size-4" />} onClick={() => setEditing(true)}>Edit</Button>
          </div>
          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            <Detail label="Preferred language" value={profile?.preferred_language || 'English'} />
            <Detail label="Semester" value={profile?.semester?.label || 'Not set'} />
            <Detail label="College" value={profile?.college?.name || 'Not set'} />
            <Detail label="Branch" value={profile?.branch?.name || 'Not set'} />
          </dl>
        </Card>
        <Card interactive={false} className="p-6">
          <h2 className="font-display text-xl font-semibold text-paper">Support status</h2>
          <p className="mt-1 text-sm text-paper-dim">Recent help requests and their current state.</p>
          <div className="mt-6 space-y-3">
            {tickets.length ? tickets.slice(0, 3).map((ticket) => (
              <Link key={ticket.id} to="/app/support" className="flex items-center justify-between gap-3 rounded-xl bg-white/4 px-4 py-3">
                <div className="min-w-0"><p className="truncate text-sm font-medium text-paper">{ticket.subject}</p><p className="mt-1 text-xs text-paper-faint">{ticket.ticket_number}</p></div>
                <StatusLabel status={ticket.status} />
              </Link>
            )) : <p className="rounded-xl bg-white/4 px-4 py-5 text-sm text-paper-dim">No support tickets yet.</p>}
          </div>
        </Card>
      </div>
    )
  }

  return (
    <Card interactive={false} className="p-6 sm:p-8">
      <div className="flex items-start justify-between gap-4"><div><h2 className="font-display text-xl font-semibold text-paper">Edit academic profile</h2><p className="mt-1 text-sm text-paper-dim">Keep your college and semester information current.</p></div><Button variant="ghost" size="sm" onClick={() => setEditing(false)}>Cancel</Button></div>
      <form onSubmit={(event) => void onSave(event)} className="mt-6 grid gap-5 md:grid-cols-2">
        <Input name="fullName" label="Full name" defaultValue={profile?.full_name || ''} required />
        <Select name="collegeId" label="College" value={collegeId} onChange={(event) => { setCollegeId(event.target.value); setBranchId('') }} required>
          <option value="">Select college</option>{catalog.colleges.map((college) => <option key={college.id} value={college.id}>{college.name}</option>)}
        </Select>
        <Select name="branchId" label="Branch" value={branchId} onChange={(event) => setBranchId(event.target.value)} required disabled={!collegeId}>
          <option value="">Select branch</option>{filteredBranches.map((branch) => <option key={branch.id} value={branch.id}>{branch.name}</option>)}
        </Select>
        <Select name="semesterId" label="Semester" defaultValue={profile?.semester_id || ''} required>
          <option value="">Select semester</option>{catalog.semesters.map((semester) => <option key={semester.id} value={semester.id}>{semester.label}</option>)}
        </Select>
        <Select name="language" label="Preferred language" defaultValue={profile?.preferred_language || 'English'}>
          <option>English</option><option>Hindi</option><option>Gujarati</option>
        </Select>
        <div className="md:col-span-2 flex justify-end"><Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save changes'}</Button></div>
      </form>
    </Card>
  )
}

export function SubmissionList({ submissions }: { submissions: ResourceRecord[] }) {
  return <Card interactive={false} className="p-6"><Header title="My submissions" description="Track every resource you submitted." action="Upload resource" href="/app/explore/submit" />{submissions.length ? <div className="mt-5 divide-y divide-white/8">{submissions.map((resource) => <div key={resource.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"><div><Link to={`/app/explore/${resource.id}`} className="font-medium text-paper hover:text-sky">{resource.title}</Link><p className="mt-1 text-xs text-paper-faint">{resource.resource_type} · {new Date(resource.created_at).toLocaleDateString()}</p>{resource.admin_note && <p className="mt-2 text-sm text-paper-dim">{resource.admin_note}</p>}</div><StatusLabel status={resource.status} /></div>)}</div> : <EmptyState text="You have not uploaded a resource yet." action="Submit a resource" href="/app/explore/submit" />}</Card>
}

export function RequestList({ requests }: { requests: RequestRecord[] }) {
  return <Card interactive={false} className="p-6"><Header title="Resource requests" description="Requested materials and admin decisions." action="New request" href="/app/requests" />{requests.length ? <div className="mt-5 divide-y divide-white/8">{requests.map((request) => <div key={request.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-medium text-paper">{request.resource_type}</p><p className="mt-1 max-w-2xl text-sm text-paper-dim">{request.request_description}</p><p className="mt-1 text-xs text-paper-faint">{new Date(request.created_at).toLocaleDateString()}</p></div><StatusLabel status={request.status} /></div>)}</div> : <EmptyState text="You have not requested any resources." action="Request a resource" href="/app/requests" />}</Card>
}

export function TicketList({ tickets }: { tickets: TicketRecord[] }) {
  return <Card interactive={false} className="p-6"><Header title="Support tickets" description="Questions and issues submitted to StudyX." action="Contact support" href="/app/support" />{tickets.length ? <div className="mt-5 divide-y divide-white/8">{tickets.map((ticket) => <div key={ticket.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-medium text-paper">{ticket.subject}</p><p className="mt-1 text-xs text-paper-faint">{ticket.ticket_number} · {ticket.category}</p></div><StatusLabel status={ticket.status} /></div>)}</div> : <EmptyState text="You do not have open support tickets." action="Create a ticket" href="/app/support" />}</Card>
}

function Detail({ label, value }: { label: string; value: string }) {
  return <div><dt className="text-xs text-paper-faint">{label}</dt><dd className="mt-1 text-sm font-medium text-paper">{value}</dd></div>
}

function Select({ label, children, ...props }: SelectHTMLAttributes<HTMLSelectElement> & { label: string }) {
  return <label className="flex flex-col gap-1.5 text-sm font-medium text-paper">{label}<select {...props} className="h-11 rounded-control border border-white/12 bg-ink-raised-2 px-3.5 text-sm text-paper focus:border-sky/70 focus:outline-none disabled:opacity-50">{children}</select></label>
}

function StatusLabel({ status }: { status: string }) {
  return <span className="shrink-0 rounded-full border border-sky/30 bg-sky-wash px-2.5 py-1 text-xs font-semibold text-sky capitalize">{status.replaceAll('_', ' ')}</span>
}

function Header({ title, description, action, href }: { title: string; description: string; action: string; href: string }) {
  return <div className="flex items-center justify-between gap-4"><div><h2 className="font-display text-xl font-semibold text-paper">{title}</h2><p className="mt-1 text-sm text-paper-dim">{description}</p></div><Link className="text-sm font-semibold text-sky" to={href}>{action}</Link></div>
}

function EmptyState({ text, action, href }: { text: string; action: string; href: string }) {
  return <div className="mt-6 rounded-xl border border-white/8 bg-white/3 p-8 text-center"><p className="text-sm text-paper-dim">{text}</p><Link to={href} className="mt-4 inline-flex text-sm font-semibold text-sky">{action}</Link></div>
}
