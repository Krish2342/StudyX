import { lazy, Suspense, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { PageLoader } from '@/components/ui/PageLoader'

/*
 * Every route is code-split, so a first-time visitor to the landing page
 * never downloads the dashboard bundle (and vice versa).
 */
const Landing = lazy(() => import('@/pages/Landing').then((m) => ({ default: m.Landing })))
const Dashboard = lazy(() => import('@/pages/Dashboard').then((m) => ({ default: m.Dashboard })))
const AppShell = lazy(() =>
  import('@/components/layout/AppShell').then((m) => ({ default: m.AppShell })),
)
const Placeholder = lazy(() =>
  import('@/pages/Placeholder').then((m) => ({ default: m.Placeholder })),
)
const NotFound = lazy(() => import('@/pages/NotFound').then((m) => ({ default: m.NotFound })))

/** Sections that exist in the navigation but are not open yet. */
const upcomingSections = [
  {
    path: 'explore',
    title: 'Explore',
    description:
      'Resource categories, filters, sorting, resource detail pages and submission forms.',
  },
  {
    path: 'saved',
    title: 'Saved',
    description:
      'Everything you bookmarked, with filters by category, subject and semester.',
  },
  {
    path: 'ai',
    title: 'AI Tools',
    description:
      'Thirteen study tools for assignments, quizzes, flashcards, translations and study plans.',
  },
  {
    path: 'study-space',
    title: 'My Study Space',
    description:
      'Saved resources, AI history, quizzes, flashcards, study plans and submissions.',
  },
  {
    path: 'community',
    title: 'Community',
    description: 'Subject-based discussions: ask, reply, like, search and filter.',
  },
  {
    path: 'requests',
    title: 'Resource Requests',
    description: 'Request missing notes, books and papers — and track their status.',
  },
  {
    path: 'support',
    title: 'Support',
    description: 'Raise a ticket and follow its progress from open to resolved.',
  },
  {
    path: 'notifications',
    title: 'Notifications',
    description: 'Approvals, fulfilled requests, admin replies and announcements.',
  },
  {
    path: 'profile',
    title: 'Profile',
    description: 'Your academic details, preferred language and answer style.',
  },
  {
    path: 'settings',
    title: 'Settings',
    description: 'Account preferences, appearance and privacy controls.',
  },
]

/** Scroll to the top whenever the path changes. */
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [pathname])
  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public experience */}
          <Route path="/" element={<Landing />} />

          {/* App experience (shell = sidebar + top bar + bottom nav) */}
          <Route path="/app" element={<AppShell />}>
            <Route index element={<Dashboard />} />

            {upcomingSections.map((section) => (
              <Route
                key={section.path}
                path={section.path}
                element={
                  <Placeholder title={section.title} description={section.description} />
                }
              />
            ))}

            <Route path="*" element={<NotFound />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  )
}
