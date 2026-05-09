import './CommunityKnowledgeDetail.css'
import { useLocation, useNavigate } from 'react-router'
import PageHeader from '../../components/PageHeader'
import knowledge1 from '../../img/knowledge1.png'
import dogWalk1 from '../../img/Knowledge/dog_Walk_1_increased_stress.png'
import dogWalk2 from '../../img/Knowledge/dog_Walk_2_obesity.png'
import dogWalk3 from '../../img/Knowledge/dog_Walk_3_a_lack_of_social_skills.png'
import sharingIcon from '../../svg/sharing.svg'

type KnowledgeDetailState = {
  item?: {
    title: string
    image: string
    viewsText?: string
    likes?: number
    comments?: number
  }
}

const detailItems = [
  {
    id: 1,
    title: '스트레스 증가',
    description:
      '산책은 강아지의 에너지를 해소하고 외부 자극을 통해 심리적 안정감을 주는 중요한 활동이에요. 산책이 부족하면 에너지가 쌓이면서 짖음, 물건 파손, 과도한 흥분 같은 문제 행동으로 이어질 수 있어요.',
    image: dogWalk1,
  },
  {
    id: 2,
    title: '비만 및 건강 문제',
    description:
      '운동량이 부족한 강아지는 체중이 쉽게 증가하고 비만으로 이어질 가능성이 높아요. 비만은 관절 질환, 심장 질환 등 다양한 건강 문제의 원인이 될 수 있어요.',
    image: dogWalk2,
  },
  {
    id: 3,
    title: '사회성 부족',
    description:
      '운동량이 부족한 강아지는 체중이 쉽게 증가하고 비만으로 이어질 가능성이 높아요. 비만은 관절 질환, 심장 질환 등 다양한 건강 문제의 원인이 될 수 있어요.',
    image: dogWalk3,
  },
] as const

function BookmarkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 4.5h10a1.5 1.5 0 0 1 1.5 1.5v13.2l-6.5-3.6-6.5 3.6V6A1.5 1.5 0 0 1 7 4.5Z" />
    </svg>
  )
}

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m15 5-7 7 7 7" />
    </svg>
  )
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 20.2 4.9 13.6a4.8 4.8 0 0 1 6.8-6.8L12 7.9l.3-.3a4.8 4.8 0 1 1 6.8 6.8Z" />
    </svg>
  )
}

function CommentIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 4.8c-4.4 0-8 2.9-8 6.6 0 2.1 1.2 4 3.1 5.2l-.8 3 3.3-1.8c.8.2 1.6.3 2.4.3 4.4 0 8-2.9 8-6.7s-3.6-6.6-8-6.6Z" />
    </svg>
  )
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function ShareIcon() {
  return <img src={sharingIcon} alt="" aria-hidden="true" />
}

function CommunityKnowledgeDetail() {
  const navigate = useNavigate()
  const location = useLocation()
  const item = (location.state as KnowledgeDetailState | null)?.item
  const detailTitle = item?.title ?? '강아지 산책 안 하면 생기는 문제점'
  const detailTitleLines =
    detailTitle === '강아지 산책 안 하면 생기는 문제점'
      ? ['강아지 산책', '안 하면 생기는 문제점']
      : [detailTitle]

  return (
    <main className="page community_knowledge_detail_page">
      <PageHeader
        title=""
        leftContent={
          <button
            type="button"
            className="community_knowledge_detail_header_btn"
            aria-label="이전"
            onClick={() => navigate(-1)}
          >
            <BackIcon />
          </button>
        }
        rightContent={
          <button
            type="button"
            className="community_knowledge_detail_header_btn"
            aria-label="북마크"
          >
            <BookmarkIcon />
          </button>
        }
      />
      <section className="community_knowledge_detail_hero_wrap">
        <img
          className="community_knowledge_detail_hero"
          src={item?.image ?? knowledge1}
          alt={detailTitle}
        />
      </section>

      <section className="community_knowledge_detail_content">
        <h1>
          {detailTitleLines.map((line, index) => (
            <span key={line}>
              {index > 0 ? <br /> : null}
              {line}
            </span>
          ))}
        </h1>

        <div className="community_knowledge_detail_meta">
          <span>
            <EyeIcon />
            {item?.viewsText ?? '1.2k'}
          </span>
          <span className="community_knowledge_detail_dot" aria-hidden="true">·</span>
          <span>05.02 게시됨</span>
          <button type="button">
            <ShareIcon />
            공유하기
          </button>
        </div>

        <p className="community_knowledge_detail_intro">
          산책은 강아지의 신체 건강뿐만 아니라
          <br />
          정서 건강에도 매우 중요한 영향을 줍니다.
          <br />
          산책이 부족하면 다양한 문제가 생길 수 있어요.
        </p>

        <div className="community_knowledge_detail_cards">
          {detailItems.map((item) => (
            <article key={item.id} className="community_knowledge_detail_card">
              <div className="community_knowledge_detail_card_icon" aria-hidden="true">
                <img src={item.image} alt="" />
              </div>
              <div className="community_knowledge_detail_card_copy">
                <h2>
                  <span className="community_knowledge_detail_card_badge">{item.id}</span>
                  {item.title}
                </h2>
                <p>{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <div className="community_knowledge_detail_actions">
        <div className="community_knowledge_detail_reactions">
          <button type="button" aria-label="좋아요">
            <HeartIcon />
            {item?.likes ?? 128}
          </button>
          <button type="button" aria-label="댓글">
            <CommentIcon />
            {item?.comments ?? 36}
          </button>
        </div>
        <button
          type="button"
          className="community_knowledge_detail_cta"
          onClick={() => navigate('/community/petstory')}
        >
          관련 제품 보기
        </button>
      </div>
    </main>
  )
}

export default CommunityKnowledgeDetail
