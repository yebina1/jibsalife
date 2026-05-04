import './community.css'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import PageHeader from '../components/PageHeader'
import Button from '../components/html/Button'
import Form from '../components/html/Form'
import contents1 from '../img/contents1.png'
import contents2 from '../img/contents2.png'
import contents3 from '../img/contents3.png'
import contents4 from '../img/contents4.png'
import calendarIcon from '../svg/calendar.svg'
import notificationIcon from '../svg/notification.svg'

const challengeItems = [
  {
    id: 1,
    title: '오늘의 미션',
    description: '반 먹는 사진 중 BEST를 골라주세요!',
    date: '2026.04.30',
    participants: 8,
  },
  {
    id: 2,
    title: '산책 인증 챌린지',
    description: '우리아이 즐겁게 산책하는 순간을 자랑해보세요',
    date: '2026.04.30',
    participants: 8,
  },
  {
    id: 3,
    title: '비포 애프터 콘텐츠',
    description: '우리아이 미용 전과 후 사진을 올려주세요',
    date: '2026.04.30',
    participants: 8,
  },
  {
    id: 4,
    title: '코오잠 챌린지',
    description: '우리아이 잠든 모습 자랑해보세요',
    date: '2026.04.30',
    participants: 8,
  },
] as const

const voteListItems = [
  {
    id: 1,
    title: '오늘의 미션 투표',
    description: '밥 먹는 사진 중 BEST를 골라주세요!',
    deadline: '마감시간 23:59',
  },
  {
    id: 2,
    title: '투표2.',
    description: '',
    deadline: '',
  },
  {
    id: 3,
    title: '투표3.',
    description: '',
    deadline: '',
  },
  {
    id: 4,
    title: '투표4.',
    description: '',
    deadline: '',
  },
  {
    id: 5,
    title: '투표5.',
    description: '',
    deadline: '',
  },
] as const

const voteCandidateItems = [
  { id: 1, badge: '챌린지 인증', title: '맛있는 밥시간!', author: '버찌부찌' },
  { id: 2, badge: '챌린지 인증', title: '남남 잘 먹는 우리 댕댕이', author: '초코송이' },
  { id: 3, badge: '챌린지 인증', title: '밥이 제일 좋아!', author: '코코애나' },
  { id: 4, badge: '챌린지 인증', title: '오늘도 클리어', author: '콩이맘' },
] as const

const voteResultItems = [
  { id: 1, badge: '챌린지 인증', title: '밥 먹는 사진 중 BEST를 골라주세요!' },
  { id: 2, badge: '산책 인증', title: '산책 인증 사진 중 BEST를 골라주세요!' },
  { id: 3, badge: '산책 인증', title: '산책 인증 사진 중 BEST를 골라주세요!' },
] as const

const voteResultRankings = [
  { id: 1, rank: '2위', name: '초코송이', votes: '53표' },
  { id: 2, rank: '1위', name: '버찌부찌', votes: '88표' },
  { id: 3, rank: '3위', name: '코코아빠', votes: '32표' },
] as const

const topTabs = ['전체', '커뮤니티', '챌린지 인증', '투표'] as const
const communitySubTabs = ['전체', '자랑하기', '일상', '반려상식'] as const
const voteSubTabs = ['전체', '목록', '투표결과'] as const
const sortOptions = ['인기순', '최신순', '댓글순', '공유순'] as const
const createdPostsStorageKey = 'jibsalife.community.createdPosts'

type TopTab = (typeof topTabs)[number]
type CommunitySubTab = (typeof communitySubTabs)[number]
type VoteSubTab = (typeof voteSubTabs)[number]

type CommunityPost = {
  id: number
  tag: string
  title: string
  author: string
  date: string
  timeText?: string
  likes: number
  comments: number
  shares: number
  createdAt: string
  image: string
}

function loadCreatedPosts(): CommunityPost[] {
  if (typeof window === 'undefined') return []

  try {
    const savedPosts = window.localStorage.getItem(createdPostsStorageKey)
    const parsedPosts = savedPosts ? JSON.parse(savedPosts) : []

    return Array.isArray(parsedPosts) ? (parsedPosts as CommunityPost[]) : []
  } catch {
    return []
  }
}

const postData: CommunityPost[] = [
  {
    id: 1,
    tag: '일상',
    title: '강아지 산책하러 나가면 자는척 해요',
    author: '뿌직뿌직',
    date: '2026.04.30',
    timeText: '3시간 전',
    likes: 4,
    comments: 4,
    shares: 4,
    createdAt: '2026-04-30T09:00:00',
    image: contents4,
  },
  {
    id: 2,
    tag: '일상',
    title: '냉전중',
    author: '뿌직뿌직',
    date: '2026.04.30',
    timeText: '3시간 전',
    likes: 4,
    comments: 4,
    shares: 2,
    createdAt: '2026-04-30T18:20:00',
    image: contents2,
  },
  {
    id: 3,
    tag: '일상',
    title: '강아지 발사탕 스프레이 추천해주세요!',
    author: '뿌직뿌직',
    date: '2026.04.30',
    timeText: '3시간 전',
    likes: 4,
    comments: 4,
    shares: 6,
    createdAt: '2026-04-30T14:10:00',
    image: contents1,
  },
  {
    id: 4,
    tag: '일상',
    title: '뽀미랑 부산 여행기',
    author: '뿌직뿌직',
    date: '2026.04.30',
    timeText: '3시간 전',
    likes: 4,
    comments: 4,
    shares: 1,
    createdAt: '2026-04-30T11:00:00',
    image: contents3,
  },
]

const braggingPostData: CommunityPost[] = [
  {
    id: 101,
    tag: '자랑하기',
    title: '우리 집 막내 미모 좀 봐주세요',
    author: '몽실엄마',
    date: '2026.04.30',
    timeText: '1시간 전',
    likes: 18,
    comments: 7,
    shares: 9,
    createdAt: '2026-04-30T20:10:00',
    image: contents1,
  },
  {
    id: 102,
    tag: '자랑하기',
    title: '오늘 미용하고 산책 나왔어요',
    author: '코코산책',
    date: '2026.04.30',
    timeText: '2시간 전',
    likes: 14,
    comments: 4,
    shares: 5,
    createdAt: '2026-04-30T17:00:00',
    image: contents2,
  },
  {
    id: 103,
    tag: '자랑하기',
    title: '간식 앞에서 반짝이는 눈빛',
    author: '복실누나',
    date: '2026.04.30',
    timeText: '5시간 전',
    likes: 20,
    comments: 9,
    shares: 7,
    createdAt: '2026-04-30T15:20:00',
    image: contents3,
  },
]

const knowledgeFeedItems = [
  { id: 1, tag: '산책', title: '댕꿀잠자는 산책법 TOP3', image: contents2, likes: 8, comments: 3 },
  { id: 2, tag: '케어', title: '섬세하게 케어해달라냥', image: contents3, likes: 8, comments: 3 },
  { id: 3, tag: '일상', title: '고양이 점프의 비밀', image: contents1, likes: 8, comments: 3 },
  { id: 4, tag: '일상', title: '수술 전 피, 검사 꼭 필요할까?', image: contents4, likes: 8, comments: 3 },
] as const

function Community() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialKnowledgeView = searchParams.get('tab') === 'knowledge'

  const [selectedTopTab, setSelectedTopTab] = useState<TopTab>('커뮤니티')
  const [selectedCommunitySubTab, setSelectedCommunitySubTab] = useState<CommunitySubTab>(
    initialKnowledgeView ? '반려상식' : '자랑하기'
  )
  const [selectedVoteSubTab, setSelectedVoteSubTab] = useState<VoteSubTab>('투표결과')
  const [selectedSort, setSelectedSort] = useState<(typeof sortOptions)[number]>('인기순')
  const [isSortOpen, setIsSortOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [likedPostIds, setLikedPostIds] = useState<number[]>([])
  const [selectedChallengeId, setSelectedChallengeId] = useState<number | null>(null)
  const [selectedVoteListId, setSelectedVoteListId] = useState<number | null>(null)
  const [selectedVoteResultId, setSelectedVoteResultId] = useState<number | null>(null)
  const [createdPosts, setCreatedPosts] = useState<CommunityPost[]>(loadCreatedPosts)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [draftTag, setDraftTag] = useState<CommunitySubTab>(communitySubTabs[1])
  const [draftTitle, setDraftTitle] = useState('')
  const [draftContent, setDraftContent] = useState('')
  const [draftImage, setDraftImage] = useState('')

  useEffect(() => {
    window.localStorage.setItem(createdPostsStorageKey, JSON.stringify(createdPosts))
  }, [createdPosts])

  const isOverviewTab = selectedTopTab === '전체'
  const isCommunityTab = selectedTopTab === '커뮤니티'
  const isChallengeTab = selectedTopTab === '챌린지 인증'
  const isVoteTab = selectedTopTab === '투표'

  const isBraggingView = isCommunityTab && selectedCommunitySubTab === '자랑하기'
  const isKnowledgeView = isCommunityTab && selectedCommunitySubTab === '반려상식'
  const isCommunityOverview = isCommunityTab && selectedCommunitySubTab === '전체'
  const visibleCreatedPosts =
    isCommunityTab && !isKnowledgeView
      ? createdPosts.filter(
          (post) => selectedCommunitySubTab === communitySubTabs[0] || post.tag === selectedCommunitySubTab
        )
      : []
  const activePostData = isBraggingView
    ? [...visibleCreatedPosts, ...braggingPostData]
    : [...visibleCreatedPosts, ...postData]
  const selectedChallenge = challengeItems.find((item) => item.id === selectedChallengeId) ?? null

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

      if (selectedSort === '댓글순') {
        if (b.comments !== a.comments) return b.comments - a.comments
        return bLikes - aLikes
      }

      if (selectedSort === '공유순') {
        if (b.shares !== a.shares) return b.shares - a.shares
        return bLikes - aLikes
      }

      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  }, [activePostData, likedPostIds, searchTerm, selectedSort])

  const toggleLike = (postId: number) => {
    setLikedPostIds((prev) =>
      prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
    )
  }

  const openCreatePost = () => {
    setDraftTag(isBraggingView ? communitySubTabs[1] : communitySubTabs[2])
    setDraftTitle('')
    setDraftContent('')
    setDraftImage('')
    setIsCreateOpen(true)
  }

  const closeCreatePost = () => {
    setIsCreateOpen(false)
  }

  const createPost = () => {
    const title = draftTitle.trim()
    const content = draftContent.trim()

    if (!title) return

    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')

    setCreatedPosts((prev) => [
      {
        id: Date.now(),
        tag: draftTag,
        title,
        author: '나',
        date: `${year}.${month}.${day}`,
        timeText: '방금 전',
        likes: 0,
        comments: content ? 1 : 0,
        shares: 0,
        createdAt: now.toISOString(),
        image: draftImage || contents4,
      },
      ...prev,
    ])
    setSelectedTopTab(topTabs[1])
    setSelectedCommunitySubTab(draftTag)
    setSelectedSort(sortOptions[1])
    closeCreatePost()
  }

  const sectionTitle = isOverviewTab
    ? '전체'
    : isKnowledgeView
      ? '반려상식'
      : isVoteTab
        ? '투표'
        : isChallengeTab
          ? '챌린지 인증'
          : '커뮤니티'

  const showSearch = isOverviewTab || isCommunityTab
  const showCommunitySubTabs = isCommunityTab
  const showVoteSubTabs = isVoteTab
  const showSort = !isOverviewTab && !isKnowledgeView && !isChallengeTab

  return (
    <>
      <PageHeader
        title="집사인생"
        rightContent={
          <>
            <Button type="button" aria-label="calendar" onClick={() => navigate('/mission')}>
              <img src={calendarIcon} alt="" />
            </Button>
            <Button
              type="button"
              aria-label="notification"
              className="community_header_notification"
            >
              <img src={notificationIcon} alt="" />
            </Button>
          </>
        }
      />

      <main className="page community_page">
        {showSearch ? (
          <section className="community_search_box">
            <Form
              className="chat_room_form community_search_form"
              value={searchTerm}
              placeholder="검색어를 입력해주세요"
              inputAriaLabel="커뮤니티 검색"
              submitLabel="검색"
              onChange={setSearchTerm}
              onSubmit={() => undefined}
              icon={
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="10.5" cy="10.5" r="6.5" />
                  <path d="m15.5 15.5 4.5 4.5" />
                </svg>
              }
            />
          </section>
        ) : null}

        <section className="community_tab_bar" aria-label="커뮤니티 상위 카테고리">
          {topTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              className={selectedTopTab === tab ? 'active' : ''}
              onClick={() => {
                setSelectedTopTab(tab)
                setIsSortOpen(false)
                setSelectedCommunitySubTab('전체')
                setSelectedVoteSubTab('전체')
                setSelectedChallengeId(null)
                setSelectedVoteListId(null)
                setSelectedVoteResultId(null)
              }}
            >
              {tab}
            </button>
          ))}
        </section>

        {showCommunitySubTabs ? (
          <section className="community_subtab_bar" aria-label="커뮤니티 하위 카테고리">
            {communitySubTabs.map((tab) => (
              <button
                key={tab}
                type="button"
                className={selectedCommunitySubTab === tab ? 'active' : ''}
                onClick={() => setSelectedCommunitySubTab(tab)}
              >
                {tab}
              </button>
            ))}
          </section>
        ) : null}

        {showVoteSubTabs ? (
          <section className="community_subtab_bar" aria-label="투표 하위 카테고리">
            {voteSubTabs.map((tab) => (
              <button
                key={tab}
                type="button"
                className={selectedVoteSubTab === tab ? 'active' : ''}
                onClick={() => setSelectedVoteSubTab(tab)}
              >
                {tab}
              </button>
            ))}
          </section>
        ) : null}

        {!isKnowledgeView && !isOverviewTab && !isChallengeTab ? (
          <section
            className={`community_list_header ${isChallengeTab ? 'community_list_header_challenge' : ''}`}
          >
            <h2>{sectionTitle}</h2>
            {showSort ? (
              <div className={`community_sort_dropdown ${isSortOpen ? 'open' : ''}`}>
                <button
                  type="button"
                  className="community_sort_toggle"
                  onClick={() => setIsSortOpen((prev) => !prev)}
                >
                  {selectedSort}
                </button>
                {isSortOpen ? (
                  <div className="community_sort_menu">
                    {sortOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        className={
                          option === selectedSort
                            ? 'community_sort_option active'
                            : 'community_sort_option'
                        }
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
            ) : null}
          </section>
        ) : null}

        {isOverviewTab ? (
          <section className="community_overview">
            <section className="community_overview_section">
              <div className="community_overview_heading">
                <h2>커뮤니티</h2>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedTopTab('커뮤니티')
                    setSelectedCommunitySubTab('전체')
                  }}
                >
                  바로가기
                </button>
              </div>
              <div className="community_overview_post_list">
                {[braggingPostData[0], postData[0]].map((post) => (
                  <article key={post.id} className="community_post">
                    <img className="community_post_image" src={post.image} alt={post.title} />
                    <div className="community_post_body">
                      <div className="community_post_header">
                        <span className="community_post_tag">{post.tag}</span>
                        <h2>{post.title}</h2>
                      </div>
                      <div className="community_post_meta">
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
            </section>

            <section className="community_overview_section">
              <div className="community_overview_heading">
                <h2>챌린지 인증</h2>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedTopTab('챌린지 인증')
                    setSelectedChallengeId(null)
                  }}
                >
                  바로가기
                </button>
              </div>
              <div className="community_challenge_simple_list">
                {challengeItems.slice(0, 2).map((item) => (
                  <article key={item.id} className="community_challenge_simple_item">
                    <div className="community_challenge_simple_copy">
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                      <span>{item.date}</span>
                      <strong>참여자수 {item.participants}</strong>
                    </div>
                    <button type="button" className="community_challenge_simple_join">
                      참여하기
                    </button>
                  </article>
                ))}
              </div>
            </section>

            <section className="community_overview_section">
              <div className="community_overview_heading">
                <h2>투표</h2>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedTopTab('투표')
                    setSelectedVoteSubTab('전체')
                    setSelectedVoteListId(null)
                    setSelectedVoteResultId(null)
                  }}
                >
                  바로가기
                </button>
              </div>
              <div className="community_vote_result_screen community_overview_vote_preview">
                {voteResultItems.slice(0, 2).map((item) => (
                  <article key={item.id} className="community_vote_result_entry">
                    <div className="community_vote_result_placeholder">
                      투표가
                      <br />
                      종료되었습니다.
                    </div>
                    <div className="community_vote_result_panel">
                      <span className="community_vote_result_label">{item.badge}</span>
                      <h3>{item.title}</h3>
                      <button type="button" className="community_vote_result_action">
                        결과보기
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </section>
        ) : isChallengeTab ? (
          <section className="community_challenge_screen">
            <article className="community_challenge_summary_card">
              <h3>이번주 특별 상금 챌린지</h3>
              <div className="community_challenge_summary_progress">
                <div className="community_challenge_summary_fill" />
                <span>30% 달성</span>
              </div>
              <strong>60</strong>
              <button type="button">특별 포인트 받기</button>
            </article>

            <div className="community_challenge_section_title">
              <h2>챌린지</h2>
            </div>

            {selectedChallenge ? (
              <article className="community_challenge_join_detail">
                <button
                  type="button"
                  className="community_detail_back_button"
                  onClick={() => setSelectedChallengeId(null)}
                >
                  이전
                </button>
                <div className="community_challenge_join_copy">
                  <h3>{selectedChallenge.title}</h3>
                  <p>{selectedChallenge.description}</p>
                  <span>{selectedChallenge.date}</span>
                  <strong>참여자수 {selectedChallenge.participants}</strong>
                </div>
                <button type="button" className="community_challenge_upload_cta">
                  사진 업로드하기
                </button>
              </article>
            ) : (
              <div className="community_challenge_simple_list">
                {challengeItems.map((item) => (
                  <article key={item.id} className="community_challenge_simple_item">
                    <div className="community_challenge_simple_copy">
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                      <span>{item.date}</span>
                      <strong>참여자수 {item.participants}</strong>
                    </div>
                    <button
                      type="button"
                      className="community_challenge_simple_join"
                      onClick={() => setSelectedChallengeId(item.id)}
                    >
                      참여하기
                    </button>
                  </article>
                ))}
              </div>
            )}
          </section>
        ) : isVoteTab ? (
          selectedVoteSubTab === '목록' ? (
            selectedVoteListId ? (
              <section className="community_vote_candidate_screen">
                <button
                  type="button"
                  className="community_detail_back_button"
                  onClick={() => setSelectedVoteListId(null)}
                >
                  이전
                </button>
                {voteCandidateItems.map((item, index) => (
                  <article key={item.id} className="community_vote_candidate_entry">
                    <div className="community_vote_candidate_placeholder">후보 {index + 1}</div>
                    <div className="community_vote_candidate_panel">
                      <span className="community_vote_candidate_label">{item.badge}</span>
                      <h3>{item.title}</h3>
                      <div className="community_vote_candidate_meta_row">
                        <span>프로필 이미지</span>
                        <span>{item.author}</span>
                      </div>
                      <button type="button" className="community_vote_candidate_action">
                        투표하기
                      </button>
                    </div>
                  </article>
                ))}
              </section>
            ) : (
              <section className="community_vote_list_screen">
                {voteListItems.map((item) => (
                  <article key={item.id} className="community_vote_list_item">
                    <div className="community_vote_list_header">
                      <h3>{item.title}</h3>
                      {item.deadline ? <span>{item.deadline}</span> : null}
                    </div>
                    {item.description ? <p>{item.description}</p> : null}
                    <div className="community_vote_list_meta">
                      <span>프로필 이미지</span>
                      <span>운영팀</span>
                    </div>
                    <div className="community_vote_list_actions">
                      <button type="button" aria-label="좋아요">
                        <span className="community_like_icon" aria-hidden="true">
                          <svg viewBox="0 0 24 24">
                            <path d="M12 20.2 4.9 13.6a4.8 4.8 0 0 1 6.8-6.8L12 7.9l.3-.3a4.8 4.8 0 1 1 6.8 6.8Z" />
                          </svg>
                        </span>
                        <span>좋아요 8</span>
                      </button>
                      <button type="button" aria-label="댓글">
                        <span className="community_comment_icon" aria-hidden="true">
                          <svg viewBox="0 0 24 24">
                            <path d="M12 4.8c-4.4 0-8 2.9-8 6.6 0 2.1 1.2 4 3.1 5.2l-.8 3 3.3-1.8c.8.2 1.6.3 2.4.3 4.4 0 8-2.9 8-6.7s-3.6-6.6-8-6.6Z" />
                            <circle cx="9" cy="11.4" r="0.8" />
                            <circle cx="12" cy="11.4" r="0.8" />
                            <circle cx="15" cy="11.4" r="0.8" />
                          </svg>
                        </span>
                        <span>댓글 3</span>
                      </button>
                      <button type="button" aria-label="공유하기">
                        <span className="community_share_icon" aria-hidden="true">
                          <svg viewBox="0 0 24 24">
                            <path d="M20 4 9.4 14.6" />
                            <path d="m20 4-6.7 15-3.3-6.7L3.3 9 20 4Z" />
                          </svg>
                        </span>
                        <span>공유하기</span>
                      </button>
                    </div>
                    <button
                      type="button"
                      className="community_vote_list_cta"
                      onClick={() => setSelectedVoteListId(item.id)}
                    >
                      투표하러 가기(참여 시+10)
                    </button>
                  </article>
                ))}
              </section>
            )
          ) : selectedVoteSubTab === '투표결과' ? (
            selectedVoteResultId ? (
              <section className="community_vote_result_detail_screen">
                <button
                  type="button"
                  className="community_detail_back_button"
                  onClick={() => setSelectedVoteResultId(null)}
                >
                  이전
                </button>
                <h3>미션 투표 결과</h3>
                <div className="community_vote_result_podium">
                  {voteResultRankings.map((item) => (
                    <article
                      key={item.id}
                      className={`community_vote_result_podium_item ${
                        item.rank === '1위' ? 'is-winner' : ''
                      }`}
                    >
                      <div className="community_vote_result_podium_box">{item.rank}</div>
                      <strong>{item.name}</strong>
                      <span>{item.votes}</span>
                    </article>
                  ))}
                </div>
              </section>
            ) : (
              <section className="community_vote_result_screen">
                {voteResultItems.map((item) => (
                  <article key={item.id} className="community_vote_result_entry">
                    <div className="community_vote_result_placeholder">
                      투표가
                      <br />
                      종료되었습니다.
                    </div>
                    <div className="community_vote_result_panel">
                      <span className="community_vote_result_label">{item.badge}</span>
                      <h3>{item.title}</h3>
                      <button
                        type="button"
                        className="community_vote_result_action"
                        onClick={() => setSelectedVoteResultId(item.id)}
                      >
                        결과보기
                      </button>
                    </div>
                  </article>
                ))}
              </section>
            )
          ) : (
            <section className="community_feed">
              <div className="community_empty_state">투표 콘텐츠 준비중이에요.</div>
            </section>
          )
        ) : isKnowledgeView ? (
          <section className="community_knowledge_feed">
            <div className="community_knowledge_list">
              {knowledgeFeedItems.map((item) => (
                <article key={item.id} className="community_knowledge_feed_card">
                  <img
                    className="community_knowledge_feed_image"
                    src={item.image}
                    alt={item.title}
                  />
                  <div className="community_knowledge_feed_body">
                    <div className="community_knowledge_feed_title_row">
                      <span className="community_knowledge_feed_tag">{item.tag}</span>
                      <h3>{item.title}</h3>
                    </div>
                    <div className="community_knowledge_feed_actions">
                      <button type="button" aria-label="좋아요">
                        <span className="community_like_icon" aria-hidden="true">
                          <svg viewBox="0 0 24 24">
                            <path d="M12 20.2 4.9 13.6a4.8 4.8 0 0 1 6.8-6.8L12 7.9l.3-.3a4.8 4.8 0 1 1 6.8 6.8Z" />
                          </svg>
                        </span>
                        <span>좋아요 {item.likes}</span>
                      </button>
                      <button type="button" aria-label="댓글">
                        <span className="community_comment_icon" aria-hidden="true">
                          <svg viewBox="0 0 24 24">
                            <path d="M12 4.8c-4.4 0-8 2.9-8 6.6 0 2.1 1.2 4 3.1 5.2l-.8 3 3.3-1.8c.8.2 1.6.3 2.4.3 4.4 0 8-2.9 8-6.7s-3.6-6.6-8-6.6Z" />
                            <circle cx="9" cy="11.4" r="0.8" />
                            <circle cx="12" cy="11.4" r="0.8" />
                            <circle cx="15" cy="11.4" r="0.8" />
                          </svg>
                        </span>
                        <span>댓글 {item.comments}</span>
                      </button>
                      <button type="button" aria-label="공유하기">
                        <span className="community_share_icon" aria-hidden="true">
                          <svg viewBox="0 0 24 24">
                            <path d="M20 4 9.4 14.6" />
                            <path d="m20 4-6.7 15-3.3-6.7L3.3 9 20 4Z" />
                          </svg>
                        </span>
                        <span>공유하기</span>
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : isCommunityOverview ? (
          <section className="community_overview">
            <section className="community_overview_section">
              <div className="community_overview_heading">
                <h2>자랑하기</h2>
                <button type="button" onClick={() => setSelectedCommunitySubTab('자랑하기')}>
                  바로가기
                </button>
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
            </section>

            <section className="community_overview_section">
              <div className="community_overview_heading">
                <h2>일상</h2>
                <button type="button" onClick={() => setSelectedCommunitySubTab('일상')}>
                  바로가기
                </button>
              </div>
              <div className="community_overview_post_list">
                {postData.slice(0, 2).map((post) => (
                  <article key={post.id} className="community_post">
                    <img className="community_post_image" src={post.image} alt={post.title} />
                    <div className="community_post_body">
                      <div className="community_post_header">
                        <span className="community_post_tag">{post.tag}</span>
                        <h2>{post.title}</h2>
                      </div>
                      <div className="community_post_meta">
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
            </section>

            <section className="community_overview_section">
              <div className="community_overview_heading">
                <h2>반려상식</h2>
                <button type="button" onClick={() => setSelectedCommunitySubTab('반려상식')}>
                  바로가기
                </button>
              </div>
              <div className="community_overview_post_list">
                {knowledgeFeedItems.slice(0, 2).map((item) => (
                  <article key={item.id} className="community_post">
                    <img className="community_post_image" src={item.image} alt={item.title} />
                    <div className="community_post_body">
                      <div className="community_post_header">
                        <span className="community_post_tag">{item.tag}</span>
                        <h3>{item.title}</h3>
                      </div>
                      <div className="community_post_meta">
                        <span className="community_post_author">운영팀</span>
                      </div>
                      <p className="community_post_date">
                        <span>2026.04.30</span>
                      </p>
                      <div className="community_post_actions">
                        <button type="button" aria-label="좋아요">
                          <span className="community_like_icon" aria-hidden="true">
                            <svg viewBox="0 0 24 24">
                              <path d="M12 20.2 4.9 13.6a4.8 4.8 0 0 1 6.8-6.8L12 7.9l.3-.3a4.8 4.8 0 1 1 6.8 6.8Z" />
                            </svg>
                          </span>
                          <span className="community_action_count">{item.likes}</span>
                        </button>
                        <button type="button" aria-label="댓글">
                          <span className="community_comment_icon" aria-hidden="true">
                            <svg viewBox="0 0 24 24">
                              <path d="M12 4.8c-4.4 0-8 2.9-8 6.6 0 2.1 1.2 4 3.1 5.2l-.8 3 3.3-1.8c.8.2 1.6.3 2.4.3 4.4 0 8-2.9 8-6.7s-3.6-6.6-8-6.6Z" />
                              <circle cx="9" cy="11.4" r="0.8" />
                              <circle cx="12" cy="11.4" r="0.8" />
                              <circle cx="15" cy="11.4" r="0.8" />
                            </svg>
                          </span>
                          <span className="community_action_count">{item.comments}</span>
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
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
                        <span className="community_action_count">
                          {post.likes + (likedPostIds.includes(post.id) ? 1 : 0)}
                        </span>
                      </button>
                      <button type="button" aria-label="댓글">
                        <span className="community_comment_icon" aria-hidden="true">
                          <svg viewBox="0 0 24 24">
                            <path d="M12 4.8c-4.4 0-8 2.9-8 6.6 0 2.1 1.2 4 3.1 5.2l-.8 3 3.3-1.8c.8.2 1.6.3 2.4.3 4.4 0 8-2.9 8-6.7s-3.6-6.6-8-6.6Z" />
                            <circle cx="9" cy="11.4" r="0.8" />
                            <circle cx="12" cy="11.4" r="0.8" />
                            <circle cx="15" cy="11.4" r="0.8" />
                          </svg>
                        </span>
                        <span className="community_action_count">{post.comments}</span>
                      </button>
                      <button type="button" aria-label="공유">
                        <span className="community_share_icon" aria-hidden="true">
                          <svg viewBox="0 0 24 24">
                            <path d="M20 4 9.4 14.6" />
                            <path d="m20 4-6.7 15-3.3-6.7L3.3 9 20 4Z" />
                          </svg>
                        </span>
                        <span className="community_action_count">{post.shares}</span>
                      </button>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="community_empty_state">검색 결과가 없어요.</div>
            )}
          </section>
        )}
        {isCreateOpen ? (
          <section className="community_create_sheet" role="dialog" aria-modal="true" aria-label="글쓰기">
            <form
              className="community_create_form"
              onSubmit={(event) => {
                event.preventDefault()
                createPost()
              }}
            >
              <div className="community_create_header">
                <h2>글쓰기</h2>
                <button type="button" onClick={closeCreatePost} aria-label="닫기">
                  ×
                </button>
              </div>

              <label className="community_create_field">
                <span>카테고리</span>
                <select
                  value={draftTag}
                  onChange={(event) => setDraftTag(event.target.value as CommunitySubTab)}
                >
                  {communitySubTabs.slice(1, 3).map((tab) => (
                    <option key={tab} value={tab}>
                      {tab}
                    </option>
                  ))}
                </select>
              </label>

              <label className="community_create_field">
                <span>제목</span>
                <input
                  value={draftTitle}
                  onChange={(event) => setDraftTitle(event.target.value)}
                  placeholder="제목을 입력해 주세요"
                  maxLength={40}
                />
              </label>

              <label className="community_create_field">
                <span>내용</span>
                <textarea
                  value={draftContent}
                  onChange={(event) => setDraftContent(event.target.value)}
                  placeholder="내용을 입력해 주세요"
                  rows={5}
                />
              </label>

              <label className="community_create_upload">
                <span>사진</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.target.files?.[0]
                    if (!file) return

                    const reader = new FileReader()
                    reader.addEventListener('load', () => {
                      if (typeof reader.result === 'string') {
                        setDraftImage(reader.result)
                      }
                    })
                    reader.readAsDataURL(file)
                  }}
                />
                {draftImage ? (
                  <img src={draftImage} alt="업로드한 사진 미리보기" />
                ) : (
                  <strong>사진 업로드</strong>
                )}
              </label>

              <button type="submit" className="community_create_submit" disabled={!draftTitle.trim()}>
                등록하기
              </button>
            </form>
          </section>
        ) : null}
        <button type="button" className="community_fab" onClick={openCreatePost} aria-label="글쓰기">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </main>
    </>
  )
}

export default Community
