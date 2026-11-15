import type { AiTool, AppNotification, CommunityPost, ContinueItem, Resource, ResourceRequest, Student } from '@/types'

/**
 * The contract every data source must satisfy.
 *
 * Today `demoAdapter` implements it with hardcoded arrays.
 * In Stage 2 a `apiAdapter` implements it with real HTTP calls —
 * the UI does not change at all.
 */
export interface StudyXAdapter {
  getStudent(): Promise<Student>
  getResources(): Promise<Resource[]>
  getAiTools(): Promise<AiTool[]>
  getContinueWatching(): Promise<ContinueItem[]>
  getRequests(): Promise<ResourceRequest[]>
  getCommunity(): Promise<CommunityPost[]>
  getNotifications(): Promise<AppNotification[]>
}
