import './HealthResultScoreRow.css'

type HealthStatusTone = 'excellent' | 'good' | 'normal' | 'caution' | 'danger'

type HealthResultScoreRowProps = {
  score: number
  statusScore?: number
}

function getHealthStatus(score: number): { label: string; tone: HealthStatusTone } {
  if (score >= 90) return { label: '아주 좋음', tone: 'excellent' }
  if (score >= 75) return { label: '좋음', tone: 'good' }
  if (score >= 60) return { label: '보통', tone: 'normal' }
  if (score >= 40) return { label: '주의', tone: 'caution' }
  return { label: '관리 필요', tone: 'danger' }
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
