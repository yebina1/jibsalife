import './HealthResultScoreRow.css'

type HealthResultScoreRowProps = {
  score: number
}

function getHealthStatus(score: number) {
  if (score >= 90) return '아주 좋음'
  if (score >= 75) return '좋음'
  if (score >= 60) return '보통'
  if (score >= 40) return '주의'
  return '관리필요'
}

function HealthResultScoreRow({ score }: HealthResultScoreRowProps) {
  const status = getHealthStatus(score)

  return (
    <div className="health_result_score_row">
      <strong>{score}점</strong>
      <span>{status}</span>
    </div>
  )
}

export default HealthResultScoreRow
