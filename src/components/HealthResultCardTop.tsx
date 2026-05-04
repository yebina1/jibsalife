import './HealthResultCardTop.css'
import HealthResultScoreRow from './HealthResultScoreRow'

type HealthResultCardTopProps = {
  score: number
  statusScore?: number
}

function HealthResultCardTop({ score, statusScore = score }: HealthResultCardTopProps) {
  const checkIcon = `${import.meta.env.BASE_URL}check.svg`

  return (
    <div className="health_result_card_top">
      <div className="health_result_summary">
        <h2>종합 컨디션</h2>
        <HealthResultScoreRow score={score} statusScore={statusScore} />
      </div>
      <div className="health_result_thumbnail_box">
        <img className="health_result_thumbnail" src={checkIcon} alt="" aria-hidden="true" />
      </div>
    </div>
  )
}

export default HealthResultCardTop
