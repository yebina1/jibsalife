import './Alert.css'
import type { ReactNode, Ref } from 'react'

type Props = {
  onClose: () => void
  children?: ReactNode
  dialogRef?: Ref<HTMLElement>
}

function Alert({ onClose, children, dialogRef }: Props) {
  return (
    <div className="alert_layer" role="presentation">
      <button
        type="button"
        className="alert_dim"
        aria-label="?뚮┝ ?リ린"
        onClick={onClose}
      />
      <section ref={dialogRef} className="alert" role="alertdialog" aria-modal="true">
        {children}
      </section>
    </div>
  )
}

export default Alert
