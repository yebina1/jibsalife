import { useEffect, useRef, useState } from 'react'
import batteryIcon from '../svg/Battery.svg'
import cellularIcon from '../svg/Combined Shape.svg'
import wifiIcon from '../svg/Wi-Fi.svg'
import './StateBar.css'
import Time from './Time'
import {
  STATE_BAR_MESSAGE_EVENT,
  type StateBarMessageDetail,
} from '../utils/stateBarMessage'

function StateBar() {
  const [message, setMessage] = useState('')
  const timeoutRef = useRef<number | null>(null)

  useEffect(() => {
    const clearMessageTimeout = () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }

    const handleMessage = (event: Event) => {
      const detail = (event as CustomEvent<StateBarMessageDetail>).detail
      if (!detail?.message) return

      clearMessageTimeout()
      setMessage(detail.message)

      timeoutRef.current = window.setTimeout(() => {
        setMessage('')
        timeoutRef.current = null
      }, detail.duration ?? 2200)
    }

    window.addEventListener(STATE_BAR_MESSAGE_EVENT, handleMessage)

    return () => {
      clearMessageTimeout()
      window.removeEventListener(STATE_BAR_MESSAGE_EVENT, handleMessage)
    }
  }, [])

  return (
    <div className="state_bar" aria-label="status bar">
      <Time />
      <div className="state_bar_icons">
        <img className="state_bar_cellular" src={cellularIcon} alt="셀룰러 신호" />
        <img className="state_bar_wifi" src={wifiIcon} alt="와이파이" />
        <img className="state_bar_battery" src={batteryIcon} alt="배터리" />
      </div>
      <div
        className={`state_bar_message${message ? ' is_visible' : ''}`}
        aria-live="polite"
        aria-atomic="true"
      >
        {message}
      </div>
    </div>
  )
}

export default StateBar
