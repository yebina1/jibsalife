import Title from './Title'
import bannerImage from '../img/2026_05_3_weeks_dog_star_vote.png'
import timerIcon from '../svg/timer.svg'
import './VoteMissionBanner.css'

type VoteMissionBannerProps = {
  timeText?: string
  title?: React.ReactNode
  description?: string
  backgroundColor?: string
}

function VoteMissionBanner({
  timeText = '7시간 남음',
  title = (
    <>
      5월 3주차
      <br />
      멍스타 미션 투표
    </>
  ),
  description = '밥 먹는 사진 중 BEST를 골라주세요!',
  backgroundColor,
}: VoteMissionBannerProps) {
  return (
    <section className="vote_mission_banner" style={backgroundColor ? { backgroundColor } : undefined}>
      <Title
        as="h2"
        className="vote_mission_banner_title"
        beforeTitle={
          <span className="vote_mission_banner_timer">
            <img src={timerIcon} alt="" aria-hidden="true" />
            {timeText}
          </span>
        }
        title={title}
      >
        <p>{description}</p>
      </Title>
      <img className="vote_mission_banner_img" src={bannerImage} alt="" aria-hidden="true" />
    </section>
  )
}

export default VoteMissionBanner
