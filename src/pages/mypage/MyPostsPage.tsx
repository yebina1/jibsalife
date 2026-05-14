import './MyPostsPage.css'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import PageHeader from '../../components/PageHeader'
import BackButton from '../../components/html/BackButton'
import Button from '../../components/html/Button'
import { readMyProfileName } from '../../utils/myProfile'

const createdPostsStorageKey = 'jibsalife.community.createdPosts'

const UI = {
  title: '\uB0B4\uAC00 \uC791\uC131\uD55C \uAE00',
  countSuffix: '\uAC1C',
  intro: '\uB0B4\uAC00 \uC791\uC131\uD55C \uAC8C\uC2DC\uAE00\uB9CC \uBAA8\uC544\uBCFC \uC218 \uC788\uC5B4\uC694.',
  listLabel: '\uB0B4\uAC00 \uC791\uC131\uD55C \uAE00 \uBAA9\uB85D',
  likes: '\uC88B\uC544\uC694',
  comments: '\uB313\uAE00',
  shares: '\uACF5\uC720',
  emptyLabel: '\uC791\uC131\uD55C \uAE00 \uC5C6\uC74C',
  emptyTitle: '\uC544\uC9C1 \uC791\uC131\uD55C \uAC8C\uC2DC\uAE00\uC774 \uC5C6\uC5B4\uC694.',
  emptyBody:
    '\uCEE4\uBBA4\uB2C8\uD2F0\uC5D0 \uCCAB \uAE00\uC744 \uB0A8\uAE30\uACE0 \uB9C8\uC774\uD398\uC774\uC9C0\uC5D0\uC11C \uB2E4\uC2DC \uBAA8\uC544\uBCF4\uC138\uC694.',
  writeCta: '\uAE00 \uC791\uC131\uD558\uB7EC \uAC00\uAE30',
  totalPrefix: '\uCD1D',
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
  createdAt?: string
  image: string | null
  images?: string[]
  tags?: string[]
}

type MyPostCard = MyPost & {
  dateLabel: string
  commentCount: number
}

function readMyPosts(): MyPost[] {
  if (typeof window === 'undefined') return []

  try {
    const saved = window.localStorage.getItem(createdPostsStorageKey)
    const parsed = saved ? JSON.parse(saved) : []

    if (!Array.isArray(parsed)) return []

    const profileName = readMyProfileName()

    return parsed
      .filter((post): post is MyPost => typeof post?.id === 'number' && typeof post?.title === 'string')
      .map((post) => ({
        ...post,
        author: typeof post.author === 'string' && post.author.trim() ? post.author : profileName,
      }))
      .sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime())
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

function formatDateLabel(post: MyPost) {
  if (post.date) return post.date
  if (!post.createdAt) return ''

  const date = new Date(post.createdAt)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}.${month}.${day}`
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
                  <strong className="myposts_title">{post.title}</strong>
                  {post.content ? <p className="myposts_excerpt">{post.content}</p> : null}
                  <div className="myposts_meta">
                    <span>{`${UI.likes} ${post.likes ?? 0}`}</span>
                    <span>{`${UI.comments} ${post.commentCount}`}</span>
                    <span>{`${UI.shares} ${post.shares ?? 0}`}</span>
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
