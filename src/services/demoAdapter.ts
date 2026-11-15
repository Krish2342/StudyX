import {
  demoAiTools,
  demoCommunity,
  demoContinue,
  demoNotifications,
  demoRequests,
  demoResources,
} from '@/data/dashboard'
import { demoStudent } from '@/data/student'
import type { StudyXAdapter } from './adapter'

/**
 * DEMO ADAPTER — resolves hardcoded data after a short fake delay
 * so the UI can show realistic loading states.
 *
 * Nothing here touches a network, a database or an AI service.
 * Replace this file with an API implementation in Stage 2.
 */
const delay = (ms = 280) => new Promise((resolve) => setTimeout(resolve, ms))

export const demoAdapter: StudyXAdapter = {
  async getStudent() {
    await delay(120)
    return demoStudent
  },
  async getResources() {
    await delay()
    return demoResources
  },
  async getAiTools() {
    await delay(160)
    return demoAiTools
  },
  async getContinueWatching() {
    await delay(200)
    return demoContinue
  },
  async getRequests() {
    await delay(240)
    return demoRequests
  },
  async getCommunity() {
    await delay(260)
    return demoCommunity
  },
  async getNotifications() {
    await delay(140)
    return demoNotifications
  },
}
