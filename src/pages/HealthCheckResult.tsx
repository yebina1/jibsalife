import './health.css'
import './HealthCheckResult.css'
import PageHeader from '../components/PageHeader'
import HealthResultCard from '../components/HealthResultCard'
import HealthResultInsights from '../components/HealthResultInsights'
import HealthResultSummary from '../components/HealthResultSummary'
import BackButton from '../components/html/BackButton'
import CloseButton from '../components/html/CloseButton'
import { createHealthResultSummaryItems, type CareChangeFactor } from '../utils/healthResultPolicy'

const mockHealthResult: {
  score: number
  changeFactor: CareChangeFactor
  insights: string[]
} = {
  score: 82,
  changeFactor: 'none',
  insights: ['기록상 큰 변화는 없고 전반적으로 좋은 상태예요.'],
}

function HealthCheckResult() {
  const summaryItems = createHealthResultSummaryItems({
    score: mockHealthResult.score,
    changeFactor: mockHealthResult.changeFactor,
  })

  return (
    <>
      <PageHeader
        title="AI 건강 체크"
        leftContent={<BackButton />}
        rightContent={<CloseButton />}
      />
      <main className="page health_page health_check_result_page">
        <section className="health_check_result_complete">
          <h1>확인이 완료되었어요!</h1>
          <span aria-hidden="true">
            <i className="bx bx-check"></i>
          </span>
        </section>

        <HealthResultCard score={mockHealthResult.score} />
        <HealthResultInsights items={mockHealthResult.insights} />
        <HealthResultSummary title="확인 결과 요약" items={summaryItems} />
      </main>
    </>
  )
}

export default HealthCheckResult
