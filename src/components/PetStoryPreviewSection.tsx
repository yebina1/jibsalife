import '../pages/community/CommunityPetStory.css'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import Title from './Title'
import { dailyPosts } from '../pages/community/CommunityPetStory'
import commentIcon from '../svg/nav communicate.svg'
import sharingIcon from '../svg/sharing.svg'

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 20.2 5.2 13.8a4.55 4.55 0 0 1 6.43-6.43L12 7.74l.37-.37a4.55 4.55 0 1 1 6.43 6.43Z" />
    </svg>
  )
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

function PetStoryPreviewSection() {
  const navigate = useNavigate()
  const [nowTime] = useState(() => Date.now())

  const latestPosts = [...dailyPosts]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4)

  const handleClick = (post: (typeof dailyPosts)[number]) => {
    navigate(`/community/petstory/detail/${post.id}`, {
      state: {
        post: {
          id: post.id,
          tag: post.tag,
          title: post.title,
          author: post.author,
          time: getRelativeTimeText(post.createdAt, nowTime),
          image: post.image,
          likes: post.likes,
          comments: post.comments,
          shares: 10,
          createdAt: post.createdAt,
        },
      },
    })
  }

  return (
    <div>
      {latestPosts.map((post) => (
        <article
          key={post.id}
          className={`cpsd_item${post.image == null ? ' cpsd_item_featured' : ''}`}
          onClick={() => handleClick(post)}
        >
          {post.image != null && (
            <img src={post.image} alt="" className="cpsd_thumb" />
          )}
          <Title
            as="h5"
            className="cpsd_body"
            headingClassName="cpsd_title"
            title={
              <>
                <span className="community_post_tag">{post.tag}</span>
                <span className="cpsd_title_text">{post.title}</span>
              </>
            }
          >
            <div className="cpsd_meta">
              <p className="cpsd_author">{post.author}</p>
              <span className="cpsd_meta_divider" aria-hidden="true">|</span>
              <p className="cpsd_time">{getRelativeTimeText(post.createdAt, nowTime)}</p>
            </div>
            <div className="cpsd_actions">
              <div className="cpsd_like_stat">
                <span className="cpsd_action_icon"><HeartIcon /></span>
                <span>{post.likes}</span>
              </div>
              <div className="cpsd_comment_stat">
                <span className="cpsd_action_icon"><img src={commentIcon} alt="" aria-hidden="true" /></span>
                <span>{post.comments}</span>
              </div>
              <div className="cpsd_share_stat">
                <span className="cpsd_action_icon"><img src={sharingIcon} alt="" aria-hidden="true" /></span>
                <span>10</span>
              </div>
            </div>
          </Title>
        </article>
      ))}
    </div>
  )
}

export default PetStoryPreviewSection
