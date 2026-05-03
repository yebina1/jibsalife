import './community.css'
import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router'
import PageHeader from '../components/PageHeader'
import BackButton from '../components/html/BackButton'
import contents1 from '../img/contents1.png'
import contents2 from '../img/contents2.png'
import contents3 from '../img/contents3.png'
import contents4 from '../img/contents4.png'
import calendarIcon from '../svg/calendar.svg'
import notificationIcon from '../svg/notification.svg'

const primaryTabs = ['전체', '커뮤니티', '챌린지', '투표'] as const
const communityTabs = ['전체', '자랑하기', '일상', '반려상식'] as const
const voteTabs = ['전체', '목록', '투표 결과'] as const
const sortOptions = ['인기순', '최신순'] as const

type CommunityPost = {
  id: number
  tag: string
  title: string
  author: string
  date: string
  timeText?: string
  likes: number
  comments: number
  createdAt: string
  image: string
}

const postData: CommunityPost[] = [
  {
    id: 1,
    tag: '일상',
    title: '강아지가 산책 나가자고 보채면 어떻게 하세요?',
    author: '뽀짝뽀짝',
    date: '2026.04.30',
    timeText: '3시간 전',
    likes: 8,
    comments: 3,
    createdAt: '2026-04-30T09:00:00',
    image: contents4,
  },
  {
    id: 2,
    tag: '일상',
    title: '퇴근 후 산책 루틴 공유해요',
    author: '그날의집사',
    date: '2026.04.30',
    likes: 6,
    comments: 1,
    createdAt: '2026-04-30T18:20:00',
    image: contents2,
  },
  {
    id: 3,
    tag: 'Q&A',
    title: '강아지 발사탕 줄이는 방법 추천해주세요',
    author: '조용한바다',
    date: '2026.04.30',
    likes: 6,
    comments: 1,
    createdAt: '2026-04-30T14:10:00',
    image: contents1,
  },
  {
    id: 4,
    tag: '일상',
    title: '오늘 우리 아이 첫 산책 성공했어요',
    author: '여름멍멍',
    date: '2026.04.30',
    likes: 12,
    comments: 4,
    createdAt: '2026-04-30T11:00:00',
    image: contents3,
  },
]

const braggingPostData: CommunityPost[] = [
  {
    id: 101,
    tag: '자랑하기',
    title: '우리 집 막내 미모 좀 봐주세요',
    author: '모찌엄마',
    date: '2026.04.30',
    timeText: '1시간 전',
    likes: 18,
    comments: 7,
    createdAt: '2026-04-30T20:10:00',
    image: contents1,
  },
  {
    id: 102,
    tag: '자랑하기',
    title: '오늘 미용하고 산책 다녀왔어요',
    author: '코코산책',
    date: '2026.04.30',
    likes: 14,
    comments: 4,
    createdAt: '2026-04-30T17:00:00',
    image: contents2,
  },
  {
    id: 103,
    tag: '자랑하기',
    title: '간식 앞에서 눈빛이 반짝이는 순간',
    author: '뽀삐누나',
    date: '2026.04.30',
    likes: 20,
    comments: 9,
    createdAt: '2026-04-30T15:20:00',
    image: contents3,
  },
]

const knowledgeContentItems = [
  { id: 1, title: '초보 집사를 위한 추천 산책 가이드', image: contents3 },
  { id: 2, title: '우리 아이 상태별 맞춤 생활 팁', image: contents1 },
  { id: 3, title: '산책 후 꼭 확인해야 할 체크 포인트', image: contents2 },
  { id: 4, title: '반려견을 위한 케어 체크리스트 3종', image: contents4 },
] as const

type VotePost = {
  id: number
  title: string
  subtitle?: string
  author: string
  likes: number
  comments: number
  deadline: string
}

const voteData: VotePost[] = [
  {
    id: 1,
    title: '오늘의 미션 투표',
    subtitle: '밥 먹는 사진 중 BEST를 골라주세요',
    author: '운영팀',
    likes: 8,
    comments: 3,
    deadline: '마감시간 23:59',
  },
  {
    id: 2,
    title: '산책룩 투표',
    subtitle: '오늘 가장 귀여운 산책룩을 골라주세요',
    author: '운영팀',
    likes: 12,
    comments: 5,
    deadline: '마감시간 21:00',
  },
] as const

type VoteResultItem = {
  id: number
  badge: string
  title: string
  results: {
    id: number
    rank: string
    name: string
    votes: string
    image: string
  }[]
}

const voteResultData: VoteResultItem[] = [
  {
    id: 1,
    badge: '챌린지 인증',
    title: '밥 먹는 사진 중 BEST를 골라주세요',
    results: [
      { id: 1, rank: '2위', name: '초코송이', votes: '53표', image: contents2 },
      { id: 2, rank: '1위', name: '별빛모찌', votes: '88표', image: contents4 },
      { id: 3, rank: '3위', name: '코코산책', votes: '32표', image: contents1 },
    ],
  },
  {
    id: 2,
    badge: '산책 인증',
    title: '산책 인증 사진 중 BEST를 골라주세요',
    results: [
      { id: 1, rank: '1위', name: '여름멍멍', votes: '71표', image: contents3 },
      { id: 2, rank: '2위', name: '하루집사', votes: '59표', image: contents4 },
      { id: 3, rank: '3위', name: '초코송이', votes: '28표', image: contents2 },
    ],
  },
] as const

type ChallengeItem = {
  id: number
  title: string
  description: string
  date: string
  participants: number
}

const challengeData: ChallengeItem[] = [
  {
    id: 1,
    title: '오늘의 미션',
    description: '밥 먹는 사진 중 BEST를 골라주세요',
    date: '2026.04.30',
    participants: 60,
  },
  {
    id: 2,
    title: '산책 인증 챌린지',
    description: '우리 아이의 즐거운 산책 시간을 자랑해보세요',
    date: '2026.04.30',
    participants: 48,
  },
] as const

function Community() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialKnowledgeView = searchParams.get('tab') === 'knowledge'
  const [selectedPrimaryTab, setSelectedPrimaryTab] = useState<(typeof primaryTabs)[number]>(
    '커뮤니티'
  )
  const [selectedSecondaryTab, setSelectedSecondaryTab] = useState<
    (typeof communityTabs)[number] | (typeof voteTabs)[number]
  >(initialKnowledgeView ? '반려상식' : '자랑하기')
  const [selectedSort, setSelectedSort] = useState<(typeof sortOptions)[number]>('인기순')
  const [isSortOpen, setIsSortOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [likedPostIds, setLikedPostIds] = useState<number[]>([])

  const isVoteView = selectedPrimaryTab === '투표'
  const isChallengeView = selectedPrimaryTab === '챌린지'
  const isBraggingView =
    selectedPrimaryTab === '커뮤니티' && selectedSecondaryTab === '자랑하기'
  const isKnowledgeView =
    selectedPrimaryTab === '커뮤니티' && selectedSecondaryTab === '반려상식'
  const isCommunityOverview =
    selectedPrimaryTab === '커뮤니티' && selectedSecondaryTab === '전체'
  const activePostData = isBraggingView ? braggingPostData : postData
  const currentSecondaryTabs = isVoteView ? voteTabs : communityTabs

  const posts = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase()
    const filtered = activePostData.filter((post) =>
      [post.title, post.author, post.tag].some((value) =>
        !keyword || value.toLowerCase().includes(keyword)
      )
    )

    return [...filtered].sort((a, b) => {
      const aLikes = a.likes + (likedPostIds.includes(a.id) ? 1 : 0)
      const bLikes = b.likes + (likedPostIds.includes(b.id) ? 1 : 0)

      if (selectedSort === '인기순') {
        if (bLikes !== aLikes) return bLikes - aLikes
        return b.comments - a.comments
      }

      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  }, [activePostData, likedPostIds, searchTerm, selectedSort])

  const toggleLike = (postId: number) => {
    setLikedPostIds((prev) =>
      prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
    )
  }

  return (
    <>
      <PageHeader
<<<<<<< HEAD
        title="집사인생"
        rightContent={
          <>
            <Button type="button" aria-label="calendar" onClick={() => navigate('/mission')}>
              <img src={calendarIcon} alt="" />
            </Button>
            <Button type="button" aria-label="notification" className="community_header_notification">
              <img src={notificationIcon} alt="" />
            </Button>
=======
        title={
          selectedChallenge ? '챌린지' :
          selectedVoteResult ? '투표 결과' :
          isVoteCandidateOpen ? '투표 참여' :
          '커뮤니티'
        }
        leftContent={
          showCommunityBackButton ? (
            <button
              type="button"
              className="back_btn"
              onClick={() => {
                if (selectedChallenge) {
                  setSelectedChallengeId(null)
                  return
                }
                if (selectedVoteResult) {
                  setSelectedVoteResultId(null)
                  return
                }
                setIsVoteCandidateOpen(false)
              }}
            >
              <i className="bx bx-chevron-left"></i>
            </button>
          ) : (
            <BackButton to="/home" />
          )
        }
      />
      <main className="page community_page">
        {/*
            반려인들과 함께하는
            <br />
            커뮤니티 이야기
>>>>>>> 5150d2f3044d8ca6247b153219a63f50e35c0d74
          </>
        }
      />

<<<<<<< HEAD
      <main className="page community_page">
        {!isVoteView && !isChallengeView ? (
          <section className="community_search_box">
            <label className="community_search_field">
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="검색어를 입력해주세요"
                aria-label="커뮤니티 검색"
              />
              <span className="community_search_icon" aria-hidden="true">
                ⌕
              </span>
            </label>
          </section>
        ) : null}

        {!isChallengeView ? (
          <section className="community_subtab_bar" aria-label="커뮤니티 하위 탭">
            {currentSecondaryTabs.map((tab) => (
              <button
                key={tab}
                type="button"
                className={selectedSecondaryTab === tab ? 'active' : ''}
                onClick={() => setSelectedSecondaryTab(tab)}
              >
                {tab}
              </button>
            ))}
          </section>
        ) : null}

        <section className="community_tab_bar" aria-label="커뮤니티 상위 탭">
          {primaryTabs.map((tab) => (
=======

      <section className="community_tab_bar" aria-label="커뮤니티 상위 탭">
        {primaryTabs.map((tab) => (
          <button
            key={tab}
            type="button"
            className={selectedPrimaryTab === tab ? 'active' : ''}
            onClick={() => {
              setSelectedPrimaryTab(tab)
              setSelectedChallengeId(null)
              setIsVoteCandidateOpen(false)
              setSelectedVoteResultId(null)
              setSelectedSecondaryTab(tab === '투표' ? '전체' : tab === '커뮤니티' ? '일상' : '전체')
            }}
          >
            {tab}
          </button>
        ))}
      </section>

      {!isChallengeView ? (
        <section className="community_subtab_bar" aria-label="커뮤니티 하위 탭">
          {currentSecondaryTabs.map((tab) => (
>>>>>>> 5150d2f3044d8ca6247b153219a63f50e35c0d74
            <button
              key={tab}
              type="button"
              className={selectedPrimaryTab === tab ? 'active' : ''}
              onClick={() => {
                setSelectedPrimaryTab(tab)
                setSelectedSecondaryTab(
                  tab === '투표' ? '전체' : tab === '커뮤니티' ? '자랑하기' : '전체'
                )
              }}
            >
              {tab}
            </button>
          ))}
        </section>

        {!isVoteView ? (
          <section className="community_sort_bar" aria-label="정렬">
            <div className={`community_sort_dropdown ${isSortOpen ? 'open' : ''}`}>
              <button
                type="button"
                className="community_sort_toggle active"
                onClick={() => setIsSortOpen((prev) => !prev)}
              >
                {selectedSort}
              </button>
              {isSortOpen ? (
                <div className="community_sort_menu">
                  {sortOptions
                    .filter((option) => option !== selectedSort)
                    .map((option) => (
                      <button
                        key={option}
                        type="button"
                        className="community_sort_option"
                        onClick={() => {
                          setSelectedSort(option)
                          setIsSortOpen(false)
                        }}
                      >
                        {option}
                      </button>
                    ))}
                </div>
              ) : null}
            </div>
          </section>
        ) : null}

        {isChallengeView ? (
          <section className="community_challenge_view">
            <article className="community_challenge_featured">
              <h2>이번주 핫한 챌린지</h2>
              <div className="community_challenge_progress">
                <div className="community_challenge_progress_fill" />
                <span>30% 달성</span>
              </div>
              <strong>60</strong>
              <button type="button">챌린지 참여하기</button>
            </article>

            <section className="community_challenge_section">
              <h2>챌린지</h2>
              <div className="community_challenge_list">
                {challengeData.map((item) => (
                  <article key={item.id} className="community_challenge_item">
                    <div className="community_challenge_copy">
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                      <span>{item.date}</span>
                      <strong>참여자 수 {item.participants}</strong>
                    </div>
                    <button type="button" className="community_challenge_join">
                      참여하기
                    </button>
                  </article>
                ))}
              </div>
            </section>
          </section>
        ) : isVoteView ? (
          <section className="community_overview">
            <article className="community_overview_section">
              <div className="community_overview_heading">
                <h2>목록</h2>
                <span>참여 가능한 투표</span>
              </div>
              <div className="community_vote_feed">
                {voteData.map((vote) => (
                  <article key={vote.id} className="community_vote_card">
                    <div className="community_vote_header">
                      <h2>{vote.title}</h2>
                      {vote.subtitle ? <p>{vote.subtitle}</p> : null}
                    </div>
                    <div className="community_post_meta community_vote_meta">
                      <span className="community_profile_avatar" aria-hidden="true">
                        프로필
                      </span>
                      <span className="community_post_author">{vote.author}</span>
                    </div>
                    <div className="community_post_actions community_vote_actions">
                      <button type="button">좋아요 {vote.likes}</button>
                      <button type="button">댓글 {vote.comments}</button>
                    </div>
                    <p className="community_vote_deadline">{vote.deadline}</p>
                    <button type="button" className="community_vote_button">
                      투표하러 가기
                    </button>
                  </article>
                ))}
              </div>
            </article>

            <article className="community_overview_section">
              <div className="community_overview_heading">
                <h2>투표 결과</h2>
                <span>최근 마감된 결과</span>
              </div>
              <div className="community_vote_result_feed">
                {voteResultData.map((item) => (
                  <article key={item.id} className="community_vote_result_card">
                    <div className="community_vote_result_image" aria-hidden="true">
                      투표가
                      <br />
                      종료됐어요
                    </div>
                    <div className="community_vote_result_body">
                      <span className="community_vote_candidate_badge">{item.badge}</span>
                      <h2>{item.title}</h2>
                      <button type="button" className="community_vote_candidate_button">
                        결과보기
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </article>
          </section>
        ) : isKnowledgeView ? (
          <section className="community_knowledge_feed">
            <div className="community_knowledge_grid">
              {knowledgeContentItems.map((item) => (
                <article key={item.id} className="community_knowledge_card">
                  <img src={item.image} alt={item.title} />
                  <div className="community_knowledge_overlay">
                    <p>{item.title}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : isCommunityOverview ? (
          <section className="community_overview">
            <article className="community_overview_section">
              <div className="community_overview_heading">
                <h2>자랑하기</h2>
                <span>우리 아이 자랑 모음</span>
              </div>
              <div className="community_overview_post_list">
                {braggingPostData.slice(0, 2).map((post) => (
                  <article key={post.id} className="community_post">
                    <img className="community_post_image" src={post.image} alt={post.title} />
                    <div className="community_post_body">
                      <div className="community_post_header">
                        <span className="community_post_tag">{post.tag}</span>
                        <h2>{post.title}</h2>
                      </div>
                      <div className="community_post_meta">
                        <span className="community_profile_avatar" aria-hidden="true">
                          프로필
                        </span>
                        <span className="community_post_author">{post.author}</span>
                      </div>
                      <p className="community_post_date">
                        {post.timeText ? <span>{post.timeText}</span> : null}
                        <span>{post.date}</span>
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </article>
          </section>
        ) : (
          <section className="community_feed">
            {posts.length > 0 ? (
              posts.map((post) => (
                <article key={post.id} className="community_post">
                  <img className="community_post_image" src={post.image} alt={post.title} />
                  <div className="community_post_body">
                    <div className="community_post_header">
                      <span className="community_post_tag">{post.tag}</span>
                      <h2>{post.title}</h2>
                    </div>

                    <div className="community_post_meta">
                      <span className="community_profile_avatar" aria-hidden="true">
                        프로필
                      </span>
                      <span className="community_post_author">{post.author}</span>
                    </div>

                    <p className="community_post_date">
                      {post.timeText ? <span>{post.timeText}</span> : null}
                      <span>{post.date}</span>
                    </p>

                    <div className="community_post_actions">
                      <button
                        type="button"
                        className={likedPostIds.includes(post.id) ? 'active' : ''}
                        onClick={() => toggleLike(post.id)}
                      >
                        <span className="community_like_icon" aria-hidden="true">
                          <svg viewBox="0 0 24 24">
                            <path d="M12 20.2 4.9 13.6a4.8 4.8 0 0 1 6.8-6.8L12 7.9l.3-.3a4.8 4.8 0 1 1 6.8 6.8Z" />
                          </svg>
                        </span>
                        좋아요 {post.likes + (likedPostIds.includes(post.id) ? 1 : 0)}
                      </button>
                      <button type="button">댓글 {post.comments}</button>
                      <button type="button">공유하기</button>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="community_empty_state">검색 결과가 없어요</div>
            )}
          </section>
        )}
      </main>
    </>
  )
}

export default Community
