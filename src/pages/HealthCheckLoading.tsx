import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import './health.css'
import './HealthCheckLoading.css'
import PageHeader from '../components/PageHeader'
import ProgressCircle from '../components/ProgressCircle'
import Title from '../components/Title'
import CloseButton from '../components/html/CloseButton'
import NoticeText from '../components/NoticeText'

function HealthCheckLoading() {
  const navigate = useNavigate()
  const [progress, setProgress] = useState(0)

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
      <PageHeader title="AI 건강 체크" rightContent={<CloseButton />} />
      <main className="page health_page health_check_loading_page">
        <div className="health_check_loading">
          <Title as="h1" title="AI 가 정보를 확인 중이에요">
            <p>잠시만 기다려주세요.</p>
          </Title>
          <ProgressCircle value={Math.round(progress)}>로고</ProgressCircle>
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
