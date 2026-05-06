import './Alert.css'

type Props = {
  onClose: () => void
  children?: React.ReactNode
}

function Alert({ onClose, children }: Props) {
  return (
    <div className="alert_layer" role="presentation">
      <button
        type="button"
        className="alert_dim"
        aria-label="알림 닫기"
        onClick={onClose}
      />
      <section className="alert" role="alertdialog" aria-modal="true">
        {children}
      </section>
    </div>
  )
}

export default Alert
