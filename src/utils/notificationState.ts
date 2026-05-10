import {
  MISSION_ACTIVITY_RECORDS_CHANGE_EVENT,
  readMissionActivityRecords,
} from './missionActivityRecords'
import {
  MISSION_HISTORY_RECORDS_CHANGE_EVENT,
  readMissionHistoryRecordsWithDefaults,
  toMissionHistoryRecord,
} from './missionHistoryRecords'

export { MISSION_ACTIVITY_RECORDS_CHANGE_EVENT, MISSION_HISTORY_RECORDS_CHANGE_EVENT }

function getTodayDateKey() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export function shouldShowNotificationDot() {
  const todayDateKey = getTodayDateKey()
  const records = [
    ...readMissionActivityRecords().map(toMissionHistoryRecord),
    ...readMissionHistoryRecordsWithDefaults(),
  ]

  return records.filter((record) => (
    record.date === todayDateKey &&
    record.source !== 'health'
  )).length === 0
}
