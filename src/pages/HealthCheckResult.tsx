import './health.css'
import './HealthCheckResult.css'
import Header from '../components/Header'
import Title from '../components/Title'
import BackButton from '../components/html/BackButton'
import checkMarkIcon from '../svg/Check Mark.svg'

function HealthCheckResult() {
  return (
    <>
      <Header title="AI 건강 체크" leftContent={<BackButton />} />
      <main className="page health_page health_check_result_page">
        <Title as="h3" title="확인이 완료되었어요!">
          <img className="health_check_result_icon" src={checkMarkIcon} alt="" />
        </Title>
      </main>
    </>
  )
}

export default HealthCheckResult
