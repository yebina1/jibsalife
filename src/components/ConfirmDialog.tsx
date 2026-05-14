import './ConfirmDialog.css'
import Alert from './Alert'
import Button from './html/Button'

type ConfirmDialogProps = {
  message: string
  onCancel: () => void
  onConfirm: () => void
  cancelLabel?: string
  confirmLabel?: string
  hideCancel?: boolean
}

function ConfirmDialog({
  message,
  onCancel,
  onConfirm,
  cancelLabel = '아니요',
  confirmLabel = '네',
  hideCancel = false,
}: ConfirmDialogProps) {
  return (
    <Alert onClose={onCancel}>
      <p className="confirm_dialog_msg">{message}</p>
      <div className="confirm_dialog_btns">
        {!hideCancel ? (
          <Button type="button" className="white_btn" onClick={onCancel}>
            {cancelLabel}
          </Button>
        ) : null}
        <Button type="button" className="purple_btn" onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </Alert>
  )
}

export default ConfirmDialog
