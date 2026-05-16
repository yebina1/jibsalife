import './MyPostsPage.css'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import PageHeader from '../../components/PageHeader'
import HeaderIcon from '../../components/HeaderIcon'
import BackButton from '../../components/html/BackButton'
import Button from '../../components/html/Button'
import FloatingWriteButton from '../../components/FloatingWriteButton'
import ConfirmDialog from '../../components/ConfirmDialog'
import PetStoryFeedItem from '../../components/PetStoryFeedItem'
import { readMyProfileName } from '../../utils/myProfile'
import emptyPostImage from '../../img/mypage/empty_post_.png'

const createdPostsStorageKey = 'jibsalife.community.createdPosts'

const UI = {
  title: '\uB0B4\uAC00 \uC791\uC131\uD55C \uAE00',
  countSuffix: '\uAC1C',
  intro: '\uB0B4\uAC00 \uC791\uC131\uD55C \uAC8C\uC2DC\uAE00\uB9CC \uBAA8\uC544\uBCFC \uC218 \uC788\uC5B4\uC694.',
  listLabel: '\uB0B4\uAC00 \uC791\uC131\uD55C \uAE00 \uBAA9\uB85D',
  likes: '\uC88B\uC544\uC694',
  comments: '\uB313\uAE00',
  shares: '\uACF5\uC720',
  views: '\uC870\uD68C\uC218',
  emptyLabel: '\uC791\uC131\uD55C \uAE00 \uC5C6\uC74C',
  emptyTitle: '\uC544\uC9C1 \uC791\uC131\uD55C \uAC8C\uC2DC\uAE00\uC774 \uC5C6\uC5B4\uC694.',
  emptyBody:
    '\uCEE4\uBBA4\uB2C8\uD2F0\uC5D0 \uCCAB \uAE00\uC744 \uB0A8\uAE30\uACE0 \uB9C8\uC774\uD398\uC774\uC9C0\uC5D0\uC11C \uB2E4\uC2DC \uBAA8\uC544\uBCF4\uC138\uC694.',
  writeCta: '\uAE00 \uC791\uC131\uD558\uB7EC \uAC00\uAE30',
  totalPrefix: '\uAC8C\uC2DC\uAE00',
} as const

type MyPost = {
  id: number
  tag: string
  title: string
  content?: string
  author?: string
  date?: string
  likes?: number
  comments?: number
  shares?: number
  views?: number
  createdAt?: string
  image: string | null
  images?: string[]
  tags?: string[]
}

type MyPostCard = MyPost & {
  dateLabel: string
  timeLabel: string
  commentCount: number
  viewCount: number
}

const dummyPosts: MyPost[] = [
  {
    id: 900001,
    tag: '일상',
    title: '오늘 산책하다가 잠든 척해서 너무 귀여웠어요.',
    content: '날씨가 좋아서 공원 한 바퀴 돌았는데, 벤치에 앉자마자 꾸벅꾸벅 졸더라고요. 다음에도 같은 코스로 가보려고요.',
    author: '',
    date: '2026.05.15',
    likes: 14,
    comments: 3,
    shares: 1,
    views: 0,
    createdAt: '2026-05-15T10:20:00',
    image: null,
    tags: ['산책', '일상'],
  },
  {
    id: 900002,
    tag: '일상',
    title: '식사량이 줄어서 먼저 확인해본 것들 정리',
    content: '사료 종류, 급여 시간, 간식량까지 하나씩 체크해보니 원인을 조금 더 빨리 찾을 수 있었어요.',
    author: '',
    date: '2026.05.13',
    likes: 22,
    comments: 5,
    shares: 4,
    views: 0,
    createdAt: '2026-05-13T18:05:00',
    image: null,
    tags: ['식사', '건강'],
  },
  {
    id: 900003,
    tag: '일상',
    title: '배변 기록 남기기 시작하고 나서 달라진 점',
    content: '패턴을 보면서 상태 변화를 조금 더 빨리 알아차릴 수 있었고 병원 상담할 때도 도움이 되었어요.',
    author: '',
    date: '2026.05.11',
    likes: 9,
    comments: 2,
    shares: 0,
    views: 0,
    createdAt: '2026-05-11T08:40:00',
    image: null,
    tags: ['배변', '기록'],
  },
]

function readMyPosts(): MyPost[] {
  if (typeof window === 'undefined') return []

  try {
    const saved = window.localStorage.getItem(createdPostsStorageKey)
    const parsed = saved ? JSON.parse(saved) : null

    if (saved !== null && !Array.isArray(parsed)) return []

    const profileName = readMyProfileName()

    if (Array.isArray(parsed)) {
      return parsed
        .filter((post): post is MyPost => typeof post?.id === 'number' && typeof post?.title === 'string')
        .map((post) => ({
          ...post,
          author: typeof post.author === 'string' && post.author.trim() ? post.author : profileName,
        }))
        .sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime())
    }

    return dummyPosts.map((post) => ({
      ...post,
      author: profileName,
    }))
  } catch {
    return []
  }
}

function readCommentCount(postId: number, fallback = 0) {
  if (typeof window === 'undefined') return fallback

  try {
    const saved = window.localStorage.getItem(`jibsalife.community.comments.${postId}`)
    const parsed = saved ? JSON.parse(saved) : null
    return Array.isArray(parsed) ? parsed.length : fallback
  } catch {
    return fallback
  }
}

function readViewCount(postId: number, fallback = 0) {
  if (typeof window === 'undefined') return fallback

  try {
    const saved = window.localStorage.getItem(`jibsalife.community.views.${postId}`)
    const parsed = saved ? parseInt(saved, 10) : fallback
    return Number.isFinite(parsed) ? Math.max(0, parsed) : fallback
  } catch {
    return fallback
  }
}

function formatDateLabel(post: MyPost) {
  if (post.date) return post.date
  if (!post.createdAt) return ''

  const date = new Date(post.createdAt)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}.${month}.${day}`
}

function formatRelativeTimeText(createdAt?: string) {
  if (!createdAt) return ''

  const createdTime = new Date(createdAt).getTime()
  if (!Number.isFinite(createdTime)) return ''

  const diffSeconds = Math.max(0, Math.floor((Date.now() - createdTime) / 1000))
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

function MyPostsPage() {
  const navigate = useNavigate()
  const [posts, setPosts] = useState<MyPost[]>(readMyPosts)
  const [activeMorePostId, setActiveMorePostId] = useState<number | null>(null)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)

  useEffect(() => {
    const syncPosts = () => {
      setPosts(readMyPosts())
    }

    window.addEventListener('focus', syncPosts)
    window.addEventListener('pageshow', syncPosts)
    window.addEventListener('storage', syncPosts)

    return () => {
      window.removeEventListener('focus', syncPosts)
      window.removeEventListener('pageshow', syncPosts)
      window.removeEventListener('storage', syncPosts)
    }
  }, [])

  const postCards = useMemo<MyPostCard[]>(
    () =>
      posts.map((post) => ({
        ...post,
        dateLabel: formatDateLabel(post),
        timeLabel: formatRelativeTimeText(post.createdAt) || formatDateLabel(post),
        commentCount: readCommentCount(post.id, post.comments ?? 0),
        viewCount: readViewCount(post.id, post.views ?? 0),
      })),
    [posts],
  )

  const activeMorePost = postCards.find((post) => post.id === activeMorePostId) ?? null

  const openPost = (post: MyPostCard) => {
    navigate(`/community/petstory/detail/${post.id}`, {
      state: {
        post: {
          id: post.id,
          tag: post.tag,
          title: post.title,
          content: post.content,
          author: post.author ?? readMyProfileName(),
          date: post.dateLabel,
          image: post.image,
          images: post.images,
          tags: post.tags,
          likes: post.likes ?? 0,
          comments: post.commentCount,
          shares: post.shares ?? 0,
          views: post.viewCount,
          createdAt: post.createdAt,
        },
      },
    })
  }

  const closeMoreSheet = () => {
    setActiveMorePostId(null)
  }

  const handleEditPost = (post: MyPostCard) => {
    try {
      window.localStorage.setItem(createdPostsStorageKey, JSON.stringify(posts))
    } catch {
      // Ignore storage write failures and continue to the edit screen.
    }

    navigate('/community/petstory/write', {
      state: {
        editPost: post,
        returnTo: '/mypage/posts',
      },
    })
    closeMoreSheet()
  }

  const handleDeletePost = (post: MyPostCard) => {
    setActiveMorePostId(post.id)
    setIsDeleteConfirmOpen(true)
  }

  const confirmDeletePost = () => {
    if (!activeMorePost) return

    setPosts((current) => current.filter((post) => post.id !== activeMorePost.id))

    try {
      const saved = window.localStorage.getItem(createdPostsStorageKey)
      const parsed = saved ? JSON.parse(saved) : []
      const filtered = Array.isArray(parsed)
        ? parsed.filter((post: { id?: number }) => post?.id !== activeMorePost.id)
        : []
      window.localStorage.setItem(createdPostsStorageKey, JSON.stringify(filtered))
    } catch {
      // Ignore storage write failures and keep the UI in sync for this session.
    }

    setIsDeleteConfirmOpen(false)
    closeMoreSheet()
  }

  return (
    <>
      <PageHeader
        title={UI.title}
        leftContent={<BackButton to="/mypage" />}
        rightContent={
          <>
            <Button type="button" aria-label="캘린더" onClick={() => navigate('/mission')}>
              <HeaderIcon type="calendar" />
            </Button>
            <Button type="button" aria-label="알림" onClick={() => navigate('/notification')}>
              <HeaderIcon type="notification" />
            </Button>
          </>
        }
      />

      <main className="page myposts_page">
        <section className="myposts_intro">
          <strong>{`${UI.totalPrefix} ${postCards.length}${UI.countSuffix}`}</strong>
          <p>{UI.intro}</p>
        </section>

        {postCards.length > 0 ? (
          <section className="myposts_list" aria-label={UI.listLabel}>
            {postCards.map((post) => (
              <PetStoryFeedItem
                key={post.id}
                postId={post.id}
                tag={post.tag}
                title={post.title}
                author={post.author ?? readMyProfileName()}
                time={post.timeLabel}
                image={post.image}
                likes={post.likes ?? 0}
                comments={post.commentCount}
                views={post.viewCount}
                isOwn
                onClick={() => openPost(post)}
                onEdit={() => handleEditPost(post)}
                onDelete={() => handleDeletePost(post)}
              />
            ))}
          </section>
        ) : (
          <section className="myposts_empty" aria-label={UI.emptyLabel}>
            <strong>{UI.emptyTitle}</strong>
            <img className="myposts_empty_img" src={emptyPostImage} alt="" aria-hidden="true" />
          </section>
        )}
      </main>
      {isDeleteConfirmOpen ? (
        <ConfirmDialog
          message="삭제하시겠습니까?"
          onCancel={() => setIsDeleteConfirmOpen(false)}
          onConfirm={confirmDeletePost}
          cancelLabel="아니요"
          confirmLabel="네"
        />
      ) : null}
      <FloatingWriteButton showMenu />
    </>
  )
}

export default MyPostsPage
