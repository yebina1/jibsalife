import './Community.css'
import './CommunityVote.css'
import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import PageHeader from '../../components/PageHeader'
import HeaderIcon from '../../components/HeaderIcon'
import Title from '../../components/Title'
import Button from '../../components/html/Button'
import crownIcon from '../../svg/crown.svg'
import timerIcon from '../../svg/timer.svg'
import timerClosedIcon from '../../svg/timer_closed.svg'
import { readVotedMissionIds } from '../../utils/communityVoteStatus'
import { missionVotes, regularVoteItems } from './CommunityVoteData'

const topTabs = ['전체', '펫스토리', '챌린지', '투표'] as const
const topTabRoutes: Record<string, string> = {
  전체: '/community/overview',
  펫스토리: '/community/petstory',
  챌린지: '/community/challenge',
  투표: '/community/vote',
}

type VoteSort = 'latest' | 'popular' | 'deadline'

function parseDeadline(deadline: string) {
  const match = deadline.match(/(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일/)
  if (!match) return Number.POSITIVE_INFINITY

  const [, year, month, day] = match
  return new Date(Number(year), Number(month) - 1, Number(day)).getTime()
}

function CommunityVote() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const sort = (searchParams.get('sort') ?? 'latest') as VoteSort
  const sub = searchParams.get('sub') ?? 'all'
  const showMission = sub === 'all' || sub === 'mission'
  const showRegular = sub === 'all' || sub === 'regular'
  const showResult = sub === 'all' || sub === 'result'
  const [votedIds] = useState(() => readVotedMissionIds())
  const sortedRegularVoteItems = useMemo(() => {
    return [...regularVoteItems].sort((a, b) => {
      if (sort === 'popular') {
        return b.participants - a.participants || b.id - a.id
      }

      if (sort === 'deadline') {
        return parseDeadline(a.deadline) - parseDeadline(b.deadline) || b.id - a.id
      }

      return b.id - a.id
    })
  }, [sort])

  const activeMissionVotes = missionVotes.filter(v => v.buttonType !== 'result')
  const resultMissionVotes = missionVotes.filter(v => v.buttonType === 'result')
  const activeRegularItems = sortedRegularVoteItems.filter(item => !('resultOnly' in item && item.resultOnly))
  const resultRegularItems = sortedRegularVoteItems.filter(item => 'resultOnly' in item && item.resultOnly)

  const openMissionVote = (voteId: string) => {
    navigate(`/community/vote/detail?voteId=${voteId}`)
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
            <Button type="button" aria-label="notification">
              <HeaderIcon type="notification" />
            </Button>
          </>
        }
      />

      <main className="page cv2_page">
        {/* 탭 바 */}
        <section className="community_tab_bar" aria-label="커뮤니티 상위 카테고리">
          {topTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              className={tab === '투표' ? 'active' : ''}
              onClick={() => navigate(topTabRoutes[tab])}
            >
              {tab}
            </button>
          ))}
        </section>

        {showMission && <section className="cv2_section">
          <Title
            as="h4"
            className="cv2_section_title"
            beforeTitle={<img src={crownIcon} alt="" className="cv2_crown" aria-hidden="true" />}
            title={missionVotes[0].sectionTitle}
          />
          <div className="cv2_mission_cards">
          {activeMissionVotes.map((vote) => (
            <div key={vote.id} className="cv2_mission_card">
              <Title
                as="h5"
                className="cv2_mission_card_body"
                beforeTitle={
                  <span className={`cv2_timer ${vote.buttonType === 'notify' ? 'cv2_timer_closed' : 'cv2_timer_active'}`}>
                    <img src={vote.buttonType === 'notify' ? timerClosedIcon : timerIcon} alt="" aria-hidden="true" />
                    {vote.timeText}
                  </span>
                }
                title={vote.title}
              >
                <p>
                  {vote.organizer} <span className="cv2_divider">|</span>{' '}
                  {vote.subText ?? `참여자 수 ${vote.participants}명`}
                </p>
              </Title>
              {vote.buttonType === 'notify' ? (
                <button type="button" className="cv2_outline_btn">
                  알림받기
                </button>
              ) : (
                <button
                  type="button"
                  className={votedIds.includes(vote.id) ? 'cv2_outline_btn' : 'cv2_vote_btn'}
                  onClick={() => openMissionVote(vote.id)}
                >
                  {votedIds.includes(vote.id) ? '수정하기' : '투표하기'}
                </button>
              )}
            </div>
          ))}
          </div>
        </section>}

        {showResult && <section className="cv2_section cv2_past_section">
          <Title as="h4" className="cv2_section_title" title="투표 결과" />
          <div className="cv2_past_cards">
          <div className="cv2_mission_card">
            <Title
              as="h5"
              className="cv2_mission_card_body"
              beforeTitle={
                <span className="cv2_timer cv2_timer_closed">
                  <img src={timerIcon} alt="" aria-hidden="true" />
                  투표 종료
                </span>
              }
              title="밥 먹는 사진 중 BEST를 골라주세요!"
            >
              <p>운영자 <span className="cv2_divider">|</span> 참여자 수 22명</p>
            </Title>
            <button type="button" className="cv2_result_btn" onClick={() => navigate('/community/vote/result')}>
              결과보기
            </button>
          </div>
          {resultMissionVotes.map((vote) => (
            <div key={vote.id} className="cv2_mission_card">
              <Title
                as="h5"
                className="cv2_mission_card_body"
                beforeTitle={
                  <span className="cv2_timer cv2_timer_closed">
                    <img src={timerIcon} alt="" aria-hidden="true" />
                    {vote.timeText}
                  </span>
                }
                title={vote.title}
              >
                <p>
                  {vote.organizer} <span className="cv2_divider">|</span>{' '}
                  {vote.subText ?? `참여자 수 ${vote.participants}명`}
                </p>
              </Title>
              <button type="button" className="cv2_result_btn">결과보기</button>
            </div>
          ))}
          <div className="cv2_regular_list">
            {resultRegularItems.map((item) => (
              <div key={item.id} className="cv2_regular_item">
                <Title as="h5" className="cv2_regular_body" title={item.title}>
                  <p>{item.description}</p>
                  <p className="cv2_regular_meta">
                    {item.deadline} <span className="cv2_divider">|</span> 참여자 수 {item.participants}명
                  </p>
                </Title>
                <button type="button" className="cv2_result_btn" disabled>
                  결과보기
                </button>
              </div>
            ))}
          </div>
          </div>
        </section>}

        {showRegular && <section className="cv2_section">
          <Title as="h4" className="cv2_section_title" title="일반 투표" />
          <div className="cv2_regular_list">
            {activeRegularItems.map((item) => (
              <div key={item.id} className="cv2_regular_item">
                <Title as="h5" className="cv2_regular_body" title={item.title}>
                  <p>{item.description}</p>
                  <p className="cv2_regular_meta">
                    {item.deadline} <span className="cv2_divider">|</span> 참여자 수 {item.participants}명
                  </p>
                </Title>
                <button
                  type="button"
                  className={
                    item.done
                      ? 'cv2_done_btn'
                      : 'modified' in item && item.modified
                        ? 'cv2_outline_btn'
                        : 'cv2_vote_btn'
                  }
                  disabled
                >
                  {item.done
                    ? '투표완료'
                    : 'modified' in item && item.modified
                      ? '수정하기'
                      : '투표하기'}
                </button>
              </div>
            ))}
          </div>
        </section>}
      </main>
    </>
  )
}

export default CommunityVote
