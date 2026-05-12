import './Community.css'
import './CommunityOverview.css'
import { useNavigate } from 'react-router'
import PageHeader from '../../components/PageHeader'
import HeaderIcon from '../../components/HeaderIcon'
import Button from '../../components/html/Button'
import Title from '../../components/Title'
import VoteMissionBanner from '../../components/VoteMissionBanner'
import MissionVoteSection from '../../components/MissionVoteSection'
import PetStoryPreviewSection from '../../components/PetStoryPreviewSection'
import FloatingWriteButton from '../../components/FloatingWriteButton'
import bannerImg from '../../img/Community_Overview_banner_img.png'

function CommunityOverview() {
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
      <main className="page co_page">
        <VoteMissionBanner
          timeText="7시간 남음"
          title="챌린지 완료 보상"
          description="챌린지 참여하고 포인트 받자!"
          backgroundColor="#FFE27A"
          imageSrc={bannerImg}
        />
        <section className="co_challenge_card co_challenge_card_first">
          <Title
            as="h2"
            className="co_challenge_info"
            beforeTitle={
              <span className="co_day_label">Day 3</span>
            }
            title={
              <strong>이번주 집사 챌린지</strong>
            }
          >
            <p className="co_challenge_desc">내 반려동물의<br />발바닥 상태를 체크해줘요</p>
            <div className="co_challenge_meta">
              <p>
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <circle cx="10" cy="10" r="8.5" stroke="currentColor" strokeWidth="1.5"/>
                  <circle cx="10" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M4 16.5C4 13.74 6.69 11.5 10 11.5s6 2.24 6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <span>22명 참여</span>
              </p>
              <p>
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <rect x="2.5" y="4" width="15" height="13" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M2.5 8h15" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M13.5 2.5v3M6.5 2.5v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <span>오늘 24:00 마감</span>
              </p>
            </div>
          </Title>
          <Button type="button" className="purple_btn">참여하기</Button>
        </section>
        <section className="co_challenge_card">
          <div className="co_vote_header">
            <Title as="h4" title="투표">
              <p>멍스타 반려동물을 투표해주세요!</p>
            </Title>
            <button type="button" className="co_vote_more_btn" onClick={() => navigate('/community/vote')}>
              더보기 &gt;
            </button>
          </div>
          <MissionVoteSection />
        </section>
        <section className="co_challenge_card co_petstory_card">
          <div className="co_vote_header">
            <Title as="h4" title="펫스토리">
              <p>반려일상을 공유해요</p>
            </Title>
            <button type="button" className="co_vote_more_btn" onClick={() => navigate('/community/petstory')}>
              더보기 &gt;
            </button>
          </div>
          <PetStoryPreviewSection />
        </section>
      </main>
      <FloatingWriteButton onClick={() => navigate('/community/petstory/write')} />
    </>
  )
}

export default CommunityOverview
