import './home.css'
import { useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import PageHeader from '../components/PageHeader'
import Button from '../components/html/Button'
import calendarIcon from '../svg/calendar.svg'
import notificationIcon from '../svg/notification.svg'
import contents1 from '../img/contents1.png'
import contents2 from '../img/contents2.png'
import contents3 from '../img/contents3.png'
import contents4 from '../img/contents4.png'

const rankingData = {
  subscribers: [
    { id: 1, name: '코코', image: contents1, crown: '🥇', rank: '1위' },
    { id: 2, name: '보리', image: contents2, crown: '🥈', rank: '2위' },
    { id: 3, name: '모찌', image: contents4, crown: '🥉', rank: '3위' },
  ],
  points: [
    { id: 1, name: '모찌', image: contents4, crown: '🥇', rank: '1위' },
    { id: 2, name: '코코', image: contents1, crown: '🥈', rank: '2위' },
    { id: 3, name: '보리', image: contents2, crown: '🥉', rank: '3위' },
  ],
} as const

const contentItems = [
  { id: 1, title: '반려견이 좋아하는 산책 루트 추천 가이드', image: contents3 },
  { id: 2, title: '우리 아이 상태별 맞춤 건강 체크 포인트', image: contents1 },
  { id: 3, title: '산책 후 꼭 확인해야 할 케어 루틴', image: contents2 },
  { id: 4, title: '반려생활을 위한 필수 체크리스트 3종', image: contents4 },
]

const summarySlides = [
  {
    id: 1,
    name: '뽕뽕이',
    breed: '푸들',
    image: contents4,
    details: '나이: 2살 · 몸무게: 5kg · 성별: 남아',
    stats: [
      { label: '식사', value: '3회' },
      { label: '배변', value: '1회' },
      { label: '산책', value: '100분' },
    ],
  },
  {
    id: 2,
    name: '코코',
    breed: '말티푸',
    image: contents1,
    details: '나이: 4살 · 몸무게: 3.8kg · 성별: 여아',
    stats: [
      { label: '식사', value: '2회' },
      { label: '배변', value: '2회' },
      { label: '산책', value: '40분' },
    ],
  },
] as const

function formatTodaySummaryDate() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')

  return `${year}년 ${month}월 ${day}일`
}

function SummaryEditIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M11.8 2.2a1.6 1.6 0 0 1 2.3 2.3l-7 7-3 .7.7-3 7-7Z" />
      <path d="M10.6 3.4 12.6 5.4" />
    </svg>
  )
}

function Home() {
  const navigate = useNavigate()
  const [rankingType, setRankingType] = useState<'subscribers' | 'points'>('subscribers')
  const [summarySlideIndex, setSummarySlideIndex] = useState(0)
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const dragStateRef = useRef({ startX: 0 })

  const rankingItems = rankingData[rankingType]
  const todaySummaryDate = formatTodaySummaryDate()

  const handleDragStart = (clientX: number) => {
    dragStateRef.current.startX = clientX
    setIsDragging(true)
    setDragOffset(0)
  }

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return
    setDragOffset(clientX - dragStateRef.current.startX)
  }

  const handleDragEnd = () => {
    if (!isDragging) return

    const threshold = 56

    if (dragOffset <= -threshold && summarySlideIndex < summarySlides.length - 1) {
      setSummarySlideIndex((current) => current + 1)
    } else if (dragOffset >= threshold && summarySlideIndex > 0) {
      setSummarySlideIndex((current) => current - 1)
    }

    setIsDragging(false)
    setDragOffset(0)
  }

  return (
    <>
      <PageHeader
        title="집사인생"
        rightContent={
          <>
            <Button type="button" aria-label="calendar" onClick={() => navigate('/mission')}>
              <img src={calendarIcon} alt="" />
            </Button>
            <Button type="button" aria-label="notification" className="home_header_notification">
              <img src={notificationIcon} alt="" />
            </Button>
          </>
        }
      />

      <main className="page home_page">
        <section className="home_section">
          <div className="home_section_heading">
            <h2>오늘의 요약</h2>
            <p>{todaySummaryDate}</p>
          </div>

          <div
            className="summary_slider"
            aria-label="오늘의 요약 슬라이드"
            onPointerDown={(event) => {
              handleDragStart(event.clientX)
              event.currentTarget.setPointerCapture(event.pointerId)
            }}
            onPointerMove={(event) => handleDragMove(event.clientX)}
            onPointerUp={(event) => {
              if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                event.currentTarget.releasePointerCapture(event.pointerId)
              }
              handleDragEnd()
            }}
            onPointerCancel={(event) => {
              if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                event.currentTarget.releasePointerCapture(event.pointerId)
              }
              handleDragEnd()
            }}
          >
            <div
              className={`summary_slider_track ${isDragging ? 'dragging' : ''}`}
              style={{
                transform: `translateX(calc(-${summarySlideIndex * 100}% + ${dragOffset}px))`,
              }}
            >
              {summarySlides.map((slide) => (
                <article key={slide.id} className="summary_card">
                  <div className="summary_profile">
                    <img
                      src={slide.image}
                      alt={`${slide.name} 프로필`}
                      className="summary_profile_image"
                    />
                    <div className="summary_profile_body">
                      <div className="summary_profile_header">
                        <div>
                          <div className="summary_profile_top">
                            <strong>{slide.name}</strong>
                            <span className="summary_badge">{slide.breed}</span>
                          </div>
                          <p>{slide.details}</p>
                        </div>
                        <button
                          type="button"
                          className="summary_icon_button"
                          aria-label="프로필 편집"
                        >
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M14 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            <path d="M4.5 18.5c1.2-2.4 3.7-3.7 6.5-3.7 1.3 0 2.5.3 3.6.8" />
                            <path d="m14.8 18.2 4.8-4.8 1.9 1.9-4.8 4.8-2.5.6Z" />
                          </svg>
                        </button>
                      </div>
                      <button type="button" className="summary_link">
                        케어 가이드
                      </button>
                    </div>
                  </div>

                  <div className="summary_stats" aria-label={`${slide.name} 활동 요약`}>
                    {slide.stats.map((stat) => (
                      <div key={stat.label}>
                        <span className="summary_stat_label">
                          {stat.label}
                          <SummaryEditIcon />
                        </span>
                        <strong>{stat.value}</strong>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>

            <div className="summary_slider_dots" aria-label="요약 슬라이드 페이지">
              {summarySlides.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  className={index === summarySlideIndex ? 'active' : ''}
                  aria-label={`${index + 1}번 요약 보기`}
                  aria-pressed={index === summarySlideIndex}
                  onClick={() => setSummarySlideIndex(index)}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="home_section">
          <div className="home_section_heading home_section_heading_stack">
            <div>
              <h2>이달의 펫 랭킹</h2>
              <p>참여할수록 순위가 올라가요</p>
            </div>
            <button
              type="button"
              className={`ranking_switch ${rankingType === 'points' ? 'points' : ''}`}
              aria-label="랭킹 기준 전환"
              onClick={() =>
                setRankingType((current) => (current === 'subscribers' ? 'points' : 'subscribers'))
              }
            >
              <span className="ranking_switch_track" aria-hidden="true">
                <span className="ranking_switch_thumb" />
              </span>
              <span
                className={`ranking_switch_label ${rankingType === 'subscribers' ? 'active' : ''}`}
              >
                구독자
              </span>
              <span className={`ranking_switch_label ${rankingType === 'points' ? 'active' : ''}`}>
                포인트
              </span>
            </button>
          </div>

          <div className="ranking_grid" key={rankingType}>
            {rankingItems.map((item) => (
              <article key={item.id} className="ranking_card">
                <img src={item.image} alt={`${item.name} 프로필`} />
                <p>
                  <span>{item.crown}</span> {item.rank}: {item.name}
                </p>
              </article>
            ))}
          </div>

          <button type="button" className="more_button">
            더보기
          </button>
        </section>

        <section className="home_section home_content_section">
          <div className="home_section_heading">
            <h2>추천 콘텐츠</h2>
          </div>

          <div className="content_grid">
            {contentItems.map((item) => (
              <article key={item.id} className="content_card">
                <img src={item.image} alt={item.title} />
                <div className="content_overlay">
                  <p>{item.title}</p>
                </div>
              </article>
            ))}
          </div>

          <button
            type="button"
            className="more_button"
            onClick={() => navigate('/community?tab=knowledge')}
          >
            더보기
          </button>
        </section>

        <button type="button" className="floating_ai_button" aria-label="AI assistant">
          <span>AI</span>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 3a7 7 0 0 0-7 7v3.1A2.5 2.5 0 0 0 6.5 18H8l2.2 2.2a1 1 0 0 0 1.7-.7V18h1a7 7 0 0 0 7-7 8 8 0 0 0-8-8Zm-2.8 8.2a1.1 1.1 0 1 1 0-2.2 1.1 1.1 0 0 1 0 2.2Zm5.6 0a1.1 1.1 0 1 1 0-2.2 1.1 1.1 0 0 1 0 2.2ZM12 16c-1.9 0-3.5-1-4.3-2.4h8.6C15.5 15 13.9 16 12 16Z" />
          </svg>
        </button>
      </main>
    </>
  )
}

export default Home
