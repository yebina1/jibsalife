import { MISSION_ACTIVITY_RECORDS_CHANGE_EVENT } from './missionActivityRecords'
import {
  MISSION_HISTORY_RECORDS_CHANGE_EVENT,
} from './missionHistoryRecords'
import { readUserNotifications } from './userNotifications'

export { MISSION_ACTIVITY_RECORDS_CHANGE_EVENT, MISSION_HISTORY_RECORDS_CHANGE_EVENT }

export const NOTIFICATION_READ_STORAGE_KEY = 'notification_read'
export const NOTIFICATION_READ_CHANGE_EVENT = 'jibsalife.notification.readChange'

const notificationIds = [1, 2, 3, 4]
const initiallyReadNotificationIds = [4]

export function readNotificationReadIds(): Set<number> {
  if (typeof window === 'undefined') return new Set(initiallyReadNotificationIds)

  try {
    const stored = window.sessionStorage.getItem(NOTIFICATION_READ_STORAGE_KEY)
    const fromStorage: number[] = stored ? JSON.parse(stored) : []
    return new Set([...initiallyReadNotificationIds, ...fromStorage])
  } catch {
    return new Set(initiallyReadNotificationIds)
  }
}

export function saveNotificationReadIds(ids: Set<number>) {
  if (typeof window === 'undefined') return

  try {
    window.sessionStorage.setItem(NOTIFICATION_READ_STORAGE_KEY, JSON.stringify([...ids]))
    window.dispatchEvent(new Event(NOTIFICATION_READ_CHANGE_EVENT))
  } catch {
    // ignore storage errors
  }
}

export function shouldShowNotificationDot() {
  if (typeof window === 'undefined') return false

  const readIds = readNotificationReadIds()

  if (notificationIds.some((id) => !readIds.has(id))) return true

  return readUserNotifications().some((n) => !readIds.has(n.id))
}
