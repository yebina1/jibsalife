import { useEffect, useRef, useState } from 'react'
import './StatusMessageBar.css'
import {
  STATE_BAR_MESSAGE_EVENT,
  type StateBarMessageDetail,
  type StateBarMessagePlacement,
} from '../utils/stateBarMessage'

type StatusMessageState = {
  message: string
  placement: StateBarMessagePlacement
  closeButton: boolean
  actionLabel?: string
  onAction?: () => void
}

function StatusMessageBar() {
  const [toast, setToast] = useState<StatusMessageState | null>(null)
  const timeoutRef = useRef<number | null>(null)

  useEffect(() => {
    const clearMessageTimeout = () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }

    const hideMessage = () => {
      clearMessageTimeout()
      setToast(null)
    }

    const handleMessage = (event: Event) => {
      const detail = (event as CustomEvent<StateBarMessageDetail>).detail
      if (!detail?.message) return

      const resolvedPlacement: StateBarMessagePlacement =
        detail.placement ?? (detail.message.includes('알림') ? 'notification' : 'footer')

      clearMessageTimeout()
      setToast({
        message: detail.message,
        placement: resolvedPlacement,
        closeButton: detail.closeButton ?? true,
        actionLabel: detail.actionLabel,
        onAction: detail.onAction,
      })
      timeoutRef.current = window.setTimeout(() => {
        setToast(null)
        timeoutRef.current = null
      }, detail.duration ?? 3000)
    }

    window.addEventListener(STATE_BAR_MESSAGE_EVENT, handleMessage)

    return () => {
      hideMessage()
      window.removeEventListener(STATE_BAR_MESSAGE_EVENT, handleMessage)
    }
  }, [])

  if (!toast) return null

  return (
    <div
      className={`status_message_bar${
        toast.placement === 'notification' ? ' status_message_bar_notification' : ''
      }${toast.placement === 'sheet' ? ' status_message_bar_sheet' : ''}`}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="status_message_bar_inner">
        <p className="status_message_bar_text">{toast.message}</p>
        {toast.actionLabel && toast.onAction && (
          <button
            type="button"
            className="status_message_bar_badge"
            onClick={() => { toast.onAction?.(); setToast(null) }}
          >
            {toast.actionLabel}
          </button>
        )}
        {toast.closeButton && (
          <button
            type="button"
            className="status_message_bar_close"
            aria-label="닫기"
            onClick={() => setToast(null)}
          >
            ×
          </button>
        )}
      </div>
    </div>
  )
}

export default StatusMessageBar
