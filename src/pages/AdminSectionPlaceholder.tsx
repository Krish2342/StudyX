import { ArrowLeft, LockKeyhole } from 'lucide-react'
import { Link } from 'react-router-dom'
import { AdminShell } from '@/features/admin/components/AdminShell'
import type { AdminNavItem } from '@/features/admin/nav/adminNav'
import { AdminOverviewLink } from '@/features/admin/components/AdminBreadcrumb'
import { Button } from '@/components/ui/Button'

export function AdminSectionPlaceholder({ item }: { item: AdminNavItem }) {
  return (
    <AdminShell>
      <div className="mx-auto flex max-w-2xl flex-col items-center py-16 text-center">
        <span className="grid size-14 place-items-center rounded-2xl bg-admin-wash text-admin-accent">
          <LockKeyhole className="size-6" aria-hidden="true" />
        </span>
        <p className="mt-6 text-xs font-semibold tracking-[0.16em] text-admin-accent uppercase">
          Planned section Â· Milestone {item.phase}
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-paper">{item.label}</h1>
        <p className="mt-3 text-sm leading-6 text-paper-dim">{item.blurb}</p>
        <div className="mt-6 rounded-xl border border-white/8 bg-white/3 px-5 py-4 text-left">
          <p className="text-xs font-semibold tracking-wide text-paper uppercase">Planned capabilities</p>
          <ul className="mt-3 flex flex-col gap-2 text-sm leading-6 text-paper-dim">
            {item.deliverables.map((deliverable) => <li key={deliverable}>â€¢ {deliverable}</li>)}
          </ul>
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/admin">
            <Button icon={<ArrowLeft className="size-4" />}>Back to overview</Button>
          </Link>
          <AdminOverviewLink />
        </div>
      </div>
    </AdminShell>
  )
}
