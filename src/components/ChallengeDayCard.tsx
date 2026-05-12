import { forwardRef, type ReactNode } from 'react'
import { Lock } from 'lucide-react'
import './ChallengeDayCard.css'
import stampImg from '../img/challenge/stamp.png'

type ChallengeStatus = 'completed' | 'current' | 'locked'

type ChallengeDayCardProps = {
  day: number
  image?: string
  description: ReactNode
  status: ChallengeStatus
}

const ChallengeDayCard = forwardRef<HTMLDivElement, ChallengeDayCardProps>(
function ChallengeDayCard({ day, image, description, status }, ref) {
  return (
    <div ref={ref} className={`cdc_card${status === 'current' ? ' cdc_card_current' : ''}${status === 'completed' ? ' cdc_card_completed' : ''}`}>
      <span className="cdc_day">Day {day}</span>
      <div className="cdc_img_wrapper">
        {image && <img src={image} alt="" className="cdc_img" />}
        {status === 'locked' && (
          <div className="cdc_lock_wrapper">
            <Lock size={32} />
          </div>
        )}
      </div>
      <p className="p_regular cdc_desc">{description}</p>
      {status === 'completed' && (
        <img src={stampImg} alt="완료" className="cdc_stamp" />
      )}
    </div>
  )
})

export default ChallengeDayCard
