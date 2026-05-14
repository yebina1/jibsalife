import './StatusMessage.css'

type StatusMessagePlacement = 'top' | 'bottom'
type StatusMessageVariant = 'single' | 'multi'

type StatusMessageProps = {
  message: string | string[]
  open?: boolean
  placement?: StatusMessagePlacement
  variant?: StatusMessageVariant
  onClose?: () => void
  className?: string
}

function getMessageLines(message: StatusMessageProps['message']) {
  if (Array.isArray(message)) return message.filter(Boolean)
  return message.split('\n').filter(Boolean)
}

function StatusMessage({
  message,
  open = true,
  placement = 'bottom',
  variant,
  onClose,
  className = '',
}: StatusMessageProps) {
  if (!open) return null

  const lines = getMessageLines(message)
  const resolvedVariant = variant ?? (lines.length > 1 ? 'multi' : 'single')
  const classNames = [
    'status_message',
    `status_message_${placement}`,
    `status_message_${resolvedVariant}`,
    className,
  ].filter(Boolean).join(' ')

  return (
    <div className={classNames} role="status" aria-live="polite">
      <div className="status_message_text">
        {lines.map((line, index) => (
          <span key={`${line}-${index}`}>{line}</span>
        ))}
      </div>
      {onClose ? (
        <button type="button" className="status_message_close" aria-label="상태 메시지 닫기" onClick={onClose}>
          <span aria-hidden="true" />
        </button>
      ) : null}
    </div>
  )
}

export default StatusMessage
