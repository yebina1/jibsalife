import './Alert.css'
import type { ReactNode, Ref } from 'react'
import { createPortal } from 'react-dom'

type Props = {
  onClose: () => void
  children?: ReactNode
  dialogRef?: Ref<HTMLElement>
}

function Alert({ onClose, children, dialogRef }: Props) {
  const content = (
    <div className="alert_layer" role="presentation">
      <button
        type="button"
        className="alert_dim"
        aria-label="닫기"
        onClick={onClose}
      />
      <section ref={dialogRef} className="alert" role="alertdialog" aria-modal="true">
        {children}
      </section>
    </div>
  )

  if (typeof document === 'undefined') {
    return content
  }

  return createPortal(content, document.body)
}

export default Alert
