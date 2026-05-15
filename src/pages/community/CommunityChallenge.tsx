import './Community.css'
import './CommunityChallenge.css'
import { useEffect, useRef, useState } from 'react'
import { checkChallengeDayDone, CHALLENGE_STATUS_CHANGED_EVENT, readCurrentDay, saveCurrentDay } from '../../utils/challengeStatus'
import { useNavigate } from 'react-router'
import PageHeader from '../../components/PageHeader'
import HeaderIcon from '../../components/HeaderIcon'
import Button from '../../components/html/Button'
import Title from '../../components/Title'
import ContentSection from '../../components/ContentSection'
import WeeklyChallengeCard from '../../components/WeeklyChallengeCard'
import ChallengeDayCard from '../../components/ChallengeDayCard'
import day1Img from '../../img/challenge/challenge_1.jpg'
import day2Img from '../../img/challenge/challenge_2.jpg'
import day3Img from '../../img/challenge/challenge_3.png'
import day4Img from '../../img/challenge/challenge_4.jpg'
import day5Img from '../../img/challenge/challenge_5.jpg'
import day6Img from '../../img/challenge/challenge_6.jpg'
import day7Img from '../../img/challenge/challenge_7.jpg'
import cheerGroupImg from '../../img/challenge/challenge_cheer_group.png'
import arrowIcon from '../../svg/arrow.svg'
import footprintsIcon from '../../svg/footprints.svg'
import lockIcon from '../../svg/lock.svg'
import pointIcon from '../../svg/point.svg'

// eslint-disable-next-line react-refresh/only-export-components
export const challengeCardItems = [
  { id: 1, title: '제일 귀엽게 밥을 먹는 귀염둥이는?', participants: 22, deadline: '05.10 마감', image: day1Img, status: 'active' },
  { id: 2, title: '가장 말썽꾸러기 같은 아이는?', participants: 17, deadline: '05.10 마감', image: day2Img, status: 'active' },
  { id: 3, title: '제일 웃는 얼굴이 예쁜 아이는?', participants: 31, deadline: '05.10 마감', image: day3Img, status: 'active' },
  { id: 4, title: '제일 호기심 많아 보이는 아이는?', participants: 14, deadline: '05.10 마감', image: day4Img, status: 'active' },
  { id: 5, title: '제일 반갑게 맞아주는 아이는?', participants: 26, deadline: '05.10 마감', image: day5Img, status: 'active' },
  { id: 6, title: '하루 종일 뛰어놀 것 같은 아이는?', participants: 19, deadline: '05.10 마감', image: day6Img, status: 'complete' },
] as const

type CommunityChallengePreviewProps = {
  onNavigate: () => void
}

export function CommunityChallengePreview({ onNavigate }: CommunityChallengePreviewProps) {
  return (
    <ContentSection
      className="community_overview_section"
      title="챌린지 인증"
      action={
        <button type="button" onClick={onNavigate}>
          바로가기
        </button>
      }
    >
      <div className="community_overview_challenge_grid">
        {challengeCardItems.slice(0, 2).map((item) => (
          <article key={item.id} className="community_challenge_card">
            <img src={item.image} alt={item.title} className="community_challenge_card_image" />
            <div className="community_challenge_card_body">
              <h3>{item.title}</h3>
              <div className="community_challenge_card_meta">
                <span>{item.participants}명</span>
                <span>{item.deadline}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </ContentSection>
  )
}

const TOTAL_DAYS = 7
const PARTICIPATED_DAYS_KEY = 'jibsalife.challenge.participatedDays'

function readParticipatedDays(): Set<number> {
  try {
    const stored = localStorage.getItem(PARTICIPATED_DAYS_KEY)
    if (!stored) return new Set()
    const parsed = JSON.parse(stored)
    if (Array.isArray(parsed)) return new Set(parsed.filter((n): n is number => typeof n === 'number'))
    return new Set()
  } catch { return new Set() }
}

function saveParticipatedDays(days: Set<number>) {
  localStorage.setItem(PARTICIPATED_DAYS_KEY, JSON.stringify([...days]))
}

// eslint-disable-next-line react-refresh/only-export-components
export const challengeDays = [
  { day: 1, image: day1Img, description: <>내 반려동물의<br />산책을 기록해주세요</> },
  { day: 2, image: day2Img, description: <>커뮤니티에 댓글을<br />3회 이상 남겨주세요</> },
  { day: 3, image: day3Img, description: <>1회 이상 <br/>투표에 참여해보세요</> },
  { day: 4, image: day4Img, description: <>내 반려동물의<br />건강 리포트를 확인해주세요</> },
  { day: 5, image: day5Img, description: <>반려상식에<br />좋아요를 남겨주세요</> },
  { day: 6, image: day6Img, description: <>내 반려동물의<br />식사량을 기록해주세요</> },
  { day: 7, image: day7Img, description: <>커뮤니티에 <br />게시글을 작성해주세요</> },
]

function CommunityChallenge() {
  const navigate = useNavigate()
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const [participatedDays, setParticipatedDays] = useState<Set<number>>(() => readParticipatedDays())
  // currentDay는 자정(handleDayEnd)에만 진행 — 완료 후 리마운트해도 같은 날 유지
  const [currentDay, setCurrentDay] = useState<number>(() => readCurrentDay())
  const visibleIndexRef = useRef(currentDay)
  const [visibleIndex, setVisibleIndex] = useState(currentDay)
  const [missionDone, setMissionDone] = useState(() => checkChallengeDayDone(currentDay))

  // 초기 마운트 시 currentDay 카드로 즉시 이동
  useEffect(() => {
    const card = cardRefs.current[currentDay]
    const container = scrollContainerRef.current
    if (!card || !container) return
    const targetLeft = card.offsetLeft - (container.clientWidth - card.offsetWidth) / 2
    container.scrollTo({ left: targetLeft, behavior: 'instant' })
    visibleIndexRef.current = currentDay
    setVisibleIndex(currentDay)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 스크롤 시 중앙에 가장 가까운 카드로 dot 업데이트
  useEffect(() => {
    const el = scrollContainerRef.current
    if (!el) return
    const onScroll = () => {
      const center = el.scrollLeft + el.clientWidth / 2
      let closestIdx = 0
      let minDist = Infinity
      cardRefs.current.forEach((card, i) => {
        if (!card) return
        const dist = Math.abs(card.offsetLeft + card.offsetWidth / 2 - center)
        if (dist < minDist) { minDist = dist; closestIdx = i }
      })
      if (closestIdx !== visibleIndexRef.current) {
        visibleIndexRef.current = closestIdx
        setVisibleIndex(closestIdx)
      }
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  // 마우스 드래그 스크롤 (터치는 CSS snap이 처리)
  useEffect(() => {
    const el = scrollContainerRef.current
    if (!el) return
    let startX = 0
    let startScrollLeft = 0
    let dragging = false

    const snapToNearest = () => {
      const center = el.scrollLeft + el.clientWidth / 2
      let closestIdx = 0
      let minDist = Infinity
      cardRefs.current.forEach((card, i) => {
        if (!card) return
        const dist = Math.abs(card.offsetLeft + card.offsetWidth / 2 - center)
        if (dist < minDist) { minDist = dist; closestIdx = i }
      })
      const target = cardRefs.current[closestIdx]
      if (!target) return
      // smooth scroll 완료 후 CSS snap 복원 (scrollend 미지원 브라우저는 500ms 후 fallback)
      const restore = () => {
        el.style.scrollSnapType = ''
        el.removeEventListener('scrollend', restore)
        clearTimeout(timer)
      }
      el.addEventListener('scrollend', restore, { once: true })
      const timer = window.setTimeout(restore, 500)
      el.scrollTo({ left: target.offsetLeft - (el.clientWidth - target.offsetWidth) / 2, behavior: 'smooth' })
    }

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return
      dragging = true
      startX = e.clientX
      startScrollLeft = el.scrollLeft
      el.style.scrollSnapType = 'none'
      el.style.cursor = 'grabbing'
    }
    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return
      el.scrollLeft = startScrollLeft + (startX - e.clientX)
    }
    const onPointerUp = () => {
      if (!dragging) return
      dragging = false
      el.style.cursor = ''
      snapToNearest()
    }

    el.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointercancel', onPointerUp)
    return () => {
      el.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)
    }
  }, [])

  // 포인트 계산용 streak (handleComplete에서 사용)
  let consecutive = 0
  for (let i = currentDay - 1; i >= 0; i--) {
    if (i < 2 || participatedDays.has(i)) consecutive++
    else break
  }

  // 활성화된 stamp 수 (index 0,1 항상 + participatedDays)
  const activeStampCount = 2 + [...participatedDays].filter(d => d >= 2).length

  // index 2 이후만 미완료 체크 (0,1은 항상 완료)
  const hasMissed =
    currentDay > 2 &&
    Array.from({ length: currentDay - 2 }, (_, i) => i + 2).some((i) => !participatedDays.has(i))

  const rewardTitle = hasMissed ? '집사 챌린지 다시 시작!' : `${activeStampCount}일 연속 성공 중!`

  const rewardDesc =
    activeStampCount === 2 ? (
      <>오늘 완료시 보상 <span className="cc_reward_point">+100P</span></>
    ) : activeStampCount === 6 ? (
      <>오늘 완료시 보상 <span className="cc_reward_point">+300P</span></>
    ) : activeStampCount >= 3 && activeStampCount <= 5 ? (
      <>7일 연속 완료시 보상 <span className="cc_reward_point">+300P</span></>
    ) : (
      <>3일 연속 보상에 도전해보세요!</>
    )

  const getStampClass = (i: number) => {
    if (i < 2) return 'cc_stamp_active'
    if (participatedDays.has(i)) return 'cc_stamp_active'
    if (i === currentDay) return 'cc_stamp_today'
    return ''
  }

  // currentDay 바뀔 때마다 해당 날 완료 여부 재계산
  useEffect(() => {
    setMissionDone(checkChallengeDayDone(currentDay))
  }, [currentDay])

  // 다른 페이지에서 미션 완료 시 storage 이벤트 또는 커스텀 이벤트로 감지
  useEffect(() => {
    const refresh = () => setMissionDone(checkChallengeDayDone(currentDay))
    window.addEventListener(CHALLENGE_STATUS_CHANGED_EVENT, refresh)
    window.addEventListener('storage', refresh)
    window.addEventListener('focus', refresh)
    return () => {
      window.removeEventListener(CHALLENGE_STATUS_CHANGED_EVENT, refresh)
      window.removeEventListener('storage', refresh)
      window.removeEventListener('focus', refresh)
    }
  }, [currentDay])

  const handleComplete = () => {
    const completingDay = consecutive + 1
    const points = completingDay === 7 ? 360 : completingDay === 3 ? 160 : 60
    const next = new Set([...participatedDays, currentDay])
    setParticipatedDays(next)
    saveParticipatedDays(next)
    navigate(`/community/challenge/reward?amount=${points}`)
  }

  const handleDayEnd = () => {
    setCurrentDay((prev) => {
      const next = Math.min(prev + 1, TOTAL_DAYS)
      saveCurrentDay(next)
      return next
    })
  }

  return (
    <>
      <PageHeader
        title="집사인생"
        rightContent={
          <>
            <Button type="button" aria-label="검색" className="community_header_search">
              <HeaderIcon type="search" />
            </Button>
            <Button type="button" aria-label="calendar" onClick={() => navigate('/mission')}>
              <HeaderIcon type="calendar" />
            </Button>
            <Button type="button" aria-label="notification" onClick={() => navigate('/notification')}>
              <HeaderIcon type="notification" />
            </Button>
          </>
        }
      />

      <main className="page cc_page">
        <section className="cc_progress_section">
          <strong className="cc_title">7일 챌린지 완주까지 D-{Math.max(1, 7 - [...participatedDays].filter(d => d >= 2).length)}</strong>
          <img src={cheerGroupImg} alt="" className="cc_cheer_img" />
          <div className="cc_stamp_row">
            {Array.from({ length: TOTAL_DAYS }).map((_, i) => (
              <div key={i} className="cc_stamp_wrapper">
                <span className={`cc_stamp_item ${getStampClass(i)}`}>
                  <img src={i > currentDay ? lockIcon : footprintsIcon} alt="" className="cc_stamp_icon" />
                </span>
                {i === currentDay && <img src={arrowIcon} alt="" className="cc_stamp_today_arrow" />}
              </div>
            ))}
          </div>
          <div className="cc_reward_card">
            <Title as="h5" title={rewardTitle}>
              <p className="cc_reward_desc">{rewardDesc}</p>
            </Title>
            <img src={pointIcon} alt="" className="cc_point_icon" />
          </div>
        </section>
        <WeeklyChallengeCard
          onComplete={handleComplete}
          onDayEnd={handleDayEnd}
          day={challengeDays[Math.min(currentDay, TOTAL_DAYS - 1)].day}
          imageSrc={challengeDays[Math.min(currentDay, TOTAL_DAYS - 1)].image}
          description={challengeDays[Math.min(currentDay, TOTAL_DAYS - 1)].description}
          missionDone={missionDone}
          completed={participatedDays.has(currentDay)}
        />
        <section className="cc_day_list_section">
          <Title as="h4" title="챌린지 목록">
            <p>Tip! 매일 자정에 새로운 챌린지가 열려요!</p>
          </Title>
          <div className="cc_day_scroll_wrapper">
          <div className="cc_day_scroll" ref={scrollContainerRef}>
            {challengeDays.map((item, i) => {
              const status =
                i < 2
                  ? 'completed'
                  : participatedDays.has(i)
                    ? 'completed'
                    : i < currentDay
                      ? 'missed'
                      : i === currentDay ? 'current' : 'locked'
              return (
                <ChallengeDayCard
                  key={item.day}
                  ref={(el) => {
                    cardRefs.current[i] = el
                  }}
                  day={item.day}
                  image={item.image}
                  description={item.description}
                  status={status}
                  isCurrent={i === currentDay}
                />
              )
            })}
          </div>
          <div className="cc_day_dots">
            {Array.from({ length: TOTAL_DAYS }).map((_, i) => (
              <span key={i} className={`cc_day_dot${i === visibleIndex ? ' cc_day_dot_active' : ''}`} />
            ))}
          </div>
          </div>
        </section>
      </main>
    </>
  )
}

export default CommunityChallenge
