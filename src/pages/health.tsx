import { useNavigate } from 'react-router'
import './health.css'
import Header from '../components/Header'
import HealthCheck from '../components/HealthCheck'
import HealthConsultBox from '../components/HealthConsultBox'
import NoticeText from '../components/NoticeText'
import Title from '../components/Title'
import BackButton from '../components/html/BackButton'
import aboutIcon from '../svg/About.svg'
import Button from '../components/html/Button'

function Health() {
  const navigate = useNavigate()

  return (
    <>
      <Header
        title="AI 건강 체크"
        leftContent={<BackButton />}
        rightContent={
          <div className="health_guide">
            <img src={aboutIcon} alt="" />
            <span>내용 가이드</span>
          </div>
        }
      />
      <main className="page health_page">
        <Title
          as="h1"
          title={
            <>
              우리 아이의 상태를
              <br />
              확인해 볼까요?
            </>
          }
        >
          <p>
            영상, 음성, 사진, 메모 중
            <br />
            편한 방법으로 기록해 주세요
          </p>
        </Title>
        <Button type="button" className="health_manual_record_btn">
          반려동물 수동 기록 입력하기
          <i className="bx bx-chevron-right"></i>
        </Button>
        <HealthCheck />
        <HealthConsultBox
          buttonText="분석하기"
          onButtonClick={() => navigate('/health/check-loading')}
        >
          <p>
            기록해 주신 데이터를 바탕으로
            <br />
            AI가 아이의 상태를 분석해 드려요.
          </p>
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

export default Health
