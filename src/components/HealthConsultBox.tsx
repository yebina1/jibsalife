import type { ReactNode } from 'react'
import './HealthConsultBox.css'
import Button from './html/Button'

type HealthConsultBoxProps = {
  children: ReactNode
  buttonText?: string
  onButtonClick?: () => void
}

function HealthConsultBox({
  children,
  buttonText = '상담하기',
  onButtonClick,
}: HealthConsultBoxProps) {
  return (
    <section className="health_consult_box">
      <div className="health_consult_box_text">{children}</div>
      <Button type="button" onClick={onButtonClick}>
        {buttonText}
      </Button>
    </section>
  )
}

export default HealthConsultBox
