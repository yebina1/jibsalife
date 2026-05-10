import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import Button from './html/Button'
import HeaderIcon from './HeaderIcon'
import {
  MISSION_ACTIVITY_RECORDS_CHANGE_EVENT,
  readMissionActivityRecords,
} from '../utils/missionActivityRecords'
import {
  MISSION_HISTORY_RECORDS_CHANGE_EVENT,
  readMissionHistoryRecordsWithDefaults,
  toMissionHistoryRecord,
} from '../utils/missionHistoryRecords'

type NotificationHeaderButtonProps = {
  className?: string
}

function getTodayDateKey() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function readTodayCalendarRecordCount() {
  const todayDateKey = getTodayDateKey()
  const records = [
    ...readMissionActivityRecords().map(toMissionHistoryRecord),
    ...readMissionHistoryRecordsWithDefaults(),
  ]

  return records.filter((record) => record.date === todayDateKey).length
}

function NotificationHeaderButton({ className }: NotificationHeaderButtonProps) {
  const navigate = useNavigate()
  const [shouldShowNotification, setShouldShowNotification] = useState(
    () => readTodayCalendarRecordCount() === 0,
  )

  useEffect(() => {
    const syncNotificationState = () => {
      setShouldShowNotification(readTodayCalendarRecordCount() === 0)
    }

    window.addEventListener(MISSION_ACTIVITY_RECORDS_CHANGE_EVENT, syncNotificationState)
    window.addEventListener(MISSION_HISTORY_RECORDS_CHANGE_EVENT, syncNotificationState)
    window.addEventListener('storage', syncNotificationState)

    return () => {
      window.removeEventListener(MISSION_ACTIVITY_RECORDS_CHANGE_EVENT, syncNotificationState)
      window.removeEventListener(MISSION_HISTORY_RECORDS_CHANGE_EVENT, syncNotificationState)
      window.removeEventListener('storage', syncNotificationState)
    }
  }, [])

  return (
    <Button
      type="button"
      aria-label="알림"
      className={`header_notification_button${shouldShowNotification ? ' is_active' : ''}${className ? ` ${className}` : ''}`}
      onClick={() => navigate('/mission')}
    >
      <HeaderIcon type="notification" />
    </Button>
  )
}

export default NotificationHeaderButton
