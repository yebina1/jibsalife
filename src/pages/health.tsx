import { useNavigate } from 'react-router'
import './health.css'
import PageHeader from '../components/PageHeader'
import HealthCheck from '../components/HealthCheck'
import type { HealthCheckOption } from '../components/HealthCheck'
import NoticeText from '../components/NoticeText'
import Title from '../components/Title'
import BackButton from '../components/html/BackButton'
import aboutIcon from '../svg/About.svg'
import Button from '../components/html/Button'
import mypetimg from '../img/my pet image.jpg'
import cameraIcon from '../svg/camera.svg'
import camcorderIcon from '../svg/camcorder.svg'
import memoIcon from '../svg/memo.svg'
import voiceIcon from '../svg/voice.svg'

function Health() {
  const navigate = useNavigate()
  const healthCheckOptions: HealthCheckOption[] = [
    {
      id: 'photo',
      icon: cameraIcon,
      label: '사진',
      onClick: () => navigate('/health/camera?mode=photo'),
    },
    {
      id: 'audio',
      icon: voiceIcon,
      label: '녹음',
      onClick: () => navigate('/health/camera?mode=audio'),
    },
    {
      id: 'video',
      icon: camcorderIcon,
      label: '영상',
      onClick: () => navigate('/health/camera?mode=video'),
    },
    {
      id: 'memo',
      icon: memoIcon,
      label: '메모 작성',
      onClick: () => navigate('/health/camera?mode=memo'),
    },
  ]

  return (
    <>
      <PageHeader title="AI 건강 체크" leftContent={<BackButton to="/home" />} />
      <main className="page health_page">
        <section className="health_intro">
          <div className="health_intro_content">
            <div className="health_guide">
              <img src={aboutIcon} alt="이용 가이드" />
              <span>이용 가이드</span>
            </div>
            <div className="health_intro_text">
              <Title as="h3" title="상태를 확인해 볼까요?">
                <p>
                  편한 방식으로 기록해 주세요.
                  <br />
                  AI가 펫의 상태를 한눈에 정리해 드려요.
                </p>
              </Title>
              <img className="health_intro_image" src={mypetimg} alt="반려동물 프로필" />
            </div>
          </div>
          <Button type="button" className="white_btn">
            펫 변경하기
          </Button>
        </section>
        <HealthCheck options={healthCheckOptions} />
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
