import './PointAlertContent.css'
import ConfettiEffect from './effect/ConfettiEffect'
import RewardHero from './RewardHero'
import RewardPointCard from './RewardPointCard'
import Button from './html/Button'

type PointAlertContentProps = {
  currentPoints: number
  rewardAmount: number
  onRewardCardClick: () => void
  onConfirm: () => void
}

function PointAlertContent({
  currentPoints,
  rewardAmount,
  onRewardCardClick,
  onConfirm,
}: PointAlertContentProps) {
  return (
    <>
      <ConfettiEffect contained />
      <div className="point_alert_content">
        <RewardHero rewardAmount={rewardAmount} />
        <RewardPointCard
          currentPoints={currentPoints}
          rewardAmount={rewardAmount}
          rewardAlreadyApplied
          onClick={onRewardCardClick}
        />
        <Button type="button" className="purple_btn point_alert_confirm" onClick={onConfirm}>
          확인
        </Button>
      </div>
    </>
  )
}

export default PointAlertContent
