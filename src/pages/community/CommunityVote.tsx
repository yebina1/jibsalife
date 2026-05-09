import './Community.css'
import './CommunityVote.css'
import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router'
import PageHeader from '../../components/PageHeader'
import HeaderIcon from '../../components/HeaderIcon'
import Title from '../../components/Title'
import Button from '../../components/html/Button'
import {
  communityVoteStatusChangedEvent,
  readVotedMissionIds,
} from '../../utils/communityVoteStatus'
import crownIcon from '../../svg/crown.svg'
import timerIcon from '../../svg/timer.svg'

const topTabs = ['전체', '펫스토리', '챌린지', '투표'] as const
const topTabRoutes: Record<string, string> = {
  전체: '/community/overview',
  펫스토리: '/community/petstory',
  챌린지: '/community/challenge',
  투표: '/community/vote',
}

const regularVoteItems = [
  {
    id: 1,
    title: '오늘의 베스트 포즈는?',
    description: '가장 포즈가 돋보이는 것을 골라주세요.',
    deadline: '2026년 4월 30일까지',
    participants: 10,
    done: true,
  },
  {
    id: 2,
    title: '간식 기다리기 챔피언은?',
    description: '간식을 기다리는 가장 귀여운 순간을 골라주세요',
    deadline: '2026년 4월 30일까지',
    participants: 22,
    done: true,
  },
  {
    id: 3,
    title: '집사 바라기 1등은?',
    description: '가장 마음이 녹는 것을 골라주세요',
    deadline: '2026년 4월 30일까지',
    participants: 8,
    done: true,
  },
  {
    id: 4,
    title: '표정 부자는 누구?',
    description: '가장 매력적인 순간을 골라주세요.',
    deadline: '2026년 4월 30일까지',
    participants: 4,
    done: true,
  },
  {
    id: 5,
    title: '표정 부자는 누구?',
    description: '가장 매력적인 순간을 골라주세요.',
    deadline: '2026년 4월 30일까지',
    participants: 4,
    done: true,
  },
] as const

type VoteSort = 'latest' | 'popular' | 'deadline'

function parseDeadline(deadline: string) {
  const match = deadline.match(/(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일/)
  if (!match) return Number.POSITIVE_INFINITY

  const [, year, month, day] = match
  return new Date(Number(year), Number(month) - 1, Number(day)).getTime()
}

function CommunityVote() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const sort = (searchParams.get('sort') ?? 'latest') as VoteSort
  const completedVoteId = searchParams.get('voted')
  const [votedIds, setVotedIds] = useState<number[]>([1, 2, 3, 4, 5])
  const [missionVotedIds, setMissionVotedIds] = useState<string[]>(readVotedMissionIds)
  const storedMissionVotedIds = readVotedMissionIds()
  const activeMissionVotedIds = Array.from(new Set([...missionVotedIds, ...storedMissionVotedIds]))
  const isMissionVoted = completedVoteId === 'mission' || activeMissionVotedIds.includes('mission')
  const isSubscriberMissionVoted = completedVoteId === 'subscriber' || activeMissionVotedIds.includes('subscriber')
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

  const handleVote = (id: number) => {
    setVotedIds((prev) => [...prev, id])
  }

  const openMissionVote = (voteId: string) => {
    navigate(`/community/vote/detail?voteId=${voteId}`)
  }

  useEffect(() => {
    setMissionVotedIds(readVotedMissionIds())
  }, [location.key, location.search])

  useEffect(() => {
    const syncMissionVotedIds = () => setMissionVotedIds(readVotedMissionIds())

    window.addEventListener('focus', syncMissionVotedIds)
    window.addEventListener('pageshow', syncMissionVotedIds)
    window.addEventListener('storage', syncMissionVotedIds)
    window.addEventListener(communityVoteStatusChangedEvent, syncMissionVotedIds)

    return () => {
      window.removeEventListener('focus', syncMissionVotedIds)
      window.removeEventListener('pageshow', syncMissionVotedIds)
      window.removeEventListener('storage', syncMissionVotedIds)
      window.removeEventListener(communityVoteStatusChangedEvent, syncMissionVotedIds)
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

        {/* 멍스타 미션 투표 */}
        <section className="cv2_section">
          <Title
            as="h4"
            className="cv2_section_title"
            beforeTitle={<img src={crownIcon} alt="" className="cv2_crown" aria-hidden="true" />}
            title="멍스타 미션 투표"
          />
          <div className="cv2_mission_card">
            <Title
              as="h5"
              className="cv2_mission_card_body"
              beforeTitle={
                <span className="cv2_timer cv2_timer_active">
                  <img src={timerIcon} alt="" aria-hidden="true" />
                  7시간 남음
                </span>
              }
              title="밥 먹는 사진 중 BEST를 골라주세요!"
            >
              <p>운영자 <span className="cv2_divider">|</span> 참여자 수 22명</p>
            </Title>
            <button
              type="button"
              className={isMissionVoted ? 'cv2_done_btn' : 'cv2_vote_btn'}
              disabled={isMissionVoted}
              onClick={() => openMissionVote('mission')}
            >
              {isMissionVoted ? '투표완료' : '투표하기'}
            </button>
          </div>
        </section>

        {/* 구독자 전용 참여하기 */}
        <section className="cv2_section">
          <Title
            as="h4"
            className="cv2_section_title"
            beforeTitle={<img src={crownIcon} alt="" className="cv2_crown" aria-hidden="true" />}
            title="구독자 전용 참여하기"
          />
          <div className="cv2_mission_card">
            <Title
              as="h5"
              className="cv2_mission_card_body"
              beforeTitle={
                <span className="cv2_timer cv2_timer_active">
                  <img src={timerIcon} alt="" aria-hidden="true" />
                  7시간 남음
                </span>
              }
              title="멍스타 도전하기"
            >
              <p>운영자 <span className="cv2_divider">|</span> 참여자 수 22명</p>
            </Title>
            <button
              type="button"
              className={isSubscriberMissionVoted ? 'cv2_done_btn' : 'cv2_vote_btn'}
              disabled={isSubscriberMissionVoted}
              onClick={() => openMissionVote('subscriber')}
            >
              {isSubscriberMissionVoted ? '투표완료' : '투표하기'}
            </button>
          </div>
        </section>

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
            {sortedRegularVoteItems.map((item) => {
              const isDone = item.done || votedIds.includes(item.id)
              return (
                <div key={item.id} className="cv2_regular_item">
                  <Title as="h5" className="cv2_regular_body" title={item.title}>
                    <p>{item.description}</p>
                    <p className="cv2_regular_meta">
                      {item.deadline} <span className="cv2_divider">|</span> 참여자 수 {item.participants}명
                    </p>
                  </Title>
                  <button
                    type="button"
                    className={isDone ? 'cv2_done_btn' : 'cv2_vote_btn'}
                    disabled={isDone}
                    onClick={() => !isDone && handleVote(item.id)}
                  >
                    {isDone ? '투표완료' : '투표하기'}
                  </button>
                </div>
              )
            })}
          </div>
        </section>
      </main>
    </>
  )
}

export default CommunityVote
