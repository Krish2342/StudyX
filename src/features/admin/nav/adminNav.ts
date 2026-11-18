import {
  BarChart3,
  Bell,
  BookOpen,
  Building2,
  Cpu,
  FileText,
  Gift,
  LayoutDashboard,
  LifeBuoy,
  MessagesSquare,
  ScrollText,
  Settings,
  Users,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

/** Build phases from the implementation plan; the admin panel is Phase 1. */
export type AdminPhase = 3 | 4 | 5 | 6

export type AdminGroupId = 'command' | 'content' | 'people' | 'growth' | 'control'

/**
 * One destination in the admin console.
 *
 * `path` is the segment under `/admin` ('' is the overview itself) and doubles
 * as the route definition in `AdminRoutes`, so navigation and routing can never
 * drift apart.
 */
export interface AdminNavItem {
  path: string
  label: string
  icon: LucideIcon
  /** Short description used by search, breadcrumbs and the placeholder page. */
  blurb: string
  /** Phase that connects this section to the database. */
  phase: AdminPhase
  /** What the section will contain once it is live. */
  deliverables: string[]
}

export interface AdminNavGroup {
  id: AdminGroupId
  label: string
  items: AdminNavItem[]
}

/**
 * The 13 sections, in the order the product brief lists them (A → M).
 *
 * The groupings break the list into readable blocks; they never reorder it.
 */
export const adminNavGroups: AdminNavGroup[] = [
  {
    id: 'command',
    label: 'Command',
    items: [
      {
        path: '',
        label: 'Overview',
        icon: LayoutDashboard,
        blurb: 'Platform health, pending work and the numbers that matter today.',
        phase: 4,
        deliverables: [
          'Headline counts: students, resources, pending approvals, open tickets',
          'Registration, submission and AI usage trends with date filters',
          'Every value read from the database, never hard-coded',
        ],
      },
    ],
  },
  {
    id: 'content',
    label: 'Content & academics',
    items: [
      {
        path: 'resources',
        label: 'Resource Management',
        icon: BookOpen,
        blurb: 'Review, edit and publish every note, book and paper on the platform.',
        phase: 3,
        deliverables: [
          'Tabs for pending, approved, rejected and removed resources',
          'Approve, reject with a reason, and notify the uploader',
          'Replace a Drive link on the existing row, keeping ratings and bookmarks',
        ],
      },
      {
        path: 'academics',
        label: 'Academic Management',
        icon: Building2,
        blurb: 'Colleges, branches, semesters, subjects and resource categories.',
        phase: 4,
        deliverables: [
          'Create, edit and deactivate colleges, branches and semesters',
          'Subjects linked to a college, branch and semester',
          'Duplicate academic records rejected before they are saved',
        ],
      },
      {
        path: 'students',
        label: 'Student Management',
        icon: Users,
        blurb: 'Find a student, review their activity and suspend or restore them.',
        phase: 4,
        deliverables: [
          'Search and filter by college, branch and semester',
          'Profile view with submissions, requests and support history',
          'Suspend and restore, with every change written to the audit log',
        ],
      },
      {
        path: 'requests',
        label: 'Resource Requests',
        icon: FileText,
        blurb: 'Student requests for missing notes, books and papers.',
        phase: 4,
        deliverables: [
          'Pending, added and not-available queues',
          'Fulfil a request by uploading a resource or linking an existing one',
          'Notify the student when their request is answered',
        ],
      },
    ],
  },
  {
    id: 'people',
    label: 'People & support',
    items: [
      {
        path: 'community',
        label: 'Community Management',
        icon: MessagesSquare,
        blurb: 'Discussions and replies, with tools to hide abuse and review reports.',
        phase: 5,
        deliverables: [
          'Browse and search discussions with their replies',
          'Hide a discussion or remove a reply, with a reason',
          'Review reports and restore content that was removed by mistake',
        ],
      },
      {
        path: 'support',
        label: 'Support Center',
        icon: LifeBuoy,
        blurb: 'Bug reports, broken resources, questions and feedback in one inbox.',
        phase: 5,
        deliverables: [
          'Open, in-progress and resolved ticket queues',
          'Reply to the student inside the ticket thread',
          'Internal notes that the student never sees',
        ],
      },
    ],
  },
  {
    id: 'growth',
    label: 'Growth & automation',
    items: [
      {
        path: 'ai',
        label: 'AI Management',
        icon: Cpu,
        blurb: 'Providers, models, feature switches and usage limits.',
        phase: 6,
        deliverables: [
          'Enable or disable Gemini, OpenAI and Groq per feature',
          'Daily and monthly limits on usage, pages and output size',
          'Failed requests and estimated cost, with keys kept server-side',
        ],
      },
      {
        path: 'referrals',
        label: 'Referral Management',
        icon: Gift,
        blurb: 'Referral activity, qualification status and suspicious patterns.',
        phase: 5,
        deliverables: [
          'Referrer, referred account, date and qualification status',
          'Detect self-referrals and duplicate or fraudulent activity',
          'Rewards stay disabled until the rules are explicitly approved',
        ],
      },
      {
        path: 'notifications',
        label: 'Notifications',
        icon: Bell,
        blurb: 'A single inbox for work that needs an administrator.',
        phase: 5,
        deliverables: [
          'Unread counts for submissions, tickets, reports and AI errors',
          'Open the related record directly from the notification',
          'Mark as read, one at a time or in bulk',
        ],
      },
    ],
  },
  {
    id: 'control',
    label: 'Insight & control',
    items: [
      {
        path: 'analytics',
        label: 'Analytics',
        icon: BarChart3,
        blurb: 'Growth, approval rates and usage, measured from tracked events.',
        phase: 6,
        deliverables: [
          'Today, 7, 30 and 90 day ranges plus a custom range',
          'Resource growth, approval rate and most-opened resources',
          'AI usage by feature and provider, support resolution rate',
        ],
      },
      {
        path: 'settings',
        label: 'Website Settings',
        icon: Settings,
        blurb: 'Platform identity, availability switches and default limits.',
        phase: 6,
        deliverables: [
          'Platform name, description, logo and support contacts',
          'Maintenance mode and per-area availability switches',
          'Default language, limits and the allowed resource categories',
        ],
      },
      {
        path: 'activity',
        label: 'Admin Activity Logs',
        icon: ScrollText,
        blurb: 'Who changed what, when, and what the value was before.',
        phase: 6,
        deliverables: [
          'Admin, action, entity type and entity id for every change',
          'Previous and new values where they matter',
          'Read-only for everyone, including administrators',
        ],
      },
    ],
  },
]

/** Flat list in the brief's order — used by routing and search. */
export const adminNavItems: AdminNavItem[] = adminNavGroups.flatMap((group) => group.items)

/** Absolute href for a section, so links are built one way only. */
export function adminHref(path: string): string {
  return path ? `/admin/${path}` : '/admin'
}

/** The section that owns a pathname, or null when the path is not ours. */
export function findAdminNavItem(pathname: string): AdminNavItem | null {
  if (!pathname.startsWith('/admin')) return null
  const segment = pathname.slice('/admin'.length).replace(/^\/+/, '').split('/')[0]
  return adminNavItems.find((item) => item.path === segment) ?? null
}
