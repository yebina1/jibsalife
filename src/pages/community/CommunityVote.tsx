import './Community.css'
import './CommunityVote.css'
import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import PageHeader from '../../components/PageHeader'
import HeaderIcon from '../../components/HeaderIcon'
import Button from '../../components/html/Button'
import crownIcon from '../../svg/crown.svg'

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
    done: false,
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
  const [searchParams] = useSearchParams()
  const sort = (searchParams.get('sort') ?? 'latest') as VoteSort
  const [votedIds, setVotedIds] = useState<number[]>([2, 3, 4, 5])
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
          <h2 className="cv2_section_title">
            <img src={crownIcon} alt="" className="cv2_crown" aria-hidden="true" />
            멍스타 미션 투표
          </h2>
          <div className="cv2_mission_card">
            <div className="cv2_mission_card_body">
              <span className="cv2_timer cv2_timer_active">
                <i className="bx bx-time-five" aria-hidden="true" />
                7시간 남음
              </span>
              <p className="cv2_mission_title">밥 먹는 사진 중 BEST를 골라주세요!</p>
              <p className="cv2_mission_meta">운영자 <span className="cv2_divider">|</span> 참여자 수 22명</p>
            </div>
            <button type="button" className="cv2_vote_btn" onClick={() => navigate('/community/vote/detail')}>
              투표하기
            </button>
          </div>
        </section>

        {/* 지난 멍스타 확인하기 */}
        <section className="cv2_section">
          <h2 className="cv2_section_title">지난 멍스타 확인하기</h2>
          <div className="cv2_mission_card">
            <div className="cv2_mission_card_body">
              <span className="cv2_timer cv2_timer_closed">
                <i className="bx bx-time-five" aria-hidden="true" />
                투표 종료
              </span>
              <p className="cv2_mission_title">밥 먹는 사진 중 BEST를 골라주세요!</p>
              <p className="cv2_mission_meta">운영자 <span className="cv2_divider">|</span> 참여자 수 22명</p>
            </div>
            <button type="button" className="cv2_vote_btn" onClick={() => navigate('/community/vote/result')}>
              결과보기
            </button>
          </div>
        </section>

        {/* 일반 투표 */}
        <section className="cv2_section">
          <h2 className="cv2_section_title">일반 투표</h2>
          <div className="cv2_regular_list">
            {sortedRegularVoteItems.map((item) => {
              const isDone = votedIds.includes(item.id)
              return (
                <div key={item.id} className="cv2_regular_item">
                  <div className="cv2_regular_body">
                    <p className="cv2_regular_title">{item.title}</p>
                    <p className="cv2_regular_desc">{item.description}</p>
                    <p className="cv2_regular_meta">
                      {item.deadline} <span className="cv2_divider">|</span> 참여자 수 {item.participants}명
                    </p>
                  </div>
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
