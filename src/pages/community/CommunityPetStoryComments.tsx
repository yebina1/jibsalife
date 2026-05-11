import './CommunityPetStoryComments.css'
import { useState } from 'react'
import { useLocation, useParams } from 'react-router'
import PageHeader from '../../components/PageHeader'
import Title from '../../components/Title'
import BackButton from '../../components/html/BackButton'
import CommentInputForm from '../../components/html/CommentInputForm'
import addIcon from '../../svg/add icon.svg'
import emojiIcon from '../../svg/emoji.svg'
import { MY_PROFILE_IMAGE, MY_PROFILE_NAME } from '../../utils/myProfile'
import { petStoryDetailComments } from './CommunityPetStoryDetailData'

const likedCommentIdsStorageKey = 'jibsalife.community.likedCommentIds'

type DetailComment = (typeof petStoryDetailComments)[number] & {
  time?: string
  parentId?: number
}

type CommentsPageState = {
  replyTo?: {
    author: string
    commentId: number
  }
}

function readLikedCommentIds() {
  if (typeof window === 'undefined') return []

  try {
    const saved = window.localStorage.getItem(likedCommentIdsStorageKey)
    const parsed = saved ? JSON.parse(saved) : []
    return Array.isArray(parsed) ? parsed.filter((id): id is number => typeof id === 'number') : []
  } catch {
    return []
  }
}

function readComments(postId: string | undefined, fallback: DetailComment[]): DetailComment[] {
  if (typeof window === 'undefined' || !postId) return fallback

  try {
    const saved = window.localStorage.getItem(`jibsalife.community.comments.${postId}`)
    return saved ? JSON.parse(saved) : fallback
  } catch {
    return fallback
  }
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

function HeartIcon() {
  return (
    <svg viewBox="0 1.8 24 24" aria-hidden="true">
      <path d="M12 20.2 5.2 13.8a4.55 4.55 0 0 1 6.43-6.43L12 7.74l.37-.37a4.55 4.55 0 1 1 6.43 6.43Z" />
    </svg>
  )
}

function AvatarIcon() {
  return (
    <span className="cpsdetail_avatar_box" aria-hidden="true">
      <img src={MY_PROFILE_IMAGE} alt="" />
    </span>
  )
}

function CommentText({ text }: { text: string }) {
  const parts = text.split(/(@\S+)/g)

  return (
    <>
      {parts.map((part, index) =>
        part.startsWith('@') ? (
          <span key={`${part}-${index}`} className="cpsdetail_mention">
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  )
}

function CommunityPetStoryComments() {
  const { postId } = useParams()
  const location = useLocation()
  const initialReplyTo = (location.state as CommentsPageState | null)?.replyTo ?? null
  const [visibleComments, setVisibleComments] = useState(() => readComments(postId, petStoryDetailComments))
  const [likedCommentIds, setLikedCommentIds] = useState<number[]>(readLikedCommentIds)
  const [replyTo, setReplyTo] = useState<{ author: string; commentId: number } | null>(initialReplyTo)

  const toggleCommentLike = (commentId: number) => {
    const willLike = !likedCommentIds.includes(commentId)
    const nextLikedIds = willLike
      ? [...likedCommentIds, commentId]
      : likedCommentIds.filter((id) => id !== commentId)

    setLikedCommentIds(nextLikedIds)
    window.localStorage.setItem(likedCommentIdsStorageKey, JSON.stringify(nextLikedIds))
    setVisibleComments((current) =>
      current.map((comment) =>
        comment.id === commentId
          ? { ...comment, likes: Math.max((comment.likes ?? 0) + (willLike ? 1 : -1), 0) }
          : comment,
      ),
    )
  }

  const topLevel = visibleComments.filter((comment) => !comment.parentId)
  const repliesMap = visibleComments.reduce<Record<number, DetailComment[]>>((acc, comment) => {
    if (comment.parentId) {
      acc[comment.parentId] = [...(acc[comment.parentId] ?? []), comment]
    }
    return acc
  }, {})

  const addComment = (text: string) => {
    const parentId = replyTo?.commentId
    const nextComments = [
      ...visibleComments,
      {
        id: Date.now(),
        author: MY_PROFILE_NAME,
        text,
        time: '방금 전',
        likes: 0,
        replies: 0,
        parentId,
      },
    ]

    setVisibleComments(nextComments)
    setReplyTo(null)

    if (postId) {
      window.localStorage.setItem(`jibsalife.community.comments.${postId}`, JSON.stringify(nextComments))
    }
  }

  const startReply = (comment: DetailComment) => {
    setReplyTo({ author: comment.author, commentId: comment.parentId ?? comment.id })
  }

  const renderComment = (comment: DetailComment, isReply = false) => {
    const replyCount = repliesMap[comment.id]?.length ?? 0

    return (
      <article key={comment.id} className={`cpsdetail_comment${isReply ? ' cpsdetail_reply' : ''}`}>
        <AvatarIcon />
        <div className="cpsdetail_comment_body">
          <div className="cpsdetail_comment_head">
            <Title as="h5" title={comment.author}>
              <p>{comment.time ?? '11시간 전'}</p>
            </Title>
            <button type="button" className="cpsdetail_more" aria-label="댓글 더보기">
              <MoreIcon />
            </button>
          </div>
          <p>
            <CommentText text={comment.text} />
          </p>
          <div className="cpsdetail_comment_actions">
            <button
              type="button"
              className={likedCommentIds.includes(comment.id) ? 'active' : undefined}
              onClick={() => toggleCommentLike(comment.id)}
            >
              <HeartIcon />
              <span>좋아요 {comment.likes || ''}</span>
            </button>
            <button type="button" onClick={() => startReply(comment)}>
              <i className="bx bx-message-rounded-dots" aria-hidden="true" />
              <span>답글쓰기{replyCount > 0 ? ` ${replyCount}` : ''}</span>
            </button>
          </div>
        </div>
      </article>
    )
  }

  return (
    <>
      <main className="page cpscomments_page">
        <PageHeader title="댓글" leftContent={<BackButton />} />
        <section className="cpsdetail_comments" aria-label="댓글">
          <Title as="h4" className="cpsdetail_comments_title" title={`댓글 ${visibleComments.length}`} />
          {topLevel.map((comment) => (
            <div key={comment.id} className="cpsdetail_comment_group">
              {renderComment(comment)}
              {(repliesMap[comment.id] ?? []).map((reply) => renderComment(reply, true))}
            </div>
          ))}
        </section>
      </main>

      <footer className="cpscomments_footer" aria-label="댓글 작성">
        <CommentInputForm
          className="cpsdetail_comment_form is_visible"
          iconButtonClassName="cpsdetail_form_icon"
          inputWrapClassName="cpsdetail_comment_input"
          placeholder="메시지를 입력해 주세요."
          addIcon={addIcon}
          emojiIcon={emojiIcon}
          replyTo={replyTo?.author ?? null}
          onClearReply={() => setReplyTo(null)}
          onSubmit={addComment}
        />
      </footer>
    </>
  )
}

export default CommunityPetStoryComments
