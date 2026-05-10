import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import './Button.css'
import {
  MISSION_ACTIVITY_RECORDS_CHANGE_EVENT,
  MISSION_HISTORY_RECORDS_CHANGE_EVENT,
  shouldShowNotificationDot,
} from '../../utils/notificationState'

type Buttonprops = React.ComponentPropsWithRef<'button'> & {
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  buttonVariant?: 'default' | 'icon' | 'challenge'
}

export default function Button(props: Buttonprops) {
  const navigate = useNavigate()
  const {
    children,
    className,
    icon,
    iconPosition = 'left',
    buttonVariant = 'default',
    disabled,
    onClick,
    ...rest
  } = props

  const ariaLabel = String(rest['aria-label'] ?? '')
  const notificationSignature = `${ariaLabel} ${className ?? ''}`.toLowerCase()
  const isNotificationButton =
    notificationSignature.includes('notification') ||
    notificationSignature.includes('알림')

  const [shouldShowNotification, setShouldShowNotification] = useState(
    () => (isNotificationButton ? shouldShowNotificationDot() : false),
  )

  useEffect(() => {
    if (!isNotificationButton) return

    const syncNotificationState = () => {
      setShouldShowNotification(shouldShowNotificationDot())
    }

    window.addEventListener(MISSION_ACTIVITY_RECORDS_CHANGE_EVENT, syncNotificationState)
    window.addEventListener(MISSION_HISTORY_RECORDS_CHANGE_EVENT, syncNotificationState)
    window.addEventListener('storage', syncNotificationState)

    return () => {
      window.removeEventListener(MISSION_ACTIVITY_RECORDS_CHANGE_EVENT, syncNotificationState)
      window.removeEventListener(MISSION_HISTORY_RECORDS_CHANGE_EVENT, syncNotificationState)
      window.removeEventListener('storage', syncNotificationState)
    }
  }, [isNotificationButton])

  const classNames = [
    className,
    isNotificationButton ? 'header_notification_button' : null,
    isNotificationButton && shouldShowNotification ? 'is_active' : null,
    disabled && buttonVariant !== 'icon' ? 'is_disabled' : null,
    buttonVariant === 'icon' ? 'button_icon' : null,
    buttonVariant === 'challenge' ? 'button_challenge' : null,
  ]
    .filter(Boolean)
    .join(' ')

  const needsSmallRadiusLabel = classNames.split(' ').includes('s_white_radius_btn')
  const content = needsSmallRadiusLabel ? (
    <span className="s_white_radius_btn_label">{children}</span>
  ) : (
    children
  )

  return (
    <button
      {...rest}
      disabled={disabled}
      className={classNames}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented && isNotificationButton && !onClick) {
          navigate('/mission')
        }
      }}
    >
      {icon && iconPosition === 'left' ? (
        <span className="button_icon_asset" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <span className="button_label">{content}</span>
      {icon && iconPosition === 'right' ? (
        <span className="button_icon_asset" aria-hidden="true">
          {icon}
        </span>
      ) : null}
    </button>
  )
}
