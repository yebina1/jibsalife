import './ConfirmDialog.css'
import Alert from './Alert'
import Button from './html/Button'

type ConfirmDialogProps = {
  message: string
  description?: React.ReactNode
  onCancel: () => void
  onConfirm: () => void
  cancelLabel?: string
  confirmLabel?: string
  hideCancel?: boolean
  accentColor?: string
  cancelButtonStyle?: React.CSSProperties
  dialogClassName?: string
}

function ConfirmDialog({
  message,
  description,
  onCancel,
  onConfirm,
  cancelLabel = '아니요',
  confirmLabel = '네',
  hideCancel = false,
  accentColor,
  cancelButtonStyle,
  dialogClassName,
}: ConfirmDialogProps) {
  return (
    <Alert onClose={onCancel} dialogClassName={dialogClassName}>
      <div className="confirm_dialog_copy">
        <p className="confirm_dialog_msg">{message}</p>
        {description ? <p className="confirm_dialog_desc">{description}</p> : null}
      </div>
      <div className="confirm_dialog_btns">
        {!hideCancel ? (
          <Button type="button" className="white_btn" style={cancelButtonStyle} onClick={onCancel}>
            {cancelLabel}
          </Button>
        ) : null}
        <Button
          type="button"
          className="purple_btn"
          style={accentColor ? { backgroundColor: accentColor, borderColor: accentColor } : undefined}
          onClick={onConfirm}
        >
          {confirmLabel}
        </Button>
      </div>
    </Alert>
  )
}

export default ConfirmDialog
