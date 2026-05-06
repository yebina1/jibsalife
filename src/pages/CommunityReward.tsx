import { useEffect, useState } from 'react'
import Confetti from 'react-confetti'
import { useLocation, useNavigate, useSearchParams } from 'react-router'
import PageHeader from '../components/PageHeader'
import ChevronIcon from '../components/ChevronIcon'
import BackButton from '../components/html/BackButton'
import Button from '../components/html/Button'
import {
  addCompletedChallengeCardId,
  CHALLENGE_REWARD_CLAIMED_STORAGE_KEY,
} from '../constants/points'
import { formatProfilePoints, readProfilePoints, writeProfilePoints } from '../utils/profilePoints'
import pointIcon from '../svg/point.svg'
import './CommunityReward.css'

function CheckIcon() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path
        d="M18 33.5 28 43l18-20"
        fill="none"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function GiftIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4.25" y="9" width="15.5" height="10.75" rx="1.9" />
      <path d="M3.5 8.9h17v3.2h-17z" />
      <path d="M12 8.9v10.85" />
      <path d="M12 8.9H9.1a2.15 2.15 0 1 1 0-4.3c1.67 0 2.9 1.76 2.9 4.3Z" />
      <path d="M12 8.9h2.9a2.15 2.15 0 1 0 0-4.3c-1.67 0-2.9 1.76-2.9 4.3Z" />
    </svg>
  )
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 20.2 5.2 13.8a4.55 4.55 0 0 1 6.43-6.43L12 7.74l.37-.37a4.55 4.55 0 1 1 6.43 6.43Z" />
    </svg>
  )
}

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m12 5.2 1.86 3.78 4.17.6-3.01 2.93.71 4.14L12 14.72l-3.73 1.95.71-4.14-3.01-2.93 4.17-.6Z" />
    </svg>
  )
}

function CommunityReward() {
  const [viewport, setViewport] = useState({ width: 0, height: 0 })
  const [numberOfPieces, setNumberOfPieces] = useState(50)
  const [currentPoints, setCurrentPoints] = useState(() => readProfilePoints())
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const rewardAmount = Number(searchParams.get('amount') ?? '60')
  const isChallengeRewardClaim = rewardAmount === 60
  const rewardEventId =
    typeof location.state === 'object' && location.state && 'rewardEventId' in location.state
      ? String(location.state.rewardEventId)
      : undefined
  const rewardSourceItemId =
    typeof location.state === 'object' && location.state && 'rewardSourceItemId' in location.state
      ? Number(location.state.rewardSourceItemId)
      : undefined

  useEffect(() => {
    const updateViewport = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    updateViewport()
    window.addEventListener('resize', updateViewport)

    const timer = window.setTimeout(() => {
      setNumberOfPieces(0)
    }, 10000)

    return () => {
      window.removeEventListener('resize', updateViewport)
      window.clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    if (!rewardEventId) {
      setCurrentPoints(readProfilePoints())
      return
    }

    const savedAppliedRewardEvents = window.localStorage.getItem('jibsalife.points.appliedRewardEvents')
    const appliedRewardEvents = savedAppliedRewardEvents ? (JSON.parse(savedAppliedRewardEvents) as string[]) : []

    if (appliedRewardEvents.includes(rewardEventId)) {
      setCurrentPoints(readProfilePoints())
      return
    }

    const nextPoints = readProfilePoints() + Math.max(0, rewardAmount)
    writeProfilePoints(nextPoints)
    window.localStorage.setItem(
      'jibsalife.points.appliedRewardEvents',
      JSON.stringify([...appliedRewardEvents, rewardEventId].slice(-30)),
    )
    setCurrentPoints(nextPoints)
  }, [rewardAmount, rewardEventId])

  const goToChallenge = () => {
    if (isChallengeRewardClaim) {
      window.localStorage.setItem(CHALLENGE_REWARD_CLAIMED_STORAGE_KEY, 'true')
    } else if (Number.isFinite(rewardSourceItemId)) {
      addCompletedChallengeCardId(Number(rewardSourceItemId))
    }
    navigate('/community/challenge')
  }

  const goToMyPage = () => navigate('/mypage')

  return (
    <>
      <Confetti
        width={viewport.width}
        height={viewport.height}
        numberOfPieces={numberOfPieces}
        opacity={0.7}
        colors={['#F1C93A', '#9C78F0', '#6FCDF0', '#E57DC3']}
        style={{ pointerEvents: 'none', zIndex: 20, position: 'fixed' }}
      />
      <PageHeader title="포인트 받기" leftContent={<BackButton />} />
      <main className="page community_reward_page">
        <section className="community_reward_hero">
          <div className="community_reward_circle" aria-hidden="true">
            <div className="community_reward_badge">
              <CheckIcon />
            </div>
          </div>

          <h1>
            참여 완료!
            <strong>
              <span>{rewardAmount}P</span>를 받았어요.
            </strong>
          </h1>
        </section>

        <button type="button" className="community_reward_point_card" onClick={goToMyPage}>
          <div className="community_reward_point_icon" aria-hidden="true">
            <img src={pointIcon} alt="" />
          </div>
          <div className="community_reward_point_copy">
            <span>지금까지 모은 포인트</span>
            <strong>{formatProfilePoints(currentPoints)}</strong>
          </div>
          <span className="community_reward_point_arrow" aria-hidden="true">
            <ChevronIcon direction="right" size="sm" />
          </span>
        </button>

        <section className="community_reward_usage">
          <h2>포인트는 이렇게 사용할 수 있어요!</h2>
          <ul>
            <li>
              <span className="community_reward_usage_icon" aria-hidden="true">
                <GiftIcon />
              </span>
              <strong>사료/간식 교환</strong>
            </li>
            <li>
              <span className="community_reward_usage_icon" aria-hidden="true">
                <HeartIcon />
              </span>
              <strong>기부 하기</strong>
            </li>
            <li>
              <span className="community_reward_usage_icon is_star_circle" aria-hidden="true">
                <span className="community_reward_usage_icon_inner">
                  <StarIcon />
                </span>
              </span>
              <strong>특별한 리워드</strong>
            </li>
          </ul>
        </section>

        <div className="community_reward_actions">
          <Button
            type="button"
            buttonVariant="icon"
            className="community_reward_confirm"
            onClick={goToChallenge}
          >
            확인
          </Button>
          <Button type="button" className="white_btn community_reward_secondary" onClick={goToChallenge}>
            더 많은 챌린지 참여하기
          </Button>
        </div>
      </main>
    </>
  )
}

export default CommunityReward
