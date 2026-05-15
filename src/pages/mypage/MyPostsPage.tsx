import './MyPostsPage.css'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import PageHeader from '../../components/PageHeader'
import BackButton from '../../components/html/BackButton'
import Button from '../../components/html/Button'
import { readMyProfileName } from '../../utils/myProfile'
import commentIcon from '../../svg/nav communicate.svg'
import sharingIcon from '../../svg/sharing.svg'

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
  commentCount: number
  viewCount: number
}

const dummyPosts: MyPost[] = [
  {
    id: 900001,
    tag: '일상',
    title: '오늘 산책하다가 웃는 표정이 너무 귀여워서 기록해봤어요.',
    content: '날씨가 좋아서 공원 한 바퀴 돌았는데 표정이 정말 밝았어요. 다음에도 같은 코스로 가보려고요.',
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
    title: '식사량이 줄어들 때 먼저 확인해본 것들 정리',
    content: '사료 종류, 급여 시간, 간식량부터 하나씩 체크해보니 원인을 조금 더 빨리 찾을 수 있었어요.',
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
    content: '패턴이 보여서 상태 변화를 훨씬 빨리 알아차릴 수 있었고 병원 상담할 때도 도움이 됐어요.',
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
    const parsed = saved ? JSON.parse(saved) : []

    if (!Array.isArray(parsed)) return []

    const profileName = readMyProfileName()

    const normalizedPosts = parsed
      .filter((post): post is MyPost => typeof post?.id === 'number' && typeof post?.title === 'string')
      .map((post) => ({
        ...post,
        author: typeof post.author === 'string' && post.author.trim() ? post.author : profileName,
      }))
      .sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime())

    if (normalizedPosts.length > 0) {
      return normalizedPosts
    }

    return dummyPosts.map((post) => ({
      ...post,
      author: profileName,
    }))
  } catch {
    return dummyPosts.map((post) => ({
      ...post,
      author: readMyProfileName(),
    }))
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

function MyPostsPage() {
  const navigate = useNavigate()
  const [posts, setPosts] = useState<MyPost[]>(readMyPosts)

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
        commentCount: readCommentCount(post.id, post.comments ?? 0),
        viewCount: readViewCount(post.id, post.views ?? 0),
      })),
    [posts],
  )

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

  return (
    <>
      <PageHeader title={UI.title} leftContent={<BackButton to="/mypage" />} />

      <main className="page myposts_page">
        <section className="myposts_intro">
          <strong>{`${UI.totalPrefix} ${postCards.length}${UI.countSuffix}`}</strong>
          <p>{UI.intro}</p>
        </section>

        {postCards.length > 0 ? (
          <section className="myposts_list" aria-label={UI.listLabel}>
            {postCards.map((post) => (
              <button
                key={post.id}
                type="button"
                className="myposts_card"
                onClick={() => openPost(post)}
              >
                <div className="myposts_card_body">
                  <div className="myposts_card_header">
                    <span className="myposts_tag">{post.tag}</span>
                    {post.dateLabel ? <span className="myposts_date">{post.dateLabel}</span> : null}
                  </div>
                  <div className="myposts_text">
                    <strong className="myposts_title">{post.title}</strong>
                    {post.content ? <p className="myposts_excerpt">{post.content}</p> : null}
                  </div>
                  <div className="myposts_footer">
                    <div className="myposts_meta">
                      <span className="myposts_meta_item" aria-label={`${UI.likes} ${post.likes ?? 0}`}>
                        <span className="myposts_meta_icon"><HeartIcon /></span>
                        <span>{post.likes ?? 0}</span>
                      </span>
                      <span className="myposts_meta_item" aria-label={`${UI.comments} ${post.commentCount}`}>
                        <span className="myposts_meta_icon"><CommentIcon /></span>
                        <span>{post.commentCount}</span>
                      </span>
                      <span className="myposts_meta_item" aria-label={`${UI.shares} ${post.shares ?? 0}`}>
                        <span className="myposts_meta_icon"><ShareIcon /></span>
                        <span>{post.shares ?? 0}</span>
                      </span>
                    </div>
                    <span className="myposts_views" aria-label={`${UI.views} ${post.viewCount}`}>
                      {`${UI.views} ${post.viewCount.toLocaleString('ko-KR')}`}
                    </span>
                  </div>
                </div>
                {post.image ? (
                  <img className="myposts_thumb" src={post.image} alt="" aria-hidden="true" />
                ) : null}
              </button>
            ))}
          </section>
        ) : (
          <section className="myposts_empty" aria-label={UI.emptyLabel}>
            <strong>{UI.emptyTitle}</strong>
            <p>{UI.emptyBody}</p>
            <Button
              type="button"
              className="s_purple_btn myposts_write_button"
              onClick={() => navigate('/community/petstory/write')}
            >
              {UI.writeCta}
            </Button>
          </section>
        )}
      </main>
    </>
  )
}

export default MyPostsPage
