import './health.css'
import './HealthCheckResult.css'
import PageHeader from '../components/PageHeader'
import HealthResultCard from '../components/HealthResultCard'
import HealthResultInsights from '../components/HealthResultInsights'
import HealthResultSummary from '../components/HealthResultSummary'
import type { HealthResultSummaryItem } from '../components/HealthResultSummary'
import BackButton from '../components/html/BackButton'
import CloseButton from '../components/html/CloseButton'

const mockHealthResult = {
  score: 82,
  insights: ['이전보다 몸무게가 줄었어요!'],
}

const summaryItems: HealthResultSummaryItem[] = [
  {
    icon: 'warning',
    label: '이상 신호 감지',
    value: '경미한 변화 감지',
    to: '/health/result/detail',
  },
  {
    icon: 'search',
    label: '원인 추정',
    value: '스트레스 가능성',
    to: '/health/result/detail',
  },
  {
    icon: 'chat',
    label: '증상 상담',
    value: '소화 불량 가능성',
    to: '/health/result/detail',
  },
  {
    icon: 'hospital',
    label: '병원 방문 여부 가이드',
    value: '지켜보고 필요 시 방문',
    to: '/health/result/detail',
  },
  {
    icon: 'report',
    label: '병원 방문 리포트 생성',
    value: '리포트 보기',
    to: '/health/result/detail',
  },
]

function HealthCheckResult() {
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
