import './community.css'
import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router'
import PageHeader from '../components/PageHeader'
import BackButton from '../components/html/BackButton'
import contents1 from '../img/contents1.png'
import contents2 from '../img/contents2.png'
import contents3 from '../img/contents3.png'
import contents4 from '../img/contents4.png'

const primaryTabs = ['전체', '커뮤니티', '챌린지 인증', '투표'] as const
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
    title: '강아지가 산책 나가려 하면 자는 척 해요',
    author: '뿌직뿌직',
    date: '2024.05.01',
    timeText: '3시간전',
    likes: 8,
    comments: 3,
    createdAt: '2024-05-01T09:00:00',
    image: contents4,
  },
  {
    id: 2,
    tag: '일상',
    title: '냉전중',
    author: '귀염뽀짝돼지',
    date: '2026.04.30',
    likes: 6,
    comments: 1,
    createdAt: '2026-04-30T18:20:00',
    image: contents2,
  },
  {
    id: 3,
    tag: 'Q&A',
    title: '강아지 발사탕 스프레이 추천해주세요!',
    author: '조용한 판다',
    date: '2026.04.30',
    likes: 6,
    comments: 1,
    createdAt: '2026-04-30T14:10:00',
    image: contents1,
  },
  {
    id: 4,
    tag: '일상',
    title: '오늘도 열심히 산책했네요',
    author: '푸른뿜롱이',
    date: '2026.04.30',
    likes: 6,
    comments: 1,
    createdAt: '2026-04-30T11:00:00',
    image: contents3,
  },
  {
    id: 5,
    tag: '일상',
    title: '뽀미랑 부산 여행기',
    author: '노루야',
    date: '2026.04.30',
    likes: 6,
    comments: 1,
    createdAt: '2026-04-30T08:30:00',
    image: contents4,
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
    title: '새 옷 입고 산책 다녀온 날',
    author: '코코아빠',
    date: '2026.04.30',
    likes: 14,
    comments: 4,
    createdAt: '2026-04-30T17:00:00',
    image: contents2,
  },
  {
    id: 103,
    tag: '자랑하기',
    title: '간식 앞에서 세상 제일 예쁜 표정',
    author: '뽀삐누나',
    date: '2026.04.30',
    likes: 20,
    comments: 9,
    createdAt: '2026-04-30T15:20:00',
    image: contents3,
  },
  {
    id: 104,
    tag: '자랑하기',
    title: '목욕하고 보송보송해진 우리 애기',
    author: '초코집사',
    date: '2026.04.30',
    likes: 11,
    comments: 2,
    createdAt: '2026-04-30T12:40:00',
    image: contents4,
  },
] 

const knowledgeContentItems = [
  { id: 1, title: '활동량이 줄어든 아이를 위한 추천 장난감', image: contents3 },
  { id: 2, title: '우리 아이 상태별 추천 혜택', image: contents1 },
  { id: 3, title: '우리 아이 상태별 추천 혜택', image: contents2 },
  { id: 4, title: '반려견을 위한 케어 아이템 3종', image: contents4 },
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
    subtitle: '밥 먹는 사진 중 BEST를 골라주세요!',
    author: '운영팀',
    likes: 8,
    comments: 3,
    deadline: '마감시간 23:59',
  },
  {
    id: 2,
    title: '투표2.',
    author: '운영팀',
    likes: 8,
    comments: 3,
    deadline: '',
  },
  {
    id: 3,
    title: '투표3.',
    author: '운영팀',
    likes: 8,
    comments: 3,
    deadline: '',
  },
  {
    id: 4,
    title: '투표4.',
    author: '운영팀',
    likes: 8,
    comments: 3,
    deadline: '',
  },
  {
    id: 5,
    title: '투표5.',
    author: '운영팀',
    likes: 8,
    comments: 3,
    deadline: '',
  },
]

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
    title: '밥 먹는 사진 중 BEST를 골라주세요!',
    results: [
      { id: 1, rank: '2위', name: '초코송이', votes: '53표', image: contents2 },
      { id: 2, rank: '1위', name: '버찌부찌', votes: '88표', image: contents4 },
      { id: 3, rank: '3위', name: '코코아빠', votes: '32표', image: contents1 },
    ],
  },
  {
    id: 2,
    badge: '산책 인증',
    title: '산책 인증 사진 중 BEST를 골라주세요!',
    results: [
      { id: 1, rank: '1위', name: '푸른뿜롱이', votes: '71표', image: contents3 },
      { id: 2, rank: '2위', name: '노루야', votes: '59표', image: contents4 },
      { id: 3, rank: '3위', name: '초코송이', votes: '28표', image: contents2 },
    ],
  },
  {
    id: 3,
    badge: '산책 인증',
    title: '산책 인증 사진 중 BEST를 골라주세요!',
    results: [
      { id: 1, rank: '1위', name: '콩이맘', votes: '64표', image: contents1 },
      { id: 2, rank: '2위', name: '초코송이', votes: '44표', image: contents2 },
      { id: 3, rank: '3위', name: '버찌부찌', votes: '31표', image: contents4 },
    ],
  },
] as const

type VoteCandidate = {
  id: number
  badge: string
  title: string
  author: string
  placeholder: string
}

const voteCandidates: VoteCandidate[] = [
  {
    id: 1,
    badge: '챌린지 인증',
    title: '맛있는 밥시간!',
    author: '버찌부찌',
    placeholder: '후보 1',
  },
  {
    id: 2,
    badge: '챌린지 인증',
    title: '냠냠 잘 먹는 우리 댕댕이',
    author: '초코송이',
    placeholder: '후보 2',
  },
  {
    id: 3,
    badge: '챌린지 인증',
    title: '밥이 제일 좋아!',
    author: '코코아빠',
    placeholder: '후보 3',
  },
  {
    id: 4,
    badge: '챌린지 인증',
    title: '오늘도 클리어',
    author: '콩이맘',
    placeholder: '후보 4',
  },
]

type ChallengeItem = {
  id: number
  title: string
  description: string
  date: string
  participants: number
  detailTitle: string
}

const challengeData: ChallengeItem[] = [
  {
    id: 1,
    title: '오늘의 미션',
    description: '밥 먹는 사진 중 BEST를 골라주세요!',
    date: '2026.04.30',
    participants: 8,
    detailTitle: '오늘의 미션',
  },
  {
    id: 2,
    title: '산책 인증 챌린지',
    description: '우리아이 즐겁게 산책하는 순간을 자랑해보세요',
    date: '2026.04.30',
    participants: 8,
    detailTitle: '산책 인증 챌린지',
  },
  {
    id: 3,
    title: '비포 애프터 콘텐츠',
    description: '우리아이 미용 전과 후 사진을 올려주세요',
    date: '2026.04.30',
    participants: 8,
    detailTitle: '비포 애프터 콘텐츠',
  },
  {
    id: 4,
    title: '코오코오 챌린지',
    description: '우리아이 잠자는 모습 자랑해보세요',
    date: '2026.04.30',
    participants: 8,
    detailTitle: '코오코오 챌린지',
  },
]

function Community() {
  const [searchParams] = useSearchParams()
  const initialKnowledgeView = searchParams.get('tab') === 'knowledge'
  const [selectedPrimaryTab, setSelectedPrimaryTab] =
    useState<(typeof primaryTabs)[number]>(initialKnowledgeView ? '커뮤니티' : '커뮤니티')
  const [selectedSecondaryTab, setSelectedSecondaryTab] =
    useState<(typeof communityTabs)[number] | (typeof voteTabs)[number]>(
      initialKnowledgeView ? '반려상식' : '일상'
    )
  const [selectedSort, setSelectedSort] = useState<(typeof sortOptions)[number]>('인기순')
  const [isSortOpen, setIsSortOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [likedPostIds, setLikedPostIds] = useState<number[]>([])
  const [selectedChallengeId, setSelectedChallengeId] = useState<number | null>(null)
  const [isVoteCandidateOpen, setIsVoteCandidateOpen] = useState(false)
  const [selectedVoteResultId, setSelectedVoteResultId] = useState<number | null>(null)
  const isBraggingView =
    selectedPrimaryTab === '커뮤니티' && selectedSecondaryTab === '자랑하기'
  const activePostData = isBraggingView ? braggingPostData : postData

  const posts = useMemo(() => {
    const normalizedKeyword = searchTerm.trim().toLowerCase()
    const filteredPosts = activePostData.filter((post) =>
      [post.title, post.author, post.tag].some((value) =>
        !normalizedKeyword || value.toLowerCase().includes(normalizedKeyword)
      )
    )

    return [...filteredPosts].sort((a, b) => {
      const aLikes = a.likes + (likedPostIds.includes(a.id) ? 1 : 0)
      const bLikes = b.likes + (likedPostIds.includes(b.id) ? 1 : 0)

      if (selectedSort === '인기순') {
        if (bLikes !== aLikes) {
          return bLikes - aLikes
        }

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

  const openVoteCandidates = () => {
    setSelectedSecondaryTab(voteTabs[1])
    setSelectedVoteResultId(null)
    setIsVoteCandidateOpen(true)
  }

  const openVoteResults = (voteResultId: number | null = null) => {
    setIsVoteCandidateOpen(false)
    setSelectedSecondaryTab(voteTabs[2])
    setSelectedVoteResultId(voteResultId)
  }

  const isVoteView = selectedPrimaryTab === '투표'
  const isCommunityOverview =
    selectedPrimaryTab === '커뮤니티' && selectedSecondaryTab === '전체'
  const isVoteOverview = isVoteView && selectedSecondaryTab === '전체'
  const isDailyCommunityView =
    selectedPrimaryTab === '커뮤니티' && selectedSecondaryTab === '일상'
  const isKnowledgeView =
    selectedPrimaryTab === '커뮤니티' && selectedSecondaryTab === '반려상식'
  const isChallengeView = selectedPrimaryTab === '챌린지 인증'
  const currentSecondaryTabs = isVoteView ? voteTabs : communityTabs
  const selectedChallenge = challengeData.find((item) => item.id === selectedChallengeId) ?? null
  const isVoteListView = isVoteView && selectedSecondaryTab === '목록'
  const isVoteResultView = isVoteView && selectedSecondaryTab === '투표 결과'
  const selectedVoteResult =
    voteResultData.find((item) => item.id === selectedVoteResultId) ?? null
  const showCommunityBackButton =
    selectedChallenge !== null || isVoteCandidateOpen || selectedVoteResult !== null
  const braggingSummaryPosts = braggingPostData.slice(0, 2)
  const dailySummaryPosts = postData.slice(0, 2)
  const knowledgeSummaryItems = knowledgeContentItems.slice(0, 2)
  const voteSummaryItems = voteData.slice(0, 2)
  const voteResultSummaryItems = voteResultData.slice(0, 2)

  return (
    <>
      <PageHeader
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
          </>
        }
      >
        <p>
          일상, 정보, 투표와 챌린지까지
          <br />
          우리 아이 이야기를 자유롭게 나눠보세요
        </p>
      </Title>
        */}


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
            <button
              key={tab}
              type="button"
              className={selectedSecondaryTab === tab ? 'active' : ''}
              onClick={() => {
                if (isVoteView && tab === voteTabs[2]) {
                  openVoteResults()
                  return
                }

                setSelectedSecondaryTab(tab)
                setIsVoteCandidateOpen(false)
                setSelectedVoteResultId(null)
              }}
            >
              {tab}
            </button>
          ))}
        </section>
      ) : null}

      {!isVoteView ? (
        <>
          {!isChallengeView ? (
            <section className="community_search_box">
              <label className="community_search_field">
                <span className="community_search_icon" aria-hidden="true">
                  ⌕
                </span>
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="제목, 작성자, 태그로 검색"
                  aria-label="커뮤니티 검색"
                />
              </label>
            </section>
          ) : null}

          <section className="community_sort_bar" aria-label="정렬">
            <div className={`community_sort_dropdown ${isSortOpen ? 'open' : ''}`}>
              <button
                type="button"
                className="community_sort_toggle active"
                onClick={() => setIsSortOpen((prev) => !prev)}
              >
                {selectedSort}▼
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
        </>
      ) : null}

      {isChallengeView && selectedChallenge ? (
        <section className="community_challenge_detail">
          <h2>챌린지</h2>
          <article className="community_challenge_detail_card">
            <h3>{selectedChallenge.detailTitle}</h3>
            <p>{selectedChallenge.description}</p>
            <span>{selectedChallenge.date}</span>
            <strong>참여자 수 {selectedChallenge.participants}</strong>
          </article>

          <button type="button" className="community_challenge_upload">
            사진 업로드하기
          </button>
        </section>
      ) : isChallengeView ? (
        <section className="community_challenge_view">
          <article className="community_challenge_featured">
            <h2>이번주 특별 상금 챌린지</h2>
            <div className="community_challenge_progress">
              <div className="community_challenge_progress_fill" />
              <span>30% 달성</span>
            </div>
            <strong>60</strong>
            <button type="button">특별상금 받기</button>
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
                  <button
                    type="button"
                    className="community_challenge_join"
                    onClick={() => setSelectedChallengeId(item.id)}
                  >
                    참여하기
                  </button>
                </article>
              ))}
            </div>
          </section>
        </section>
      ) : isVoteView && isVoteCandidateOpen ? (
        <section className="community_vote_candidate_feed">
          {voteCandidates.map((candidate) => (
            <article key={candidate.id} className="community_vote_candidate_card">
              <div className="community_vote_candidate_image" aria-hidden="true">
                {candidate.placeholder}
              </div>

              <div className="community_vote_candidate_body">
                <span className="community_vote_candidate_badge">{candidate.badge}</span>
                <h2>{candidate.title}</h2>
                <div className="community_vote_candidate_meta">
                  <span className="community_vote_profile_chip">프로필 이미지</span>
                  <span>{candidate.author}</span>
                </div>
                <button
                  type="button"
                  className="community_vote_candidate_button"
                  onClick={() => openVoteResults(voteResultData[0]?.id ?? null)}
                >
                  투표하기
                </button>
              </div>
            </article>
          ))}
        </section>
      ) : isVoteResultView && selectedVoteResult ? (
        <section className="community_vote_result_detail">
          <h2>미션 투표 결과</h2>
          <div className="community_vote_result_rankings">
            {selectedVoteResult.results.map((result) => (
              <article key={result.id} className="community_vote_result_rank_card">
                <img src={result.image} alt={result.name} className="community_vote_result_rank_image" />
                <strong>{result.rank}</strong>
                <span>{result.name}</span>
                <span>{result.votes}</span>
              </article>
            ))}
          </div>
        </section>
      ) : isVoteResultView ? (
        <section className="community_vote_result_feed">
          {voteResultData.map((item) => (
            <article key={item.id} className="community_vote_result_card">
              <div className="community_vote_result_image" aria-hidden="true">
                투표가
                <br />
                종료되었습니다.
              </div>

              <div className="community_vote_result_body">
                <span className="community_vote_candidate_badge">{item.badge}</span>
                <h2>{item.title}</h2>
                <button
                  type="button"
                  className="community_vote_candidate_button"
                  onClick={() => openVoteResults(item.id)}
                >
                  결과보기
                </button>
              </div>
            </article>
          ))}
        </section>
      ) : isVoteOverview ? (
        <section className="community_overview">
          <article className="community_overview_section">
            <div className="community_overview_heading">
              <h2>목록</h2>
              <span>참여 가능한 투표</span>
            </div>
            <div className="community_vote_feed">
              {voteSummaryItems.map((vote) => (
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
                    <button type="button">
                      <span className="community_like_icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24">
                          <path d="M12 20.2 4.9 13.6a4.8 4.8 0 0 1 6.8-6.8L12 7.9l.3-.3a4.8 4.8 0 1 1 6.8 6.8Z" />
                        </svg>
                      </span>
                      좋아요 {vote.likes}
                    </button>
                    <button type="button">
                      <span className="community_comment_icon" aria-hidden="true">
                        댓글
                      </span>
                      댓글 {vote.comments}
                    </button>
                  </div>

                  {vote.deadline ? <p className="community_vote_deadline">{vote.deadline}</p> : null}
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
              {voteResultSummaryItems.map((item) => (
                <article key={item.id} className="community_vote_result_card">
                  <div className="community_vote_result_image" aria-hidden="true">
                    투표가
                    <br />
                    종료되었어요
                  </div>

                  <div className="community_vote_result_body">
                    <span className="community_vote_candidate_badge">{item.badge}</span>
                    <h2>{item.title}</h2>
                    <button
                      type="button"
                      className="community_vote_candidate_button"
                      onClick={() => openVoteResults(item.id)}
                    >
                      결과보기
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </article>
        </section>
      ) : isVoteListView ? (
        <section className="community_vote_feed">
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
                <button type="button">
                  <span className="community_like_icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <path d="M12 20.2 4.9 13.6a4.8 4.8 0 0 1 6.8-6.8L12 7.9l.3-.3a4.8 4.8 0 1 1 6.8 6.8Z" />
                    </svg>
                  </span>
                  좋아요 {vote.likes}
                </button>
                <button type="button">
                  <span className="community_comment_icon" aria-hidden="true">
                    💬
                  </span>
                  댓글 {vote.comments}
                </button>
                <button type="button">
                  <span className="community_share_icon" aria-hidden="true">
                    ↗
                  </span>
                  공유하기
                </button>
              </div>

              {vote.deadline ? <p className="community_vote_deadline">{vote.deadline}</p> : null}

              <button
                type="button"
                className="community_vote_button"
                onClick={openVoteCandidates}
              >
                투표하러 가기(참여 시+10)
              </button>
            </article>
          ))}
        </section>
      ) : isVoteView ? (
        <section className="community_feed">
          <div className="community_empty_state">투표 카테고리를 선택해 주세요.</div>
        </section>
      ) : isCommunityOverview ? (
        <section className="community_overview">
          <article className="community_overview_section">
            <div className="community_overview_heading">
              <h2>자랑하기</h2>
              <span>우리 아이 자랑 모음</span>
            </div>
            <div className="community_overview_post_list">
              {braggingSummaryPosts.map((post) => (
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

          <article className="community_overview_section">
            <div className="community_overview_heading">
              <h2>일상</h2>
              <span>반려생활 이야기</span>
            </div>
            <div className="community_overview_post_list">
              {dailySummaryPosts.map((post) => (
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

          <article className="community_overview_section">
            <div className="community_overview_heading">
              <h2>반려상식</h2>
              <span>짧게 보는 추천 정보</span>
            </div>
            <div className="community_overview_knowledge">
              {knowledgeSummaryItems.map((item) => (
                <article key={item.id} className="community_knowledge_card">
                  <img src={item.image} alt={item.title} />
                  <div className="community_knowledge_overlay">
                    <p>{item.title}</p>
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
      ) : isDailyCommunityView || isBraggingView ? (
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
                    <button type="button">
                      <span className="community_comment_icon" aria-hidden="true">
                        💬
                      </span>
                      댓글 {post.comments}
                    </button>
                    <button type="button">
                      <span className="community_share_icon" aria-hidden="true">
                        ↗
                      </span>
                      공유하기
                    </button>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="community_empty_state">검색 결과가 없어요.</div>
          )}
        </section>
      ) : (
        <section className="community_feed">
          <div className="community_empty_state">
            {selectedPrimaryTab} &gt; {selectedSecondaryTab} 콘텐츠 준비중이에요.
          </div>
        </section>
      )}

      </main>
    </>
  )
}

export default Community
