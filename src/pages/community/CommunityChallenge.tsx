import './Community.css'
import './CommunityChallenge.css'
import { useNavigate } from 'react-router'
import PageHeader from '../../components/PageHeader'
import HeaderIcon from '../../components/HeaderIcon'
import Button from '../../components/html/Button'
import Title from '../../components/Title'
import ContentSection from '../../components/ContentSection'
import challenge1Image from '../../img/challenge1.jpg'
import challenge2Image from '../../img/challenge2.png'
import challenge3Image from '../../img/challenge3.png'
import challenge4Image from '../../img/challenge4.png'
import challenge5Image from '../../img/challenge5.png'
import challenge6Image from '../../img/challenge6.png'
import cheerGroupImg from '../../img/challenge/challenge_cheer_group.png'
import footprintsIcon from '../../svg/footprints.svg'
import pointIcon from '../../svg/point.svg'

export const challengeCardItems = [
  { id: 1, title: '제일 귀엽게 밥을 먹는 귀염둥이는?', participants: 22, deadline: '05.10 마감', image: challenge1Image, status: 'active' },
  { id: 2, title: '가장 말썽꾸러기 같은 아이는?', participants: 17, deadline: '05.10 마감', image: challenge2Image, status: 'active' },
  { id: 3, title: '제일 웃는 얼굴이 예쁜 아이는?', participants: 31, deadline: '05.10 마감', image: challenge3Image, status: 'active' },
  { id: 4, title: '제일 호기심 많아 보이는 아이는?', participants: 14, deadline: '05.10 마감', image: challenge4Image, status: 'active' },
  { id: 5, title: '제일 반갑게 맞아주는 아이는?', participants: 26, deadline: '05.10 마감', image: challenge5Image, status: 'active' },
  { id: 6, title: '하루 종일 뛰어놀 것 같은 아이는?', participants: 19, deadline: '05.10 마감', image: challenge6Image, status: 'complete' },
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

function CommunityChallenge() {
  const navigate = useNavigate()

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
      </main>
    </>
  )
}

export default CommunityChallenge
