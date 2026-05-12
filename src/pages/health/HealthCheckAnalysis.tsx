import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import './HealthCheckAnalysis.css'
import PageHeader from '../../components/PageHeader'
import HeaderIcon from '../../components/HeaderIcon'
import BackButton from '../../components/html/BackButton'
import Button from '../../components/html/Button'
import dogSittingImage from '../../img/dog_sitting.png'
import foodBowlImage from '../../img/food_bowl.png'
import dogBarkingImage from '../../img/dog_barking.png'
import reportMemoImage from '../../img/report_memo.png'

const steps = ['건강 기록', '식사 변화', '활동량', 'AI 리포트'] as const

const cards = [
  { image: dogSittingImage, label: '건강 기록' },
  { image: foodBowlImage, label: '식사 변화' },
  { image: dogBarkingImage, label: '활동량' },
  { image: reportMemoImage, label: 'AI 리포트' },
] as const

const cardTexts = [
  { waiting: '확인 대기중...', loading: '확인중...', done: '확인 완료' },
  { waiting: '분석 대기중...', loading: '분석중...', done: '분석 완료' },
  { waiting: '분석 대기중...', loading: '분석중...', done: '분석 완료' },
  { waiting: '작성 대기중...', loading: '작성중...', done: '작성 완료' },
] as const

const CIRCUMFERENCE = 2 * Math.PI * 28

function HealthCheckAnalysis() {
  const navigate = useNavigate()
  const [completedCount, setCompletedCount] = useState(0)
  const [displayProgress, setDisplayProgress] = useState(0)
  const displayProgressRef = useRef(0)
  const progress = (completedCount / 4) * 100
  const isDone = completedCount === 4

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []
    steps.forEach((_, index) => {
      const timer = setTimeout(() => {
        setCompletedCount(index + 1)
      }, (index + 1) * 2500)
      timers.push(timer)
    })
    return () => timers.forEach(clearTimeout)
  }, [])

  useEffect(() => {
    const target = (completedCount / 4) * 100
    const start = displayProgressRef.current
    const duration = 1200
    const startTime = Date.now()
    let rafId: number

    const tick = () => {
      const elapsed = Date.now() - startTime
      const t = Math.min(elapsed / duration, 1)
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
      const current = Math.round(start + (target - start) * eased)
      displayProgressRef.current = current
      setDisplayProgress(current)
      if (t < 1) rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [completedCount])

  const getCardStatus = (cardIndex: number): 'waiting' | 'loading' | 'done' => {
    if (completedCount > cardIndex) return 'done'
    if (completedCount === cardIndex) return 'loading'
    return 'waiting'
  }

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
            <Button type="button" aria-label="notification">
              <HeaderIcon type="notification" />
            </Button>
          </>
        }
      />
      <main className="page health_check_analysis_page">
        <div className="health_check_analysis_top">
          <div className="health_check_analysis_text">
            <p className="health_check_analysis_title">AI 가 정보를 확인 중이에요</p>
            <p className="health_check_analysis_subtitle">잠시만 기다려 주세요...</p>
          </div>
          <div className="health_check_analysis_progress">
            <svg width="70" height="70" viewBox="0 0 70 70" aria-hidden="true">
              <circle cx="35" cy="35" r="28" fill="none" stroke="rgba(3,105,161,0.2)" strokeWidth="5" />
              <circle
                cx="35" cy="35" r="28"
                fill="none"
                stroke="#6D59F8"
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={CIRCUMFERENCE * (1 - progress / 100)}
                transform="rotate(-90 35 35)"
                style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.45,0,0.55,1)' }}
              />
            </svg>
            <span className="health_check_analysis_progress_text">{displayProgress}%</span>
          </div>
        </div>

        <div className="health_check_analysis_grid">
          {([[0, 1], [2, 3]] as const).map((row, rowIndex) => (
            <div key={rowIndex} className="health_check_analysis_row">
              {row.map((index) => {
                const card = cards[index]
                const status = getCardStatus(index)
                const sublabel = cardTexts[index][status]
                return (
                  <div key={card.label} className="health_check_analysis_card">
                    <img
                      src={card.image}
                      width={80}
                      height={80}
                      style={{ objectFit: 'cover' }}
                      alt=""
                      aria-hidden="true"
                    />
                    <p
                      key={status}
                      className={`health_check_analysis_card_label${status === 'done' ? ' is_lg' : ''}`}
                    >
                      {card.label}
                      <br />
                      {sublabel}
                    </p>
                    <div
                      className="health_check_analysis_card_overlay"
                      style={{ opacity: status === 'done' ? 1 : 0 }}
                      aria-hidden="true"
                    />
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        <p className="health_check_analysis_notice">
          ※ 이 결과는 참고용이며,
          <br />
          정확한 진단은 수의사 상담을 통해 확인해주세요.
        </p>

        <button
          type="button"
          className="health_check_analysis_btn"
          disabled={!isDone}
          onClick={isDone ? () => navigate('/health/report') : undefined}
        >
          AI 리포트 보러가기
        </button>
      </main>
    </>
  )
}

export default HealthCheckAnalysis
