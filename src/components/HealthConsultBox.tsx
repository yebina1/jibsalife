import './HealthConsultBox.css'
import Button from './html/Button'

function HealthConsultBox() {
  return (
    <section className="health_consult_box">
      <p>
        기록해 주신 데이터를 바탕으로
        <br />
        AI가 아이의 상태를 분석해 드려요.
      </p>
      <Button type="button">상담하기</Button>
    </section>
  )
}

export default HealthConsultBox
