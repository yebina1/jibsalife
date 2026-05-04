import './health.css'
import './HealthResultDetail.css'
import PageHeader from '../components/PageHeader'
import BackButton from '../components/html/BackButton'
import HealthResultDetailBox from '../components/HealthResultDetailBox'
import {
  calculateHealthResult,
  createHealthResultDetailItems,
  readStoredHealthResultInput,
} from '../utils/healthResultPolicy'

function HealthResultDetail() {
  const result = calculateHealthResult(readStoredHealthResultInput())
  const detailItems = createHealthResultDetailItems(result)

  return (
    <>
      <PageHeader title="AI 건강 체크" leftContent={<BackButton />} />
      <main className="page health_page health_result_detail_page">
        <HealthResultDetailBox items={detailItems} />
      </main>
    </>
  )
}

export default HealthResultDetail
