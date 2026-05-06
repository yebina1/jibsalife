import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import './Health.css'
import './HealthCheckLoading.css'
import PageHeader from '../../components/PageHeader'
import HeaderIcon from '../../components/HeaderIcon'
import ContentSection from '../../components/ContentSection'
import ProgressCircle from '../../components/ProgressCircle'
import BackButton from '../../components/html/BackButton'
import Button from '../../components/html/Button'
import NoticeText from '../../components/NoticeText'

const loadingSteps = [
  '건강 기록 확인 중...',
  '식사 변화 분석 중...',
  '활동량 확인 중...',
  '이상 신호 탐지 중...',
  'AI 리포트 준비 중...',
] as const

function HealthCheckLoading() {
  const navigate = useNavigate()
  const [progress, setProgress] = useState(0)
  const checkIcon = `${import.meta.env.BASE_URL}check.svg`
  const activeStepCount = Math.min(
    loadingSteps.length,
    Math.max(1, Math.ceil((progress / 100) * loadingSteps.length)),
  )

  useEffect(() => {
    const duration = 3000
    const intervalTime = 50
    const step = 100 / (duration / intervalTime)

    const intervalId = window.setInterval(() => {
      setProgress((prevProgress) => {
        const nextProgress = Math.min(100, prevProgress + step)

        if (nextProgress >= 100) {
          window.clearInterval(intervalId)
          window.setTimeout(() => {
            navigate('/health/result', { replace: true })
          }, 300)
        }

        return nextProgress
      })
    }, intervalTime)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [navigate])

  return (
    <>
      <PageHeader
        title="AI 건강 체크"
        leftContent={<BackButton />}
        rightContent={
          <>
            <Button type="button" aria-label="calendar" onClick={() => navigate('/mission')}>
              <HeaderIcon type="calendar" />
            </Button>
            <Button type="button" aria-label="notification" className="health_check_loading_notification">
              <HeaderIcon type="notification" />
            </Button>
          </>
        }
      />
      <main className="page health_page health_check_loading_page">
        <div className="health_check_loading">
          <ContentSection
            className="health_check_loading_intro"
            titleAs="h1"
            title="AI 가 정보를 확인 중이에요"
            subtitle="잠시만 기다려 주세요."
          />

          <ProgressCircle value={Math.round(progress)} showValue={false}>
            <img className="health_check_loading_logo" src={checkIcon} alt="" aria-hidden="true" />
          </ProgressCircle>

          <ul className="health_check_loading_steps" aria-label="AI 건강 체크 진행 단계">
            {loadingSteps.map((step, index) => (
              <li key={step} className={index < activeStepCount ? 'active' : undefined}>
                {step}
              </li>
            ))}
          </ul>

        <NoticeText>
          <p>
            ※ 이 결과는 참고용이며,
            <br />
            정확한 진단은 수의사 상담을 통해 확인해주세요.
          </p>
        </NoticeText>
        </div>
      </main>
    </>
  )
}

export default HealthCheckLoading
