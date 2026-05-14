import './Community.css'
import './CommunityOverview.css'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { checkChallengeDayDone, getCurrentChallengeDay, claimChallengeDay, calculateChallengeRewardPoints, CHALLENGE_STATUS_CHANGED_EVENT } from '../../utils/challengeStatus'
import PageHeader from '../../components/PageHeader'
import HeaderIcon from '../../components/HeaderIcon'
import Button from '../../components/html/Button'
import Title from '../../components/Title'
import WeeklyChallengeCard from '../../components/WeeklyChallengeCard'
import VoteMissionBanner from '../../components/VoteMissionBanner'
import MissionVoteSection from '../../components/MissionVoteSection'
import PetStoryPreviewSection from '../../components/PetStoryPreviewSection'
import FloatingWriteButton from '../../components/FloatingWriteButton'
import bannerImg from '../../img/Community_Overview_banner_img.png'

function CommunityOverview() {
  const navigate = useNavigate()
  const [missionDone, setMissionDone] = useState(() => checkChallengeDayDone(getCurrentChallengeDay()))

  useEffect(() => {
    const refresh = () => setMissionDone(checkChallengeDayDone(getCurrentChallengeDay()))
    window.addEventListener(CHALLENGE_STATUS_CHANGED_EVENT, refresh)
    window.addEventListener('storage', refresh)
    window.addEventListener('focus', refresh)
    return () => {
      window.removeEventListener(CHALLENGE_STATUS_CHANGED_EVENT, refresh)
      window.removeEventListener('storage', refresh)
      window.removeEventListener('focus', refresh)
    }
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
      <main className="page co_page">
        <VoteMissionBanner
          timeText="7시간 남음"
          title="챌린지 완료 보상"
          description="챌린지 참여하고 포인트 받자!"
          backgroundColor="#FFE27A"
          imageSrc={bannerImg}
        />
        <WeeklyChallengeCard
          showTimer={false}
          showImage={false}
          missionDone={missionDone}
          onComplete={() => {
            const points = calculateChallengeRewardPoints()
            claimChallengeDay(getCurrentChallengeDay())
            navigate(`/community/challenge/reward?amount=${points}`)
          }}
        />
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
