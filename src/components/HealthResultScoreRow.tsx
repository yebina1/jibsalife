import './HealthResultScoreRow.css'
import { getHealthStatus } from '../utils/healthResultPolicy'

type HealthResultScoreRowProps = {
  score: number
  statusScore?: number
}

function HealthResultScoreRow({ score, statusScore = score }: HealthResultScoreRowProps) {
  const status = getHealthStatus(statusScore)

  return (
    <div className="health_result_score_row">
      <strong>
        {score}
        <span>점</span>
      </strong>
      <em className={`health_result_score_status ${status.tone}`}>{status.label}</em>
    </div>
  )
}

export default HealthResultScoreRow
