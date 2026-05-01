import './HealthResultCard.css'
import HealthResultCardTop from './HealthResultCardTop'
import HealthResultMeter from './HealthResultMeter'

type HealthResultCardProps = {
  score: number
}

function HealthResultCard({ score }: HealthResultCardProps) {
  return (
    <section className="health_result_card">
      <HealthResultCardTop score={score} />
      <HealthResultMeter score={score} />
    </section>
  )
}

export default HealthResultCard
