import './Community.css'
import './CommunityChallenge.css'
import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import PageHeader from '../../components/PageHeader'
import HeaderIcon from '../../components/HeaderIcon'
import Button from '../../components/html/Button'
import challenge1Image from '../../img/challenge1.jpg'
import challenge2Image from '../../img/challenge2.png'
import challenge3Image from '../../img/challenge3.png'
import challenge4Image from '../../img/challenge4.png'
import challenge5Image from '../../img/challenge5.png'
import challenge6Image from '../../img/challenge6.png'
import challengeHeadingImage from '../../img/illust_login_pet.jpg'
import {
  CHALLENGE_REWARD_CLAIMED_STORAGE_KEY,
  getCompletedChallengeCardIds,
} from '../../constants/points'

const topTabs = ['전체', '커뮤니티', '챌린지 인증', '투표'] as const
const topTabLabels = ['전체', '커뮤니티', '챌린지', '투표'] as const
const communityRouteByTopTab: Record<(typeof topTabs)[number], string> = {
  전체: '/community/overview',
  커뮤니티: '/community/petstory',
  '챌린지 인증': '/community/challenge',
  투표: '/community/vote',
}

const challengeItems = [
  {
    id: 1,
    title: '오늘의 미션',
    description: '밥 먹는 사진 중 BEST를 골라주세요!',
    date: '2026.04.30',
    participants: 8,
  },
  {
    id: 2,
    title: '산책 인증 챌린지',
    description: '우리아이 즐겁게 산책하는 순간을 자랑해보세요',
    date: '2026.04.30',
    participants: 8,
  },
  {
    id: 3,
    title: '비포 애프터 콘텐츠',
    description: '우리아이 미용 전과 후 사진을 올려주세요',
    date: '2026.04.30',
    participants: 8,
  },
  {
    id: 4,
    title: '코앞샷 챌린지',
    description: '우리아이 잠든 모습 자랑해보세요',
    date: '2026.04.30',
    participants: 8,
  },
] as const

export const challengeCardItems = [
  {
    id: 1,
    title: '제일 귀엽게 밥을 먹는 귀염둥이는?',
    participants: 22,
    deadline: '05.10 마감',
    image: challenge1Image,
    status: 'active',
  },
  {
    id: 2,
    title: '가장 말썽꾸러기 같은 아이는?',
    participants: 17,
    deadline: '05.10 마감',
    image: challenge2Image,
    status: 'active',
  },
  {
    id: 3,
    title: '제일 웃는 얼굴이 예쁜 아이는?',
    participants: 31,
    deadline: '05.10 마감',
    image: challenge3Image,
    status: 'active',
  },
  {
    id: 4,
    title: '제일 호기심 많아 보이는 아이는?',
    participants: 14,
    deadline: '05.10 마감',
    image: challenge4Image,
    status: 'active',
  },
  {
    id: 5,
    title: '제일 반갑게 맞아주는 아이는?',
    participants: 26,
    deadline: '05.10 마감',
    image: challenge5Image,
    status: 'active',
  },
  {
    id: 6,
    title: '하루 종일 뛰어놀 것 같은 아이는?',
    participants: 19,
    deadline: '05.10 마감',
    image: challenge6Image,
    status: 'complete',
  },
] as const

function CommunityChallenge() {
  const navigate = useNavigate()
  const location = useLocation()

  const [selectedChallengeId, setSelectedChallengeId] = useState<number | null>(null)
  const [isChallengeRewardClaimed, setIsChallengeRewardClaimed] = useState(false)
  const [completedChallengeCardIds, setCompletedChallengeCardIds] = useState<number[]>([])

  useEffect(() => {
    if (typeof window === 'undefined') return
    setIsChallengeRewardClaimed(window.localStorage.getItem(CHALLENGE_REWARD_CLAIMED_STORAGE_KEY) === 'true')
    setCompletedChallengeCardIds(getCompletedChallengeCardIds())
  }, [location.key])

  const sortedChallengeCardItems = useMemo(() => {
    const activeItems = challengeCardItems.filter(
      (item) => item.status !== 'complete' && !completedChallengeCardIds.includes(item.id),
    )
    const completeItems = challengeCardItems.filter(
      (item) => item.status === 'complete' || completedChallengeCardIds.includes(item.id),
    )
    return [...activeItems, ...completeItems]
  }, [completedChallengeCardIds])

  const challengeCompletedCount = useMemo(
    () =>
      challengeCardItems.filter(
        (item) => item.status === 'complete' || completedChallengeCardIds.includes(item.id),
      ).length,
    [completedChallengeCardIds],
  )

  const challengeProgressPercent = Math.round((challengeCompletedCount / challengeCardItems.length) * 100)
  const isChallengeRewardAvailable = challengeProgressPercent === 100
  const isChallengeRewardButtonDisabled = isChallengeRewardClaimed || !isChallengeRewardAvailable
  const selectedChallenge = challengeItems.find((item) => item.id === selectedChallengeId) ?? null

  return (
    <>
      <PageHeader
        title="집사인생"
        rightContent={
          <>
            <Button type="button" aria-label="검색" className="community_header_search">
              <HeaderIcon type="search" />
            </Button>
            <Button type="button" aria-label="calendar" onClick={() => navigate('/mission')}>
              <HeaderIcon type="calendar" />
            </Button>
            <Button type="button" aria-label="notification">
              <HeaderIcon type="notification" />
            </Button>
          </>
        }
      />

      <main className="page community_page community_page_challenge">
        <section className="community_tab_bar" aria-label="커뮤니티 상위 카테고리">
          {topTabs.map((tab, index) => (
            <button
              key={tab}
              type="button"
              className={tab === '챌린지 인증' ? 'active' : ''}
              onClick={() => navigate(communityRouteByTopTab[tab])}
            >
              {topTabLabels[index]}
            </button>
          ))}
        </section>

        <section className="community_challenge_screen">
          <section className="community_challenge_redesign">
            <article className="community_challenge_feature_card">
              <div className="community_challenge_feature_copy content_section_copy">
                <h2>이번주 특별 챌린지</h2>
                <p>이번 주 미션 참여하고, 특별한 보상을 받아보세요.</p>
              </div>
              <div className="community_challenge_feature_progress">
                <div
                  className="community_challenge_feature_ring"
                  style={{
                    background: `conic-gradient(#6d59f8 0 ${challengeProgressPercent}%, #d8e6f2 ${challengeProgressPercent}% 100%)`,
                  }}
                >
                  <div className="community_challenge_feature_ring_inner">
                    <span>진행률</span>
                    <strong>{challengeProgressPercent}%</strong>
                  </div>
                </div>
              </div>
              <Button
                type="button"
                className={['purple_btn', 'square_btn', 'community_challenge_reward_button'].join(' ')}
                disabled={isChallengeRewardButtonDisabled}
                onClick={() => {
                  if (isChallengeRewardButtonDisabled) return
                  navigate('/community/challenge/reward?amount=60', {
                    state: { rewardEventId: `community-challenge-main-${Date.now()}` },
                  })
                }}
              >
                {isChallengeRewardClaimed ? '포인트 받기 완료' : '60포인트 받기'}
              </Button>
            </article>

            <section className="content_section community_challenge_list_section">
              <div className="content_section_header community_challenge_heading">
                <div className="content_section_copy">
                  <h2>챌린지 목록</h2>
                  <p>미션을 완료할수록 더 많은 포인트를 드려요.</p>
                </div>
                <img src={challengeHeadingImage} alt="" />
              </div>

              <div className="community_challenge_cards">
                {sortedChallengeCardItems.map((item) => {
                  const isJoined = selectedChallengeId === item.id
                  const isComplete = item.status === 'complete' || completedChallengeCardIds.includes(item.id)

                  return (
                    <article key={item.id} className="community_challenge_card">
                      <img src={item.image} alt={item.title} className="community_challenge_card_image" />
                      <div className="community_challenge_card_body">
                        <h3>{item.title}</h3>
                        <div className="community_challenge_card_meta">
                          <span>
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                              <circle cx="8.5" cy="9" r="2.5" />
                              <circle cx="15.5" cy="9.5" r="3" />
                              <path d="M3.5 18.5c0-2.4 2.2-4.3 5-4.3 1.3 0 2.4.4 3.3 1.1" />
                              <path d="M10.5 18.5c0-2.7 2.3-4.8 5.1-4.8s4.9 2.1 4.9 4.8" />
                            </svg>
                            {item.participants}명
                          </span>
                          <span>
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                              <rect x="3.5" y="4.5" width="17" height="16" rx="2.5" />
                              <path d="M8 2.8v3.8" />
                              <path d="M16 2.8v3.8" />
                              <path d="M3.5 8.5h17" />
                            </svg>
                            {item.deadline}
                          </span>
                        </div>
                        <Button
                          type="button"
                          buttonVariant="challenge"
                          className={[
                            'community_challenge_card_button',
                            isComplete ? 'is_complete' : item.status === 'active' || isJoined ? 'is_filled' : null,
                          ]
                            .filter(Boolean)
                            .join(' ')}
                          disabled={isComplete}
                          onClick={() => {
                            if (!isComplete) {
                              navigate('/community/challenge/reward?amount=10', {
                                state: {
                                  rewardEventId: `community-challenge-card-${item.id}-${Date.now()}`,
                                  rewardSourceItemId: item.id,
                                },
                              })
                            }
                          }}
                        >
                          {isComplete ? '참여완료' : '참여하기'}
                        </Button>
                      </div>
                    </article>
                  )
                })}
              </div>
            </section>
          </section>

          <article className="community_challenge_summary_card">
            <h3>이번주 특별 상금 챌린지</h3>
            <div className="community_challenge_summary_progress">
              <div className="community_challenge_summary_fill" />
              <span>30% 달성</span>
            </div>
            <strong>60</strong>
            <button type="button">특별 포인트 받기</button>
          </article>

          <div className="community_challenge_section_title">
            <h2>챌린지</h2>
          </div>

          {selectedChallenge ? (
            <article className="community_challenge_join_detail">
              <button
                type="button"
                className="community_detail_back_button"
                onClick={() => setSelectedChallengeId(null)}
              >
                이전
              </button>
              <div className="community_challenge_join_copy">
                <h3>{selectedChallenge.title}</h3>
                <p>{selectedChallenge.description}</p>
                <span>{selectedChallenge.date}</span>
                <strong>참여자 수 {selectedChallenge.participants}</strong>
              </div>
              <button type="button" className="community_challenge_upload_cta">
                사진 업로드하기
              </button>
            </article>
          ) : (
            <div className="community_challenge_simple_list">
              {challengeItems.map((item) => (
                <article key={item.id} className="community_challenge_simple_item">
                  <div className="community_challenge_simple_copy">
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <span>{item.date}</span>
                    <strong>참여자 수 {item.participants}</strong>
                  </div>
                  <button
                    type="button"
                    className="community_challenge_simple_join"
                    onClick={() => setSelectedChallengeId(item.id)}
                  >
                    참여하기
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  )
}

export default CommunityChallenge
