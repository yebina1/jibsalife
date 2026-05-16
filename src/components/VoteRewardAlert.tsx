import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import Alert from './Alert'
import RewardHero from './RewardHero'
import RewardPointCard from './RewardPointCard'
import { readProfilePoints, writeProfilePoints } from '../utils/profilePoints'
import './VoteRewardAlert.css'

type Props = {
  rewardAmount: number
  onClose: () => void
}

function VoteRewardAlert({ rewardAmount, onClose }: Props) {
  const navigate = useNavigate()
  const [currentPoints] = useState(() => readProfilePoints())

  useEffect(() => {
    writeProfilePoints(currentPoints + rewardAmount)
  }, [])

  return (
    <Alert dialogClassName="vra_dialog" onClose={onClose}>
      <div className="vra_content">
        <span className="vra_confetti c1" />
        <span className="vra_confetti c2" />
        <span className="vra_confetti c3" />
        <span className="vra_confetti c4" />
        <span className="vra_confetti c5" />
        <span className="vra_confetti c6" />
        <span className="vra_confetti c7" />
        <span className="vra_confetti c8" />
        <RewardHero rewardAmount={rewardAmount} />
        <RewardPointCard
          currentPoints={currentPoints}
          rewardAmount={rewardAmount}
          onClick={() => { onClose(); navigate('/mypage') }}
        />
        <button type="button" className="purple_btn vra_confirm_btn" onClick={onClose}>
          확인
        </button>
      </div>
    </Alert>
  )
}

export default VoteRewardAlert
