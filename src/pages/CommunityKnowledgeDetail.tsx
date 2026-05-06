import './CommunityKnowledgeDetail.css'
import { useNavigate } from 'react-router'
import PageHeader from '../components/PageHeader'
import Button from '../components/html/Button'
import BackButton from '../components/html/BackButton'
import contents2 from '../img/contents2.png'

const detailItems = [
  {
    id: 1,
    title: '스트레스 증가',
    description:
      '산책이 부족하면 에너지를 풀지 못해 짖음, 물건 훼손, 예민한 반응처럼 일상 행동 문제로 이어질 수 있어요.',
    emoji: '🐾',
  },
  {
    id: 2,
    title: '체중과 건강 관리',
    description:
      '규칙적으로 움직이지 않으면 체중이 쉽게 늘고 관절이나 심폐 건강에도 부담이 쌓일 수 있어요.',
    emoji: '🏥',
  },
  {
    id: 3,
    title: '사회성 저하',
    description:
      '바깥 자극을 충분히 경험하지 못하면 낯선 사람, 소리, 환경에 대한 적응력이 떨어질 수 있어요.',
    emoji: '🌿',
  },
] as const

function BookmarkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 4.5h10a1.5 1.5 0 0 1 1.5 1.5v13.2l-6.5-3.6-6.5 3.6V6A1.5 1.5 0 0 1 7 4.5Z" />
    </svg>
  )
}

function CommunityKnowledgeDetail() {
  const navigate = useNavigate()

  return (
    <>
      <PageHeader
        title=""
        leftContent={<BackButton />}
        rightContent={
          <Button type="button" aria-label="북마크" className="community_knowledge_detail_bookmark">
            <BookmarkIcon />
          </Button>
        }
      />

      <main className="page community_knowledge_detail_page">
        <img
          className="community_knowledge_detail_hero"
          src={contents2}
          alt="강아지 산책이 부족할 때 생길 수 있는 문제"
        />

        <section className="community_knowledge_detail_content">
          <h1>
            강아지 산책이 부족하면
            <br />
            생길 수 있는 문제들
          </h1>

          <div className="community_knowledge_detail_meta">
            <span>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              1.2k
            </span>
            <span>2026.05.02 게시</span>
            <button type="button">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="18" cy="5.5" r="2" />
                <circle cx="6" cy="12" r="2" />
                <circle cx="18" cy="18.5" r="2" />
                <path d="M7.8 11.1 16 6.4" />
                <path d="m7.8 12.9 8.2 4.7" />
              </svg>
              공유하기
            </button>
          </div>

          <p className="community_knowledge_detail_intro">
            산책은 강아지의 체력 관리뿐 아니라 정서 안정에도 중요한 일상 루틴이에요.
            <br />
            충분히 움직이지 못하면 작은 불편이 행동 문제로 이어질 수 있어요.
          </p>

          <div className="community_knowledge_detail_cards">
            {detailItems.map((item, index) => (
              <article key={item.id} className="community_knowledge_detail_card">
                <div className="community_knowledge_detail_card_badge">{index + 1}</div>
                <div className="community_knowledge_detail_card_icon" aria-hidden="true">
                  <span>{item.emoji}</span>
                </div>
                <div className="community_knowledge_detail_card_copy">
                  <h2>{item.title}</h2>
                  <p>{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="community_knowledge_detail_actions">
          <div className="community_knowledge_detail_reactions">
            <button type="button" aria-label="좋아요">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 20.2 4.9 13.6a4.8 4.8 0 0 1 6.8-6.8L12 7.9l.3-.3a4.8 4.8 0 1 1 6.8 6.8Z" />
              </svg>
              128
            </button>
            <button type="button" aria-label="댓글">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 4.8c-4.4 0-8 2.9-8 6.6 0 2.1 1.2 4 3.1 5.2l-.8 3 3.3-1.8c.8.2 1.6.3 2.4.3 4.4 0 8-2.9 8-6.7s-3.6-6.6-8-6.6Z" />
              </svg>
              36
            </button>
          </div>
          <button
            type="button"
            className="community_knowledge_detail_cta"
            onClick={() => navigate('/mission')}
          >
            관련 미션 보기
          </button>
        </div>
      </main>
    </>
  )
}

export default CommunityKnowledgeDetail
