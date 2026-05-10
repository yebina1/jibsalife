import './Community.css'
import './CommunityVote.css'
import { useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import PageHeader from '../../components/PageHeader'
import HeaderIcon from '../../components/HeaderIcon'
import Title from '../../components/Title'
import Button from '../../components/html/Button'
import crownIcon from '../../svg/crown.svg'
import timerIcon from '../../svg/timer.svg'
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
            <Button type="button" aria-label="notification" className="community_header_notification">
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

        {missionVotes.map((vote) => (
          <section key={vote.id} className="cv2_section">
            <Title
              as="h4"
              className="cv2_section_title"
              beforeTitle={<img src={crownIcon} alt="" className="cv2_crown" aria-hidden="true" />}
              title={vote.sectionTitle}
            />
            <div className="cv2_mission_card">
              <Title
                as="h5"
                className="cv2_mission_card_body"
                beforeTitle={
                  <span className="cv2_timer cv2_timer_active">
                    <img src={timerIcon} alt="" aria-hidden="true" />
                    {vote.timeText}
                  </span>
                }
                title={vote.title}
              >
                <p>
                  {vote.organizer} <span className="cv2_divider">|</span> 참여자 수 {vote.participants}명
                </p>
              </Title>
              <button type="button" className="cv2_vote_btn" onClick={() => openMissionVote(vote.id)}>
                투표하기
              </button>
            </div>
          </section>
        ))}

        {/* 지난 멍스타 확인하기 */}
        <section className="cv2_section">
          <Title as="h4" className="cv2_section_title" title="지난 멍스타 확인하기" />
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
            <button type="button" className="cv2_vote_btn" onClick={() => navigate('/community/vote/result')}>
              결과보기
            </button>
          </div>
        </section>

        {/* 일반 투표 */}
        <section className="cv2_section">
          <Title as="h4" className="cv2_section_title" title="일반 투표" />
          <div className="cv2_regular_list">
            {sortedRegularVoteItems.map((item) => (
              <div key={item.id} className="cv2_regular_item">
                <Title as="h5" className="cv2_regular_body" title={item.title}>
                  <p>{item.description}</p>
                  <p className="cv2_regular_meta">
                    {item.deadline} <span className="cv2_divider">|</span> 참여자 수 {item.participants}명
                  </p>
                </Title>
                <button
                  type="button"
                  className={item.done ? 'cv2_done_btn' : 'cv2_vote_btn'}
                  disabled={item.done}
                  onClick={() => {
                    if (!item.done && 'voteId' in item) openMissionVote(item.voteId)
                  }}
                >
                  {item.done ? '투표완료' : '투표하기'}
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  )
}

export default CommunityVote
