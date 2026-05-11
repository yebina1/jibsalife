import Title from './Title'
import './RewardPointCard.css'
import ChevronIcon from './ChevronIcon'
import { formatProfilePoints } from '../utils/profilePoints'
import pointIcon from '../svg/point.svg'

type RewardPointCardProps = {
  currentPoints: number
  rewardAmount: number
  onClick: () => void
}

function RewardPointCard({ currentPoints, rewardAmount, onClick }: RewardPointCardProps) {
  return (
    <button type="button" className="community_reward_point_card" onClick={onClick}>
      <div className="community_reward_point_icon" aria-hidden="true">
        <img src={pointIcon} alt="" />
      </div>
      <Title
        as="h3"
        className="community_reward_point_copy"
        beforeTitle={<span className="p_regular">지금까지 모은 포인트</span>}
        title={formatProfilePoints(currentPoints + Math.max(0, rewardAmount))}
      />
      <span className="community_reward_point_arrow" aria-hidden="true">
        <ChevronIcon direction="right" size="sm" />
      </span>
    </button>
  )
}

export default RewardPointCard
