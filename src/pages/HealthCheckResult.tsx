import { useNavigate } from 'react-router'
import './health.css'
import './HealthCheckResult.css'
import Header from '../components/Header'
import HealthResultCard from '../components/HealthResultCard'
import HealthResultInsights from '../components/HealthResultInsights'
import HealthResultSummary from '../components/HealthResultSummary'
import Title from '../components/Title'
import Button from '../components/html/Button'
import CloseButton from '../components/html/CloseButton'
import checkMarkIcon from '../svg/Check Mark.svg'
import NoticeText from '../components/NoticeText'

const mockHealthResult = {
  score: 82,
  insights: ['이전보다 몸무게가 줄었어요!'],
}

function HealthCheckResult() {
  const navigate = useNavigate()

  return (
    <>
      <Header title="AI 건강 체크" rightContent={<CloseButton />} />
      <main className="page health_page health_check_result_page">
        <Title as="h3" title="확인이 완료되었어요!">
          <img className="health_check_result_icon" src={checkMarkIcon} alt="" />
        </Title>
        <HealthResultCard score={mockHealthResult.score} />
        <HealthResultInsights items={mockHealthResult.insights} />
        <HealthResultSummary />
        <Button
          type="button"
          className="health_result_detail_btn"
          onClick={() => navigate('/health/result/detail')}
        >
          결과 자세히 보기
        </Button>
        <NoticeText>
            <p>
              ※ 이 결과는 참고용이며,
              <br />
              정확한 진단은 수의사 상담을 통해 확인해주세요.
            </p>
          </NoticeText>
      </main>
    </>
  )
}

export default HealthCheckResult
