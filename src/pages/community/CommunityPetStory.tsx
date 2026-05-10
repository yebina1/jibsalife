import './Community.css'
import './CommunityPetStory.css'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router'
import PageHeader from '../../components/PageHeader'
import HeaderIcon from '../../components/HeaderIcon'
import Button from '../../components/html/Button'
import FloatingWriteButton from '../../components/FloatingWriteButton'
import knowledge1 from '../../img/knowledge1.png'
import knowledge2 from '../../img/knowledge2.png'
import knowledge3 from '../../img/knowledge3.png'
import knowledge4 from '../../img/knowledge4.png'
import life1 from '../../img/life1.jpg'
import life2 from '../../img/life2.png'
import life3 from '../../img/life3.png'
import life4 from '../../img/life4.png'
import life5 from '../../img/life5.jpg'
import life6 from '../../img/life6.jpg'
import commentIcon from '../../svg/nav communicate.svg'
import sharingIcon from '../../svg/sharing.svg'
import { MY_PROFILE_NAME } from '../../utils/myProfile'
import { petStoryDetailCommentCount } from './CommunityPetStoryDetailData'

const dailyPosts = [
  { id: 1, tag: '일상', title: '강아지 산책하러 나가면 자는척 해요', author: '탬블러', time: '3시간 전', likes: 20, comments: 16, image: null as null | string },
  { id: 2, tag: '일상', title: '강아지 산책하러 나가면 자는척 해요', author: '탬블러', time: '3시간 전', likes: 20, comments: 16, image: life1 },
  { id: 3, tag: '일상', title: '냉전중', author: '장마', time: '3시간 전', likes: 20, comments: 4, image: life2 },
  { id: 4, tag: '일상', title: '강아지 발사탕 스프레이 추천해주세요!', author: '파란꽃', time: '3시간 전', likes: 16, comments: 4, image: life3 },
  { id: 5, tag: '일상', title: '뽀미랑 부산 여행기', author: '뽀직뽀직', time: '3시간 전', likes: 7, comments: 4, image: life4 },
  { id: 6, tag: '일상', title: '말숙이랑 벚꽃', author: '말망', time: '3시간 전', likes: 4, comments: 4, image: life5 },
  { id: 7, tag: '일상', title: '귀여우면 다야?', author: '크림빵', time: '3시간 전', likes: 4, comments: 4, image: life6 },
]

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 20.2 5.2 13.8a4.55 4.55 0 0 1 6.43-6.43L12 7.74l.37-.37a4.55 4.55 0 1 1 6.43 6.43Z" />
    </svg>
  )
}

function CommentIcon() {
  return <img src={commentIcon} alt="" aria-hidden="true" />
}

function ShareIcon() {
  return <img src={sharingIcon} alt="" aria-hidden="true" />
}

type SortOption = '인기순' | '최신순' | '댓글순'
const createdPostsStorageKey = 'jibsalife.community.createdPosts'
const likedPostsStorageKey = 'jibsalife.community.likedPostIds'

type CommunityPost = {
  id: number
  tag: string
  title: string
  content?: string
  author: string
  date: string
  timeText?: string
  likes: number
  comments: number
  shares?: number
  createdAt: string
  image: string | null
  images?: string[]
  tags?: string[]
}

type PetStoryFeedPost = {
  id: number
  tag: string
  title: string
  content?: string
  author: string
  time?: string
  image: string | null
  images?: string[]
  tags?: string[]
  likes: number
  comments: number
  shares?: number
  createdAt?: string
  isCreated?: boolean
  path?: string
  viewsText?: string
  objectPosition?: string
}

function loadCreatedPosts(): CommunityPost[] {
  if (typeof window === 'undefined') return []
  try {
    const saved = window.localStorage.getItem(createdPostsStorageKey)
    const parsed = saved ? JSON.parse(saved) : []
    return Array.isArray(parsed)
      ? (parsed as CommunityPost[]).map((post) => ({
          ...post,
          author: post.author === '나' ? MY_PROFILE_NAME : post.author,
        }))
      : []
  } catch {
    return []
  }
}

function loadLikedPostIds(): number[] {
  if (typeof window === 'undefined') return []
  try {
    const saved = window.localStorage.getItem(likedPostsStorageKey)
    const parsed = saved ? JSON.parse(saved) : []
    return Array.isArray(parsed) ? parsed.filter((id): id is number => typeof id === 'number') : []
  } catch {
    return []
  }
}

const postData: CommunityPost[] = [
  { id: 1, tag: '일상', title: '강아지 산책하러 나가면 자는척 해요', author: '뿌직뿌직', date: '2026.04.30', timeText: '3시간 전', likes: 4, comments: 4, createdAt: '2026-04-30T09:00:00', image: life1 },
  { id: 2, tag: '일상', title: '냉전중', author: '뿌직뿌직', date: '2026.04.30', timeText: '3시간 전', likes: 4, comments: 4, createdAt: '2026-04-30T18:20:00', image: life2 },
  { id: 3, tag: '일상', title: '강아지 발사탕 스프레이 추천해주세요!', author: '뿌직뿌직', date: '2026.04.30', timeText: '3시간 전', likes: 4, comments: 4, createdAt: '2026-04-30T14:10:00', image: life3 },
  { id: 4, tag: '일상', title: '뽀미랑 부산 여행기', author: '뿌직뿌직', date: '2026.04.30', timeText: '3시간 전', likes: 4, comments: 4, createdAt: '2026-04-30T11:00:00', image: life4 },
  { id: 5, tag: '일상', title: '말숙이랑 벚꽃 구경 다녀왔어요', author: '말숙이맘', date: '2026.04.30', timeText: '3시간 전', likes: 4, comments: 4, createdAt: '2026-04-30T10:20:00', image: life5 },
  { id: 6, tag: '일상', title: '귀여우면 다야?', author: '크림빵', date: '2026.04.30', timeText: '3시간 전', likes: 4, comments: 4, createdAt: '2026-04-30T08:40:00', image: life6 },
]

const knowledgeFeedItems = [
  { id: 1, tag: '산책', title: '강아지 산책 안 하면 생기는 문제점', image: knowledge1, likes: 8, comments: 3, viewsText: '1.2k', objectPosition: '61% center', path: '/community/petstory/knowledge/walk-problems' },
  { id: 2, tag: '건강', title: '고양이 점프의 숨겨진 비밀', image: knowledge2, likes: 8, comments: 3, viewsText: '968', objectPosition: '64% center', path: '/community/petstory/knowledge/walk-problems' },
  { id: 3, tag: '일상', title: '강아지에게 절대 주면 안 되는 음식 7가지', image: knowledge3, likes: 8, comments: 3, viewsText: '860', objectPosition: '43% center', path: '/community/petstory/knowledge/walk-problems' },
  { id: 4, tag: '일상', title: '봄철 강아지 알레르기 증상과 관리법', image: knowledge4, likes: 8, comments: 3, viewsText: '482', objectPosition: '48% center', path: '/community/petstory/knowledge/walk-problems' },
] as const

const sortByParam: Record<string, SortOption> = {
  popular: '인기순',
  latest: '최신순',
  comments: '댓글순',
}

function toFeedPost(post: CommunityPost): PetStoryFeedPost {
  return {
    id: post.id,
    tag: post.tag,
    title: post.title,
    content: post.content,
    author: post.author,
    time: post.timeText ?? post.date,
    image: post.image,
    images: post.images,
    tags: post.tags,
    likes: post.likes,
    comments: post.comments,
    shares: post.shares ?? 0,
    createdAt: post.createdAt,
    isCreated: true,
  }
}

function getRelativeTimeText(createdAt: string, nowTime: number) {
  const createdTime = new Date(createdAt).getTime()
  const diffSeconds = Math.max(0, Math.floor((nowTime - createdTime) / 1000))
  const diffMinutes = Math.floor(diffSeconds / 60)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)
  const diffMonths = Math.floor(diffDays / 30)
  const diffYears = Math.floor(diffMonths / 12)

  if (diffSeconds < 60) return '방금 전'
  if (diffMinutes < 60) return `${diffMinutes}분 전`
  if (diffHours <= 23) return `${diffHours}시간 전`
  if (diffDays <= 31) return `${diffDays}일 전`
  if (diffMonths <= 12) return `${Math.max(1, diffMonths)}달 전`
  return `${Math.max(1, diffYears)}년 전`
}

function CommunityPetStory() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [searchParams] = useSearchParams()
  const sortParam = searchParams.get('sort') ?? 'popular'
  const selectedSort = sortByParam[sortParam] ?? '인기순'

  const [likedPostIds, setLikedPostIds] = useState<number[]>(loadLikedPostIds)
  const [createdPosts] = useState<CommunityPost[]>(loadCreatedPosts)
  const [nowTime, setNowTime] = useState(() => Date.now())

  const isOverview = pathname === '/community/petstory'
  const isKnowledge = pathname === '/community/petstory/knowledge'
  const isDaily = pathname === '/community/petstory/daily'

  useEffect(() => {
    window.localStorage.setItem(likedPostsStorageKey, JSON.stringify(likedPostIds))
  }, [likedPostIds])

  useEffect(() => {
    const syncLikedPostIds = () => {
      setLikedPostIds(loadLikedPostIds())
    }

    window.addEventListener('focus', syncLikedPostIds)
    window.addEventListener('pageshow', syncLikedPostIds)

    return () => {
      window.removeEventListener('focus', syncLikedPostIds)
      window.removeEventListener('pageshow', syncLikedPostIds)
    }
  }, [])

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setNowTime(Date.now())
    }, 30000)

    return () => window.clearInterval(timerId)
  }, [])

  const visibleCreatedPosts = useMemo(
    () => createdPosts.filter((post) => post.tag === '일상'),
    [createdPosts],
  )
  const isCreatedPost = useCallback(
    (postId: number) => visibleCreatedPosts.some((post) => post.id === postId),
    [visibleCreatedPosts],
  )
  const getPostTimeText = (post: { id: number; createdAt?: string; time?: string; timeText?: string }) => {
    if (post.createdAt && isCreatedPost(post.id)) {
      return getRelativeTimeText(post.createdAt, nowTime)
    }

    return post.time ?? post.timeText
  }
  const getPostCommentCount = (post: { id: number; image: string | null }) => {
    try {
      const saved = window.localStorage.getItem(`jibsalife.community.comments.${post.id}`)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) return parsed.length
      }
    } catch {
      // Ignore malformed localStorage data and fall back to the default count.
    }
    if (isCreatedPost(post.id)) return 0
    return post.image ? petStoryDetailCommentCount : 0
  }
  const openPostDetail = (post: {
    id: number
    tag: string
    title: string
    content?: string
    author: string
    time?: string
    timeText?: string
    date?: string
    image: string | null
    images?: string[]
    tags?: string[]
    likes: number
    comments: number
    shares?: number
    createdAt?: string
  }) => {
    navigate(`/community/petstory/detail/${post.id}`, {
      state: {
        post: {
          id: post.id,
          tag: post.tag,
          title: post.title,
          content: post.content,
          author: post.author,
          time: getPostTimeText(post),
          date: post.date,
          image: post.image,
          images: post.images,
          tags: post.tags,
          likes: post.likes,
          comments: getPostCommentCount(post),
          shares: post.shares ?? 10,
          createdAt: post.createdAt,
        },
      },
    })
  }

  const openKnowledgeDetail = (item: {
    id: number
    tag: string
    title: string
    image: string
    likes: number
    comments: number
    viewsText?: string
    objectPosition?: string
    path?: string
  }) => {
    navigate(item.path ?? '/community/petstory/knowledge/walk-problems', {
      state: {
        item,
      },
    })
  }

  const posts = useMemo(() => {
    const activePostData = [...visibleCreatedPosts, ...postData]

    return [...activePostData].sort((a, b) => {
      if (selectedSort === '인기순') {
        if (b.likes !== a.likes) return b.likes - a.likes
        return b.comments - a.comments
      }
      if (selectedSort === '댓글순') {
        if (b.comments !== a.comments) return b.comments - a.comments
        return b.likes - a.likes
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  }, [selectedSort, visibleCreatedPosts])

  const dailyFeedPosts = useMemo(() => {
    const combined: PetStoryFeedPost[] = [
      ...visibleCreatedPosts.map(toFeedPost),
      ...dailyPosts.map((post) => ({
        id: post.id,
        tag: post.tag,
        title: post.title,
        author: post.author,
        time: post.time,
        image: post.image as string | null,
        likes: post.likes,
        comments: post.comments,
        createdAt: '2026-04-30T00:00:00',
      })),
    ]

    return combined.sort((a, b) => {
      if (selectedSort === '인기순') {
        if (a.createdAt && b.createdAt && a.createdAt !== b.createdAt) {
          const aIsCreated = isCreatedPost(a.id)
          const bIsCreated = isCreatedPost(b.id)
          if (aIsCreated !== bIsCreated) return aIsCreated ? -1 : 1
        }
        if (b.likes !== a.likes) return b.likes - a.likes
        return b.comments - a.comments
      }
      if (selectedSort === '댓글순') {
        if (b.comments !== a.comments) return b.comments - a.comments
        return b.likes - a.likes
      }
      return new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
    })
  }, [isCreatedPost, selectedSort, visibleCreatedPosts])

  const overviewPosts = useMemo(() => {
    const combined: PetStoryFeedPost[] = [
      ...dailyFeedPosts,
      ...knowledgeFeedItems.map((item) => ({
        id: item.id + 1000,
        tag: '반려상식' as string,
        title: item.title,
        author: '운영팀',
        time: undefined as string | undefined,
        image: item.image as string | null,
        likes: item.likes,
        comments: item.comments,
        path: item.path,
        viewsText: item.viewsText,
        objectPosition: item.objectPosition,
        createdAt: '2026-04-29T00:00:00',
      })),
    ]
    return combined.sort((a, b) => {
      if (selectedSort === '인기순') {
        if (a.createdAt && b.createdAt && a.createdAt !== b.createdAt) {
          const aIsCreated = isCreatedPost(a.id)
          const bIsCreated = isCreatedPost(b.id)
          if (aIsCreated !== bIsCreated) return aIsCreated ? -1 : 1
        }
        if (b.likes !== a.likes) return b.likes - a.likes
        return b.comments - a.comments
      }
      if (selectedSort === '댓글순') {
        if (b.comments !== a.comments) return b.comments - a.comments
        return b.likes - a.likes
      }
      return new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
    })
  }, [dailyFeedPosts, isCreatedPost, selectedSort])

  const toggleLike = (postId: number) => {
    setLikedPostIds((prev) =>
      prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
    )
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
            <Button type="button" aria-label="캘린더" onClick={() => navigate('/mission')}>
              <HeaderIcon type="calendar" />
            </Button>
            <Button type="button" aria-label="알림">
              <HeaderIcon type="notification" />
            </Button>
          </>
        }
      />

      <main className={isDaily ? 'page cpsd_page' : 'page community_page community_page_petstory'}>
        {isDaily ? (
          <div className="cpsd_feed">
            {dailyFeedPosts.map((post) => (
              <article
                key={post.id}
                className={`cpsd_item${post.image == null ? ' cpsd_item_featured' : ''}`}
                onClick={() => openPostDetail(post)}
              >
                {post.image != null && (
                  <img src={post.image} alt="" className="cpsd_thumb" />
                )}
                <div className="cpsd_body">
                  <h2 className="cpsd_title">
                    <span className="community_post_tag">{post.tag}</span>
                    <span className="cpsd_title_text">{post.title}</span>
                  </h2>
                  <div className="cpsd_meta">
                    <span className="cpsd_author">{post.author}</span>
                    <span className="cpsd_meta_divider" aria-hidden="true">|</span>
                    <span className="cpsd_time">{getPostTimeText(post)}</span>
                  </div>
                  <div className="cpsd_actions">
                    <div
                      className={`cpsd_like_stat${likedPostIds.includes(post.id) ? ' active' : ''}`}
                    >
                      <span className="cpsd_action_icon"><HeartIcon /></span>
                      <span>{post.likes + (likedPostIds.includes(post.id) ? 1 : 0)}</span>
                    </div>
                    <div className="cpsd_comment_stat">
                      <span className="cpsd_action_icon"><CommentIcon /></span>
                      <span>{getPostCommentCount(post)}</span>
                    </div>
                    <div className="cpsd_share_stat">
                      <span className="cpsd_action_icon"><ShareIcon /></span>
                      <span>{post.shares ?? 10}</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : isKnowledge ? (
          <section className="community_knowledge_feed">
            <div className="community_knowledge_list">
              {knowledgeFeedItems.map((item) => (
                <article
                  key={item.id}
                  className="community_knowledge_feed_card community_knowledge_feed_card_clickable"
                  onClick={() => openKnowledgeDetail(item)}
                >
                  <img
                    className="community_knowledge_feed_image"
                    src={item.image}
                    alt={item.title}
                    style={{ objectPosition: item.objectPosition }}
                  />
                  <div className="community_knowledge_feed_overlay">
                    <h3>{item.title}</h3>
                    <span className="community_knowledge_feed_views">
                      <span className="community_knowledge_feed_view_icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24">
                          <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      </span>
                      <span>{item.viewsText}</span>
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : isOverview ? (
          <section className="community_feed">
            {overviewPosts.map((post) => (
              <article
                key={post.id}
                className={`cpsd_item${post.image == null ? ' cpsd_item_featured' : ''}`}
                onClick={() => {
                  if (post.path) {
                    openKnowledgeDetail({
                      id: post.id,
                      tag: post.tag,
                      title: post.title,
                      image: post.image ?? knowledge1,
                      likes: post.likes,
                      comments: post.comments,
                      viewsText: post.viewsText,
                      objectPosition: post.objectPosition,
                      path: post.path,
                    })
                    return
                  }
                  openPostDetail(post)
                }}
              >
                {post.image != null && (
                  <img src={post.image} alt="" className="cpsd_thumb" />
                )}
                <div className="cpsd_body">
                  <h2 className="cpsd_title">
                    <span className="community_post_tag">{post.tag}</span>
                    <span className="cpsd_title_text">{post.title}</span>
                  </h2>
                  <div className="cpsd_meta">
                    <span className="cpsd_author">{post.author}</span>
                    {getPostTimeText(post) && (
                      <>
                        <span className="cpsd_meta_divider" aria-hidden="true">|</span>
                        <span className="cpsd_time">{getPostTimeText(post)}</span>
                      </>
                    )}
                  </div>
                  <div className="cpsd_actions">
                    <div
                      className={`cpsd_like_stat${likedPostIds.includes(post.id) ? ' active' : ''}`}
                    >
                      <span className="cpsd_action_icon"><HeartIcon /></span>
                      <span>{post.likes + (likedPostIds.includes(post.id) ? 1 : 0)}</span>
                    </div>
                    <div className="cpsd_comment_stat">
                      <span className="cpsd_action_icon"><CommentIcon /></span>
                      <span>{getPostCommentCount(post)}</span>
                    </div>
                    <div className="cpsd_share_stat">
                      <span className="cpsd_action_icon"><ShareIcon /></span>
                      <span>{post.shares ?? 10}</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </section>
        ) : (
          <section className="community_feed">
            {posts.length > 0 ? (
              posts.map((post) => (
                <article
                  key={post.id}
                  className={`community_post${post.image == null ? ' community_post_featured' : ''}`}
                  onClick={() => openPostDetail(post)}
                >
                  {post.image != null && (
                    <img className="community_post_image" src={post.image} alt={post.title} />
                  )}
                  <div className="community_post_body">
                    <div className="community_post_header">
                      <span className="community_post_tag">{post.tag}</span>
                      <h2>{post.title}</h2>
                    </div>
                    <div className="community_post_meta">
                      <span className="community_post_author">{post.author}</span>
                    </div>
                    <p className="community_post_date">
                      {getPostTimeText(post) ? <span>{getPostTimeText(post)}</span> : null}
                      <span>{post.date}</span>
                    </p>
                    <div className="community_post_actions">
                      <button
                        type="button"
                        className={likedPostIds.includes(post.id) ? 'active' : ''}
                        onClick={(event) => {
                          event.stopPropagation()
                          toggleLike(post.id)
                        }}
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
                      <button type="button" aria-label="댓글" onClick={(event) => event.stopPropagation()}>
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
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="community_empty_state">게시글이 없어요.</div>
            )}
          </section>
        )}

        {!isKnowledge && <FloatingWriteButton onClick={() => navigate('/community/petstory/write')} />}
      </main>
    </>
  )
}

export default CommunityPetStory
