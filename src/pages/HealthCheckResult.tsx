import './health.css'
import './HealthCheckResult.css'
import Header from '../components/Header'
import HealthResultCard from '../components/HealthResultCard'
import Title from '../components/Title'
import CloseButton from '../components/html/CloseButton'
import checkMarkIcon from '../svg/Check Mark.svg'

const mockHealthScore = 90

function HealthCheckResult() {
  return (
    <>
      <Header title="AI 건강 체크" rightContent={<CloseButton />} />
      <main className="page health_page health_check_result_page">
        <Title as="h3" title="확인이 완료되었어요!">
          <img className="health_check_result_icon" src={checkMarkIcon} alt="" />
        </Title>
        <HealthResultCard score={mockHealthScore} />
      </main>
    </>
  )
}

export default HealthCheckResult
