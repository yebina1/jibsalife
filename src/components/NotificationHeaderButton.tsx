import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import Button from './html/Button'
import HeaderIcon from './HeaderIcon'
import {
  MISSION_ACTIVITY_RECORDS_CHANGE_EVENT,
  NOTIFICATION_READ_CHANGE_EVENT,
  shouldShowNotificationDot,
  MISSION_HISTORY_RECORDS_CHANGE_EVENT,
} from '../utils/notificationState'

type NotificationHeaderButtonProps = {
  className?: string
}

function NotificationHeaderButton({ className }: NotificationHeaderButtonProps) {
  const navigate = useNavigate()
  const [shouldShowNotification, setShouldShowNotification] = useState(
    () => shouldShowNotificationDot(),
  )

  useEffect(() => {
    const syncNotificationState = () => {
      setShouldShowNotification(shouldShowNotificationDot())
    }

    window.addEventListener(MISSION_ACTIVITY_RECORDS_CHANGE_EVENT, syncNotificationState)
    window.addEventListener(MISSION_HISTORY_RECORDS_CHANGE_EVENT, syncNotificationState)
    window.addEventListener(NOTIFICATION_READ_CHANGE_EVENT, syncNotificationState)
    window.addEventListener('storage', syncNotificationState)

    return () => {
      window.removeEventListener(MISSION_ACTIVITY_RECORDS_CHANGE_EVENT, syncNotificationState)
      window.removeEventListener(MISSION_HISTORY_RECORDS_CHANGE_EVENT, syncNotificationState)
      window.removeEventListener(NOTIFICATION_READ_CHANGE_EVENT, syncNotificationState)
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
