import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import { useNavigate } from 'react-router'
import './health.css'
import './HealthCheckLoading.css'
import PageHeader from '../components/PageHeader'
import ProgressCircle from '../components/ProgressCircle'
import BackButton from '../components/html/BackButton'
import Button from '../components/html/Button'
import calendarIcon from '../svg/calendar.svg'
import notificationIcon from '../svg/notification.svg'

const loadingSteps = [
  { label: '건강 기록 확인 중...', active: true },
  { label: '식사 변화 분석 중...', active: true },
  { label: '활동량 확인 중...', active: false },
  { label: '이상 신호 탐지 중...', active: false },
  { label: 'AI 리포트 준비 중...', active: false },
] as const

function HealthCheckLoading() {
  const navigate = useNavigate()
  const [progress, setProgress] = useState(0)
  const checkIcon = `${import.meta.env.BASE_URL}check.svg`
  const checkIconStyle = {
    '--health-check-loading-icon': `url("${checkIcon}")`,
  } as CSSProperties

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
              <img src={calendarIcon} alt="" />
            </Button>
            <Button type="button" aria-label="notification" className="health_check_loading_notification">
              <img src={notificationIcon} alt="" />
            </Button>
          </>
        }
      />
      <main className="page health_page health_check_loading_page">
        <div className="health_check_loading">
          <section className="health_check_loading_intro">
            <h1>AI 가 정보를 확인 중이에요</h1>
            <p>잠시만 기다려 주세요.</p>
          </section>

          <ProgressCircle value={Math.round(progress)}>
            <span
              className="health_check_loading_logo"
              style={checkIconStyle}
              aria-hidden="true"
            />
          </ProgressCircle>

          <ul className="health_check_loading_steps" aria-label="AI 건강 체크 진행 단계">
            {loadingSteps.map((step) => (
              <li key={step.label} className={step.active ? 'active' : undefined}>
                {step.label}
              </li>
            ))}
          </ul>

          <div className="health_check_loading_notice">
            <p>
              ※ 이 결과는 참고용이며,
              <br />
              정확한 진단은 수의사 상담을 통해 확인해주세요.
            </p>
          </div>
        </div>
      </main>
    </>
  )
}

export default HealthCheckLoading
