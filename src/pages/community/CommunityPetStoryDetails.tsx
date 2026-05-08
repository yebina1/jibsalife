import './CommunityPetStoryDetails.css'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router'
import PageHeader from '../../components/PageHeader'
import HeaderIcon from '../../components/HeaderIcon'
import BackButton from '../../components/html/BackButton'
import Button from '../../components/html/Button'
import CommentInputForm from '../../components/html/CommentInputForm'
import life1 from '../../img/life1.jpg'
import life2 from '../../img/life2.png'
import life3 from '../../img/life3.png'
import life4 from '../../img/life4.png'
import life5 from '../../img/life5.jpg'
import life6 from '../../img/life6.jpg'
import addIcon from '../../svg/add icon.svg'
import emojiIcon from '../../svg/emoji.svg'
import peopleIcon from '../../svg/people.svg'
import { petStoryDetailComments } from './CommunityPetStoryDetailData'

const createdPostsStorageKey = 'jibsalife.community.createdPosts'
const likedPostsStorageKey = 'jibsalife.community.likedPostIds'

type DetailPost = {
  id: number
  tag: string
  title: string
  content?: string
  author: string
  time?: string
  date?: string
  image: string | null
  likes: number
  comments: number
  createdAt?: string
  place?: {
    name: string
    address: string
  }
}

const fallbackPosts: DetailPost[] = [
  {
    id: 1,
    tag: '일상',
    title: '강아지 산책하러 나가면 자는척 해요',
    content: '산책 가자고 하면 신나하다가 막상 나가려면 졸린 척을 해요. 그래도 현관문 열리면 제일 먼저 뛰어나갑니다.',
    author: '탬블러',
    time: '3시간 전',
    image: null,
    likes: 20,
    comments: 0,
  },
  {
    id: 2,
    tag: '일상',
    title: '강아지 산책하러 나가면 자는척 해요',
    content: '오늘도 산책 전에는 세상 귀찮은 표정이었는데, 공원 도착하자마자 꼬리가 멈추질 않았어요.',
    author: '탬블러',
    time: '3시간 전',
    image: life1,
    likes: 20,
    comments: 4,
  },
  {
    id: 3,
    tag: '일상',
    title: '냉전중',
    content: '간식을 늦게 줬더니 하루 종일 눈도 안 마주쳐요. 그래도 이름 부르면 귀는 살짝 움직입니다.',
    author: '장마',
    time: '3시간 전',
    image: life2,
    likes: 20,
    comments: 4,
  },
  {
    id: 4,
    tag: '일상',
    title: '강아지 발사탕 스프레이 추천해주세요!',
    content: '요즘 발을 자주 핥아서 순한 스프레이를 찾고 있어요. 써보고 괜찮았던 제품 있으면 추천 부탁드려요.',
    author: '파란꽃',
    time: '3시간 전',
    image: life3,
    likes: 16,
    comments: 4,
  },
  {
    id: 5,
    tag: '일상',
    title: '뽀미랑 부산 여행기',
    content: '연휴에 맞춰 급으로 가게 되었는데 뽀미랑 좋은 추억을 만들 수 있어서 너무 좋았어요. 숙소는 애견 동반 풀빌라였는데 추천합니다!',
    author: '뽀직뽀직',
    time: '3시간 전',
    image: life4,
    likes: 7,
    comments: 4,
    place: {
      name: '우다다 애견풀빌라',
      address: '부산 금정구',
    },
  },
  {
    id: 6,
    tag: '일상',
    title: '말숙이랑 벚꽃',
    content: '벚꽃 아래에서 사진을 찍었는데 바람이 많이 불어서 귀가 계속 팔랑거렸어요.',
    author: '말망',
    time: '3시간 전',
    image: life5,
    likes: 4,
    comments: 4,
  },
  {
    id: 7,
    tag: '일상',
    title: '귀여우면 다야?',
    content: '사고는 크게 쳤지만 얼굴 보자마자 혼낼 마음이 사라졌어요. 귀여움은 정말 반칙입니다.',
    author: '크림빵',
    time: '3시간 전',
    image: life6,
    likes: 4,
    comments: 4,
  },
]

function readCreatedPosts() {
  if (typeof window === 'undefined') return []

  try {
    const saved = window.localStorage.getItem(createdPostsStorageKey)
    const parsed = saved ? JSON.parse(saved) : []
    return Array.isArray(parsed) ? (parsed as DetailPost[]) : []
  } catch {
    return []
  }
}

function readLikedPostIds() {
  if (typeof window === 'undefined') return []

  try {
    const saved = window.localStorage.getItem(likedPostsStorageKey)
    const parsed = saved ? JSON.parse(saved) : []
    return Array.isArray(parsed) ? parsed.filter((id): id is number => typeof id === 'number') : []
  } catch {
    return []
  }
}

function findFallbackPost(postId: string | undefined) {
  const numericId = Number(postId)
  if (!Number.isFinite(numericId)) return fallbackPosts[4]

  return (
    readCreatedPosts().find((post) => post.id === numericId) ??
    fallbackPosts.find((post) => post.id === numericId) ??
    fallbackPosts[4]
  )
}

function MoreIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="5" r="1.8" />
      <circle cx="12" cy="12" r="1.8" />
      <circle cx="12" cy="19" r="1.8" />
    </svg>
  )
}

function ShareIcon() {
  return (
    <svg className="header_icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M18 8C19.6569 8 21 6.65685 21 5C21 3.34315 19.6569 2 18 2C16.3431 2 15 3.34315 15 5C15 6.65685 16.3431 8 18 8Z" />
      <path d="M6 15C7.65685 15 9 13.6569 9 12C9 10.3431 7.65685 9 6 9C4.34315 9 3 10.3431 3 12C3 13.6569 4.34315 15 6 15Z" />
      <path d="M18 22C19.6569 22 21 20.6569 21 19C21 17.3431 19.6569 16 18 16C16.3431 16 15 17.3431 15 19C15 20.6569 16.3431 22 18 22Z" />
      <path d="M8.58997 13.51L15.42 17.49" />
      <path d="M15.41 6.51001L8.58997 10.49" />
    </svg>
  )
}

function AvatarIcon() {
  return (
    <span className="cpsdetail_avatar_box" aria-hidden="true">
      <img src={peopleIcon} alt="" />
    </span>
  )
}

function CommunityPetStoryDetails() {
  const navigate = useNavigate()
  const { postId } = useParams()
  const location = useLocation()
  const statePost = (location.state as { post?: DetailPost } | null)?.post
  const post = statePost ?? findFallbackPost(postId)
  const content = post.content?.trim() || '함께 나누고 싶은 반려 생활 이야기를 남겼어요.'
  const timeText = post.time ?? post.date ?? '방금 전'
  const visibleComments = petStoryDetailComments.slice(0, post.comments)
  const [likedPostIds, setLikedPostIds] = useState<number[]>(readLikedPostIds)
  const isLiked = likedPostIds.includes(post.id)
  const likeCount = post.likes + (isLiked ? 1 : 0)

  useEffect(() => {
    window.localStorage.setItem(likedPostsStorageKey, JSON.stringify(likedPostIds))
  }, [likedPostIds])

  const toggleLike = () => {
    setLikedPostIds((current) =>
      current.includes(post.id) ? current.filter((id) => id !== post.id) : [...current, post.id],
    )
  }

  return (
    <>
      <PageHeader
        title=""
        leftContent={<BackButton to="/community/petstory" />}
        rightContent={
          <>
            <Button type="button" aria-label="알림" className="community_header_notification">
              <HeaderIcon type="notification" />
            </Button>
            <Button type="button" aria-label="공유">
              <ShareIcon />
            </Button>
          </>
        }
      />

      <main className="page cpsdetail_page">
        <article className="cpsdetail_post">
          <header className="cpsdetail_author_row">
            <AvatarIcon />
            <div className="cpsdetail_author_text">
              <strong>{post.author}</strong>
              <span>{timeText}</span>
            </div>
            <button type="button" className="cpsdetail_more" aria-label="더보기">
              <MoreIcon />
            </button>
          </header>

          <h1>{post.title}</h1>
          <p className="cpsdetail_content">{content}</p>

          {post.image ? (
            <div className="cpsdetail_gallery" aria-label="게시글 사진">
              <img src={post.image} alt={post.title} className="cpsdetail_main_image" />
              <img src={post.image} alt="" className="cpsdetail_side_image" aria-hidden="true" />
            </div>
          ) : null}

          {post.image && post.place ? (
            <button type="button" className="cpsdetail_place_card" onClick={() => navigate('/place')}>
              <span className="cpsdetail_place_pin" aria-hidden="true" />
              <span className="cpsdetail_place_text">
                <strong>{post.place.name}</strong>
                <small>{post.place.address}</small>
              </span>
              <span className="cpsdetail_place_chevron" aria-hidden="true">&gt;</span>
            </button>
          ) : null}

          <div className="cpsdetail_reaction_row">
            <span>{likeCount}명이 공감 했어요</span>
            <button
              type="button"
              aria-label={`좋아요 ${likeCount}`}
              className={`cpsdetail_like_btn${isLiked ? ' active' : ''}`}
              onClick={toggleLike}
            >
              <span aria-hidden="true">♡</span>
              <strong>{likeCount}</strong>
            </button>
          </div>
        </article>

        <section className="cpsdetail_comments" aria-label="댓글">
          {visibleComments.map((comment) => (
            <article key={comment.id} className="cpsdetail_comment">
              <AvatarIcon />
              <div className="cpsdetail_comment_body">
                <div className="cpsdetail_comment_head">
                  <strong>{comment.author}</strong>
                  <button type="button" className="cpsdetail_more" aria-label="댓글 더보기">
                    <MoreIcon />
                  </button>
                </div>
                <p>{comment.text}</p>
                <div className="cpsdetail_comment_actions">
                  <button type="button">좋아요 {comment.likes || ''}</button>
                  <button type="button">답글쓰기{comment.replies ? ` ${comment.replies}` : ''}</button>
                </div>
              </div>
            </article>
          ))}
        </section>

        <CommentInputForm
          className="cpsdetail_comment_form"
          iconButtonClassName="cpsdetail_form_icon"
          inputWrapClassName="cpsdetail_comment_input"
          placeholder="메시지를 입력해 주세요."
          addIcon={addIcon}
          emojiIcon={emojiIcon}
        />
      </main>
    </>
  )
}

export default CommunityPetStoryDetails
