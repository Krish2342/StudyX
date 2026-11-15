/* ==========================================================================
   STUDYX — SHARED TYPES
   One source of truth for every shape used across the app.
   ========================================================================== */

export type Role = 'student' | 'admin'

export interface Student {
  id: string
  name: string
  email: string
  role: Role
  avatarInitials: string
  college: string
  branch: string
  semester: number
  preferredLanguage: 'English' | 'Hindi' | 'Gujarati'
  answerStyle: 'Exam Ready' | 'Knowledge'
}

export type ResourceCategory =
  | 'Notes'
  | 'Books'
  | 'Assignments'
  | 'Previous Year Papers'
  | 'Question Banks'
  | 'Lab Manuals'
  | 'PPTs'
  | 'Important Questions'
  | 'Study Material'
  | 'Other'

export interface Resource {
  id: string
  title: string
  category: ResourceCategory
  college: string
  branch: string
  semester: number
  subject: string
  rating: number
  downloads: number
  addedBy: string
  addedAt: string
  description: string
}

export interface AiTool {
  id: string
  name: string
  description: string
  icon: string
  group: 'Generate' | 'Understand' | 'Prepare'
}

export interface ContinueItem {
  id: string
  title: string
  subject: string
  progress: number
  lastSeen: string
}

export interface CommunityPost {
  id: string
  author: string
  subject: string
  snippet: string
  replies: number
  likes: number
}

export interface AppNotification {
  id: string
  title: string
  body: string
  time: string
  read: boolean
  kind: 'approval' | 'request' | 'reply' | 'announcement' | 'plan'
}

export interface ResourceRequest {
  id: string
  title: string
  category: ResourceCategory
  status: 'Pending' | 'Added' | 'Not Available'
  createdAt: string
}

export type ToastTone = 'info' | 'success' | 'error'

export interface ToastItem {
  id: number
  message: string
  tone: ToastTone
}
