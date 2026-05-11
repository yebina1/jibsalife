import {
  MISSION_ACTIVITY_RECORDS_CHANGE_EVENT,
  readMissionActivityRecords,
} from './missionActivityRecords'
import {
  MISSION_HISTORY_RECORDS_CHANGE_EVENT,
  readStoredMissionHistoryRecords,
} from './missionHistoryRecords'

export { MISSION_ACTIVITY_RECORDS_CHANGE_EVENT, MISSION_HISTORY_RECORDS_CHANGE_EVENT }

function getTodayDateKey() {
  const today = new Date()
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
}

export function shouldShowNotificationDot() {
  if (typeof window === 'undefined') return false

  const todayDateKey = getTodayDateKey()
  const activityRecords = readMissionActivityRecords()
  const storedHistoryRecords = readStoredMissionHistoryRecords()
  const hasTodayRecord = [...activityRecords, ...storedHistoryRecords].some(
    (record) => record.date === todayDateKey,
  )

  return !hasTodayRecord
}
