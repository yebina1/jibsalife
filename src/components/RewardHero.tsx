import './RewardHero.css'

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

type RewardHeroProps = {
  rewardAmount: number
}

function RewardHero({ rewardAmount }: RewardHeroProps) {
  return (
    <section className="community_reward_hero">
      <div className="community_reward_circle" aria-hidden="true">
        <div className="community_reward_badge">
          <CheckIcon />
        </div>
      </div>

      <strong className="community_reward_hero_heading">
        참여 완료!
        <span>
          <span>{rewardAmount} 포인트</span>를 받았어요.
        </span>
      </strong>
    </section>
  )
}

export default RewardHero
