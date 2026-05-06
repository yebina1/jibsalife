import { useNavigate } from 'react-router'
import './SubscriptionPage.css'
import subscriptionPetImage from '../img/illust_login_pet.jpg'

const benefits = [
  'AI 심화 분석으로 건강 변화를 더 정확하게 확인',
  '이상 신호 시 전문가 상담 연결 지원',
  '다양한 제휴 할인 혜택 제공',
  '자동 기록 & 알림으로 편리한 관리',
  '프리미엄 투표 참여로 추가 포인트와 보상 제공',
  '프리미엄 뱃지로 특별한 경험',
] as const

function SubscriptionPage() {
  const navigate = useNavigate()

  return (
    <main className="page subscription_page">
      <button
        type="button"
        className="subscription_close"
        aria-label="닫기"
        onClick={() => navigate('/mypage')}
      >
        ×
      </button>

      <section className="subscription_hero" aria-labelledby="subscription_title">
        <h1 id="subscription_title">
          1개월 무료로
          <br />
          더 똑똑한 반려생활 시작
        </h1>
        <p>무료체험 기간 중에는 결제되지 않아요</p>
        <img src={subscriptionPetImage} alt="" aria-hidden="true" />
      </section>

      <section className="subscription_plans" aria-label="구독 플랜 선택">
        <button type="button" className="subscription_plan subscription_plan_active">
          <span className="subscription_plan_check" aria-hidden="true" />
          <span className="subscription_plan_body">
            <span className="subscription_plan_top">
              <strong>연간</strong>
              <b>₩49,800</b>
            </span>
            <span className="subscription_plan_bottom">
              <span>1개월 무료 체험 / 1년마다 결제</span>
              <del>₩58,800</del>
            </span>
          </span>
          <span className="subscription_badge subscription_badge_discount">15% 할인</span>
          <span className="subscription_badge subscription_badge_popular">가장 인기</span>
        </button>

        <button type="button" className="subscription_plan">
          <span className="subscription_plan_check" aria-hidden="true" />
          <span className="subscription_plan_body">
            <span className="subscription_plan_top">
              <strong>월간</strong>
              <b>₩4,900</b>
            </span>
            <span className="subscription_plan_bottom">
              <span>1개월 마다 결제</span>
            </span>
          </span>
        </button>
      </section>

      <ul className="subscription_benefits">
        {benefits.map((benefit) => (
          <li key={benefit}>
            <span aria-hidden="true">✓</span>
            {benefit}
          </li>
        ))}
      </ul>

      <div className="subscription_actions">
        <button type="button">1개월 무료로 시작하기</button>
        <div>
          <a href="#" aria-label="이용약관 및 개인정보처리방침 보기">
            이용약관 및 개인정보처리방침
          </a>
          <a href="#" aria-label="구입 내역 복원하기">
            구입 내역 복원하기
          </a>
        </div>
      </div>
    </main>
  )
}

export default SubscriptionPage
