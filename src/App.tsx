import { lazy, Suspense, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { PageLoader } from '@/components/ui/PageLoader'

/*
 * Every route is code-split, so a first-time visitor to the landing page
 * never downloads the dashboard bundle (and vice versa).
 */
const Landing = lazy(() => import('@/pages/Landing').then((m) => ({ default: m.Landing })))
const Login = lazy(() => import('@/pages/Login').then((m) => ({ default: m.Login })))
const ForgotPassword = lazy(() => import('@/pages/ForgotPassword').then((m) => ({ default: m.ForgotPassword })))
const Onboarding = lazy(() => import('@/pages/Onboarding').then((m) => ({ default: m.Onboarding })))
const Suspended = lazy(() => import('@/pages/Suspended').then((m) => ({ default: m.Suspended })))
const Dashboard = lazy(() => import('@/pages/Dashboard').then((m) => ({ default: m.Dashboard })))
const Explore = lazy(() => import('@/pages/Explore').then((m) => ({ default: m.Explore })))
const ResourceDetail = lazy(() => import('@/pages/ResourceDetail').then((m) => ({ default: m.ResourceDetail })))
const SubmitResource = lazy(() => import('@/pages/SubmitResource').then((m) => ({ default: m.SubmitResource })))
const StudySpace = lazy(() => import('@/pages/StudySpace').then((m) => ({ default: m.StudySpace })))
const SavedResources = lazy(() => import('@/pages/SavedResources').then((m) => ({ default: m.SavedResources })))
const Requests = lazy(() => import('@/pages/Requests').then((m) => ({ default: m.Requests })))
const Support = lazy(() => import('@/pages/Support').then((m) => ({ default: m.Support })))
const Community = lazy(() => import('@/pages/Community').then((m) => ({ default: m.Community })))
const Notifications = lazy(() => import('@/pages/Notifications').then((m) => ({ default: m.Notifications })))
const AiTools = lazy(() => import('@/pages/AiTools').then((m) => ({ default: m.AiTools })))
const AppShell = lazy(() =>
  import('@/components/layout/AppShell').then((m) => ({ default: m.AppShell })),
)
const NotFound = lazy(() => import('@/pages/NotFound').then((m) => ({ default: m.NotFound })))
const AdminRoute = lazy(() => import('@/features/admin/AdminGate').then((m) => ({ default: m.AdminRoute })))
const AdminOverview = lazy(() => import('@/pages/AdminOverview').then((m) => ({ default: m.AdminOverview })))
const AdminResourceManagement = lazy(() =>
  import('@/pages/AdminResourceManagement').then((m) => ({ default: m.AdminResourceManagement })),
)
const AdminSectionPlaceholder = lazy(() =>
  import('@/pages/AdminSectionPlaceholder').then((m) => ({ default: m.AdminSectionPlaceholder })),
)
const AdminControls = lazy(() =>
  import('@/pages/AdminControls').then((m) => ({ default: m.AdminControls })),
)
import { adminNavItems, findAdminNavItem } from '@/features/admin/nav/adminNav'
const StudentRoute = lazy(() =>
  import('@/features/auth/AuthGate').then((m) => ({ default: m.StudentRoute })),
)
const OnboardingRoute = lazy(() =>
  import('@/features/auth/AuthGate').then((m) => ({ default: m.OnboardingRoute })),
)
const Profile = lazy(() =>
  import('@/pages/Profile').then((m) => ({ default: m.Profile })),
)
const Settings = lazy(() =>
  import('@/pages/Settings').then((m) => ({ default: m.Settings })),
)

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
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/suspended" element={<Suspended />} />
          <Route element={<OnboardingRoute />}>
            <Route path="/onboarding" element={<Onboarding />} />
          </Route>

          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminOverview />} />
            {adminNavItems.filter((item) => item.path).map((item) => (
              <Route
                key={item.path}
                path={`/admin/${item.path}`}
                element={
                  item.path === 'resources'
                    ? <AdminResourceManagement />
                    : <AdminControls section={item.path} />
                }
              />
            ))}
            <Route
              path="/admin/*"
              element={<AdminSectionPlaceholder item={findAdminNavItem('/admin') ?? adminNavItems[0]} />}
            />
          </Route>

          {/* App experience (shell = sidebar + top bar + bottom nav) */}
          <Route element={<StudentRoute />}>
            <Route path="/app" element={<AppShell />}>
              <Route index element={<Dashboard />} />
              <Route path="explore" element={<Explore />} />
              <Route path="explore/submit" element={<SubmitResource />} />
              <Route path="explore/:resourceId" element={<ResourceDetail />} />
              <Route path="study-space" element={<StudySpace />} />
              <Route path="saved" element={<SavedResources />} />
              <Route path="community" element={<Community />} />
              <Route path="requests" element={<Requests />} />
              <Route path="support" element={<Support />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="ai" element={<AiTools />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Settings />} />

              <Route path="*" element={<NotFound />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  )
}
