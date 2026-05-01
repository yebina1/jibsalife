import { useNavigate } from 'react-router'
import './health.css'
import './HealthResultDetail.css'
import Header from '../components/Header'
import BackButton from '../components/html/BackButton'
import HealthResultCard from '../components/HealthResultCard'
import HealthResultDetailBox from '../components/HealthResultDetailBox'
import HealthConsultBox from '../components/HealthConsultBox'
import NoticeText from '../components/NoticeText'

const mockHealthResult = {
  score: 82,
}

function HealthResultDetail() {
  const navigate = useNavigate()

  return (
    <>
      <Header title="AI 건강 체크" 
      leftContent={<BackButton />}
      rightContent={
        <p>오늘 AI 건강체크 1/1회 사용</p>
        } />
      <main className="page health_page health_result_detail_page">
        <HealthResultCard score={mockHealthResult.score} />
        <HealthResultDetailBox />
        <HealthConsultBox
          buttonText="상담하기"
          onButtonClick={() => navigate('/health/qna')}
        >
          <h3>
            궁금한 점이 있으시다면
            <br />
            수의사와 상담해 보세요
          </h3>
          <p>전문가의 의견으로 더 안심할 수 있어요.</p>
        </HealthConsultBox>
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

export default HealthResultDetail
