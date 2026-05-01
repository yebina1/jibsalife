import './home.css'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import Header from '../components/Header'
import Button from '../components/html/Button'
import calendarIcon from '../svg/calendar.svg'
import notificationIcon from '../svg/notification.svg'
import contents1 from '../img/contents1.png'
import contents2 from '../img/contents2.png'
import contents3 from '../img/contents3.png'
import contents4 from '../img/contents4.png'

const rankingData = {
  subscribers: [
    { id: 1, name: '콩이', image: contents1, crown: '👑', rank: '1위' },
    { id: 2, name: '꿍냥이', image: contents2, crown: '🐈', rank: '2위' },
    { id: 3, name: '모카', image: contents4, crown: '🐕', rank: '3위' },
  ],
  points: [
    { id: 1, name: '모카', image: contents4, crown: '🏆', rank: '1위' },
    { id: 2, name: '콩이', image: contents1, crown: '⭐', rank: '2위' },
    { id: 3, name: '꿍냥이', image: contents2, crown: '🎖', rank: '3위' },
  ],
} as const

const contentItems = [
  { id: 1, title: '활동량이 줄어든 아이를 위한 추천 장난감', image: contents3 },
  { id: 2, title: '우리 아이 상태별 추천 혜택', image: contents1 },
  { id: 3, title: '우리 아이 상태별 추천 혜택', image: contents2 },
  { id: 4, title: '반려견을 위한 케어 아이템 3종', image: contents4 },
]

function Home() {
  const navigate = useNavigate()
  const [rankingType, setRankingType] = useState<'subscribers' | 'points'>('subscribers')
  const rankingItems = rankingData[rankingType]

  return (
    <>
      <Header
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
            <p>2026년 05월 12일</p>
          </div>

          <article className="summary_card">
            <div className="summary_profile">
              <img src={contents4} alt="뿅뿅이 프로필" className="summary_profile_image" />
              <div className="summary_profile_body">
                <div className="summary_profile_top">
                  <strong>뿅뿅이</strong>
                  <span className="summary_badge">푸들</span>
                </div>
                <p>나이: 2살 · 몸무게: 5kg · 성별: 남아</p>
                <button type="button" className="summary_link">
                  케어 가이드
                </button>
              </div>
            </div>

            <div className="summary_stats" aria-label="오늘의 활동 요약">
              <div>
                <span>식사 기록</span>
                <strong>1회</strong>
              </div>
              <div>
                <span>배변 활동</span>
                <strong>1회</strong>
              </div>
              <div>
                <span>활동량</span>
                <strong>100분</strong>
              </div>
              <div>
                <span>증상</span>
                <strong>없음</strong>
              </div>
            </div>
          </article>
        </section>

        <section className="home_section">
          <div className="home_section_heading home_section_heading_stack">
            <div>
              <h2>이달의 스타 랭킹</h2>
              <p>당첨되면 포인트를 드려요!</p>
            </div>
            <button
              type="button"
              className={`ranking_switch ${rankingType === 'points' ? 'points' : 'subscribers'}`}
              aria-label={`랭킹 기준: ${rankingType === 'subscribers' ? '구독자' : '포인트'}`}
              aria-pressed={rankingType === 'points'}
              onClick={() =>
                setRankingType((prev) => (prev === 'subscribers' ? 'points' : 'subscribers'))
              }
            >
              <span className="ranking_switch_track" aria-hidden="true">
                <span className="ranking_switch_thumb" />
              </span>
              <span className={`ranking_switch_label ${rankingType === 'subscribers' ? 'active' : ''}`}>
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
            <h2>추천 컨텐츠</h2>
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

          <button type="button" className="more_button">
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
