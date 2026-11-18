import { Activity, ArrowRight, Database, LockKeyhole, ShieldCheck } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AdminShell } from '@/features/admin/components/AdminShell'
import { AdminStatusPill } from '@/features/admin/components/AdminBrand'
import { adminNavItems } from '@/features/admin/nav/adminNav'
import { Card } from '@/components/ui/Card'
import { supabase } from '@/lib/supabase'
import { fetchAdminMetrics, type AdminMetric } from '@/services/adminService'

export function AdminOverview() {
  const [metrics, setMetrics] = useState<AdminMetric[]>([])
  useEffect(() => {
    if (supabase) void fetchAdminMetrics(supabase).then(setMetrics)
  }, [])
  return (
    <AdminShell>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <AdminStatusPill tone="ok">Verified Super Admin</AdminStatusPill>
            <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-paper sm:text-4xl">
              Platform overview
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-paper-dim">
              Monitor the platform, manage access, and review operational work from one database-backed console.
            </p>
          </div>
          <Link to="/app" className="inline-flex items-center gap-2 text-sm font-medium text-admin-accent hover:text-paper">
            Open student app <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {metrics.map((metric) => (
            <Card key={metric.label} interactive={false} className="p-5">
              <p className="text-xs font-semibold tracking-wide text-paper-faint uppercase">{metric.label}</p>
              <p className="mt-3 font-display text-3xl font-semibold text-paper">{metric.value}</p>
              <p className="mt-1 text-sm text-paper-dim">{metric.detail}</p>
            </Card>
          ))}
          <FoundationCard icon={ShieldCheck} title="Access control" detail="Database role verification is active." />
          <FoundationCard icon={Database} title="Database foundation" detail="Schema and row-level policies are installed." />
          <FoundationCard icon={LockKeyhole} title="Privileged actions" detail="User and setting changes are audited." />
        </div>

        <Card interactive={false} className="p-6 sm:p-8">
          <div className="flex items-start gap-3">
            <Activity className="mt-0.5 size-5 text-admin-accent" aria-hidden="true" />
            <div>
              <h2 className="font-display text-xl font-semibold text-paper">Admin sections</h2>
              <p className="mt-1 text-sm leading-6 text-paper-dim">
                Use the control sections below to manage users, academics, settings, moderation, analytics, and audit history.
              </p>
            </div>
          </div>
          <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {adminNavItems.filter((item) => item.path).map((item) => (
              <Link
                key={item.path}
                to={`/admin/${item.path}`}
                className="group rounded-xl border border-white/8 bg-white/3 p-4 transition-colors hover:border-admin-accent/40 hover:bg-admin-wash"
              >
                <span className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-paper">{item.label}</span>
                  <ArrowRight className="size-4 text-paper-faint transition-transform group-hover:translate-x-0.5 group-hover:text-admin-accent" aria-hidden="true" />
                </span>
                <span className="mt-2 block text-xs leading-5 text-paper-faint">{item.blurb}</span>
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </AdminShell>
  )
}

function FoundationCard({
  icon: Icon,
  title,
  detail,
}: {
  icon: typeof ShieldCheck
  title: string
  detail: string
}) {
  return (
    <Card interactive={false} className="p-5">
      <Icon className="size-5 text-admin-accent" aria-hidden="true" />
      <h2 className="mt-4 font-display text-lg font-semibold text-paper">{title}</h2>
      <p className="mt-1 text-sm leading-6 text-paper-dim">{detail}</p>
    </Card>
  )
}
