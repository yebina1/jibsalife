import { useNavigate } from 'react-router'
import './health.css'
import PageHeader from '../components/PageHeader'
import HealthCheck from '../components/HealthCheck'
import type { HealthCheckOption } from '../components/HealthCheck'
import HealthConsultBox from '../components/HealthConsultBox'
import NoticeText from '../components/NoticeText'
import Title from '../components/Title'
import BackButton from '../components/html/BackButton'
import aboutIcon from '../svg/About.svg'
import Button from '../components/html/Button'
import contents4 from '../img/contents4.png'

const healthCheckOptions: HealthCheckOption[] = [
  {
    id: 'photo',
    icon: 'bx bx-camera',
    label: '사진 촬영',
  },
  {
    id: 'audio',
    icon: 'bx bx-volume-full',
    label: '녹음 촬영',
  },
  {
    id: 'video',
    icon: 'bx bx-video',
    label: '영상 촬영',
  },
  {
    id: 'memo',
    icon: 'bx bx-notepad',
    label: '메모 작성',
  },
]

function Health() {
  const navigate = useNavigate()

  return (
    <>
      <PageHeader
        title="AI 건강 체크"
        leftContent={<BackButton />}
      />
      <main className="page health_page">
        <section className="health_intro">
          <div className='health_guide'>
            <img src={aboutIcon} alt="" />
            <span>이용 가이드</span>
          </div>
          <div className="health_intro_text">
            <Title
              as="h3"
              title="상태를 확인해 볼까요?"
            >
              <p>
                편한 방식으로 기록해 주세요.
                <br />AI가 펫의 상태를 한눈에 정리해 드려요.
              </p>
            </Title>
            <img className="health_intro_image" src={contents4} alt="" />
          </div>
        </section>
        <Button type="button" className="health_manual_record_btn">
          반려동물 행동 기록 입력하기
          <i className="bx bx-chevron-right"></i>
        </Button>
        <HealthCheck options={healthCheckOptions} />
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
            ※ 이 결과는 참고용이며, 정확한 진단은
            <br />
            수의사 상담을 통해 확인해 주세요.
          </p>
        </NoticeText>
      </main>
    </>
  )
}

export default Health
