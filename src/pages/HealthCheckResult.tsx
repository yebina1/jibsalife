import './Health.css'
import './HealthCheckResult.css'
import PageHeader from '../components/PageHeader'
import ContentSection from '../components/ContentSection'
import HealthResultCard from '../components/HealthResultCard'
import HealthResultInsights from '../components/HealthResultInsights'
import HealthResultSummary from '../components/HealthResultSummary'
import BackButton from '../components/html/BackButton'
import CloseButton from '../components/html/CloseButton'
import {
  calculateHealthResult,
  createHealthResultSummaryItems,
  readStoredHealthResultInput,
} from '../utils/healthResultPolicy'

function HealthCheckResult() {
  const result = calculateHealthResult(readStoredHealthResultInput())
  const summaryItems = createHealthResultSummaryItems(result.summary)

  return (
    <>
      <PageHeader
        title="AI 건강 체크"
        leftContent={<BackButton />}
        rightContent={<CloseButton />}
      />
      <main className="page health_page health_check_result_page">
        <ContentSection className="health_check_result_complete" titleAs="h1" title="확인이 완료되었어요!">
          <span aria-hidden="true">
            <i className="bx bx-check"></i>
          </span>
        </ContentSection>

        <HealthResultCard score={result.score} />
        <HealthResultInsights items={result.insights} />
        <HealthResultSummary title="확인 결과 요약" items={summaryItems} />
      </main>
    </>
  )
}

export default HealthCheckResult
