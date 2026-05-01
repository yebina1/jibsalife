import './HealthResultCardTop.css'
import HealthResultScoreRow from './HealthResultScoreRow'
import Title from './Title'

type HealthResultCardTopProps = {
  score: number
}

function HealthResultCardTop({ score }: HealthResultCardTopProps) {
  return (
    <div className="health_result_card_top">
      <div className="health_result_summary">
        <Title as="h2" title="종합 컨디션" />
        <HealthResultScoreRow score={score} />
      </div>
      <div className="health_result_thumbnail" aria-hidden="true"></div>
    </div>
  )
}

export default HealthResultCardTop
