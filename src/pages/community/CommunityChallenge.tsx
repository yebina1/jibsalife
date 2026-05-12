import './Community.css'
import './CommunityChallenge.css'
import { useEffect, useRef } from 'react'
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
import footprintsIcon from '../../svg/footprints.svg'
import pointIcon from '../../svg/point.svg'

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
const COMPLETED_DAYS = 3

const challengeDays = [
  { day: 1, image: day1Img, description: <>내 반려동물의<br />체중 측정하고 기록해요</>, status: 'completed' as const },
  { day: 2, image: day2Img, description: <>내 반려동물의<br />체중 측정하고 기록해요</>, status: 'completed' as const },
  { day: 3, image: day3Img, description: <>내 반려동물의<br />체중 측정하고 기록해요</>, status: 'current' as const },
  { day: 4, image: day4Img, description: <>내 반려동물의<br />하루 음수량을 체크해요</>, status: 'locked' as const },
  { day: 5, image: day5Img, description: <>내 반려동물의<br />발톱을 정리해요</>, status: 'locked' as const },
  { day: 6, image: day6Img, description: <>털을<br />부드럽게 빗어줘요</>, status: 'locked' as const },
  { day: 7, image: day7Img, description: <>내 반려동물에게<br />사랑한다고 해줘요</>, status: 'locked' as const },
]

function CommunityChallenge() {
  const navigate = useNavigate()
  const scrollRef = useRef<HTMLDivElement>(null)
  const currentCardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scroll = scrollRef.current
    const card = currentCardRef.current
    if (!scroll || !card) return
    const scrollLeft = card.offsetLeft - scroll.clientWidth / 2 + card.clientWidth / 2
    scroll.scrollLeft = scrollLeft
  }, [])

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
            <Button type="button" aria-label="notification">
              <HeaderIcon type="notification" />
            </Button>
          </>
        }
      />

      <main className="page cc_page">
        <section className="cc_progress_section">
          <strong className="cc_title">7일 챌린지 완주까지 D-4</strong>
          <img src={cheerGroupImg} alt="" className="cc_cheer_img" />
          <div className="cc_stamp_row">
            {Array.from({ length: TOTAL_DAYS }).map((_, i) => (
              <span key={i} className={`cc_stamp_item${i < COMPLETED_DAYS ? ' cc_stamp_active' : ' cc_stamp_inactive'}`}>
                <img src={footprintsIcon} alt="" className="cc_stamp_icon" />
              </span>
            ))}
          </div>
          <div className="cc_reward_card">
            <Title as="h5" title="3일 연속 성공 중!">
              <p className="cc_reward_desc">오늘 완료하면 보상 <span className="cc_reward_point">+300P</span></p>
            </Title>
            <img src={pointIcon} alt="" className="cc_point_icon" />
          </div>
        </section>
        <WeeklyChallengeCard />
        <section className="cc_day_list_section">
          <Title as="h4" title="챌린지 목록">
            <p>Tip! 매일 자정에 새로운 챌린지가 열려요!</p>
          </Title>
          <div className="cc_day_scroll" ref={scrollRef}>
            {challengeDays.map((item) => (
              <ChallengeDayCard
                key={item.day}
                ref={item.status === 'current' ? currentCardRef : undefined}
                day={item.day}
                image={'image' in item ? item.image : undefined}
                description={item.description}
                status={item.status}
              />
            ))}
          </div>
        </section>
      </main>
    </>
  )
}

export default CommunityChallenge
