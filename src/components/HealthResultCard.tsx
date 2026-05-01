import './HealthResultCard.css'
import HealthResultCardTop from './HealthResultCardTop'

type HealthResultCardProps = {
  score: number
}

function HealthResultCard({ score }: HealthResultCardProps) {
  return (
    <section className="health_result_card">
      <HealthResultCardTop score={score} />

      <div className="health_result_meter">
        <div className="health_result_meter_track">
          <div className="health_result_meter_fill"></div>
        </div>
        <div className="health_result_meter_labels">
          <span>0</span>
          <span>50</span>
          <span>100</span>
        </div>
      </div>
    </section>
  )
}

export default HealthResultCard
