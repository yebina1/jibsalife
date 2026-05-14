import './ConfirmDialog.css'
import Alert from './Alert'
import Button from './html/Button'

type ConfirmDialogProps = {
  message: string
  onCancel: () => void
  onConfirm: () => void
}

function ConfirmDialog({ message, onCancel, onConfirm }: ConfirmDialogProps) {
  return (
    <Alert onClose={onCancel}>
      <p className="confirm_dialog_msg">{message}</p>
      <div className="confirm_dialog_btns">
        <Button type="button" className="white_btn" onClick={onCancel}>아니요</Button>
        <Button type="button" className="purple_btn" onClick={onConfirm}>네</Button>
      </div>
    </Alert>
  )
}

export default ConfirmDialog
