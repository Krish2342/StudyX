import {
  Bell,
  Bookmark,
  Compass,
  FileText,
  GraduationCap,
  Home,
  LayoutDashboard,
  LifeBuoy,
  MessageSquare,
  Search,
  Settings,
  Sparkles,
  User,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface NavItem {
  label: string
  path: string
  icon: LucideIcon
  /** Shown as a count/indicator in the sidebar. */
  badge?: number
}

/** Desktop sidebar — the full product navigation. */
export const sidebarItems: NavItem[] = [
  { label: 'Dashboard', path: '/app', icon: LayoutDashboard },
  { label: 'Explore', path: '/app/explore', icon: Compass },
  { label: 'AI Tools', path: '/app/ai', icon: Sparkles },
  { label: 'Saved', path: '/app/saved', icon: Bookmark },
  { label: 'My Study Space', path: '/app/study-space', icon: GraduationCap },
  { label: 'Community', path: '/app/community', icon: MessageSquare },
  { label: 'Requests', path: '/app/requests', icon: FileText },
  { label: 'Support', path: '/app/support', icon: LifeBuoy },
]

export const sidebarFooterItems: NavItem[] = [
  { label: 'Settings', path: '/app/settings', icon: Settings },
  { label: 'Profile', path: '/app/profile', icon: User },
]

/** Mobile bottom navigation — deliberately its own information architecture. */
export const bottomNavItems: NavItem[] = [
  { label: 'Home', path: '/app', icon: Home },
  { label: 'Search', path: '/app/explore', icon: Search },
  { label: 'AI', path: '/app/ai', icon: Sparkles },
  { label: 'Saved', path: '/app/saved', icon: Bookmark },
  { label: 'Profile', path: '/app/profile', icon: User },
]

export interface QuickAction {
  label: string
  hint: string
  icon: LucideIcon
  path: string
}

export const quickActions: QuickAction[] = [
  { label: 'Explore notes', hint: 'Browse your college library', icon: Compass, path: '/app/explore' },
  { label: 'Generate study plan', hint: 'Day-by-day up to exam day', icon: Sparkles, path: '/app/ai' },
  { label: 'Ask the community', hint: 'Get answers from seniors', icon: MessageSquare, path: '/app/community' },
  { label: 'Request a resource', hint: 'Ask for missing material', icon: Bell, path: '/app/requests' },
]
