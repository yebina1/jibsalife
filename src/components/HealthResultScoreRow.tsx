import './HealthResultScoreRow.css'

type HealthResultScoreRowProps = {
  score: number
}

function getHealthStatus(score: number) {
  if (score >= 90) return '아주 좋음'
  if (score >= 75) return '좋음'
  if (score >= 60) return '보통'
  if (score >= 40) return '주의'
  return '관리 필요'
}

function HealthResultScoreRow({ score }: HealthResultScoreRowProps) {
  const status = getHealthStatus(score)

  return (
    <div className="health_result_score_row">
      <strong>
        {score}
        <span>점</span>
      </strong>
      <em>{status}</em>
    </div>
  )
}

export default HealthResultScoreRow
