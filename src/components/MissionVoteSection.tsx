import '../pages/community/CommunityVote.css'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import Title from './Title'
import HeaderIcon from './HeaderIcon'
import crownIcon from '../svg/crown.svg'
import timerIcon from '../svg/timer.svg'
import timerClosedIcon from '../svg/timer_closed.svg'
import { missionVotes } from '../pages/community/CommunityVoteData'
import { readVotedMissionIds } from '../utils/communityVoteStatus'

function MissionVoteSection() {
  const navigate = useNavigate()
  const [votedIds] = useState(() => readVotedMissionIds())
  const activeMissionVotes = missionVotes.filter((v) => v.buttonType !== 'result')

  const openMissionVote = (voteId: string) => {
    navigate(`/community/vote/detail?voteId=${voteId}`)
  }

  return (
    <div className="cv2_mission_cards">
      <Title
        as="h4"
        className="cv2_section_title"
        beforeTitle={<img src={crownIcon} alt="" className="cv2_crown" aria-hidden="true" />}
        title={missionVotes[0].sectionTitle}
      />
      {activeMissionVotes.map((vote) => (
        <div key={vote.id} className="cv2_mission_card">
          <Title
            as="h5"
            className="cv2_mission_card_body"
            beforeTitle={
              <span className={`cv2_timer ${vote.buttonType === 'notify' ? 'cv2_timer_closed' : 'cv2_timer_active'}`}>
                <img src={vote.buttonType === 'notify' ? timerClosedIcon : timerIcon} alt="" aria-hidden="true" />
                {vote.timeText}
              </span>
            }
            title={vote.title}
          >
            <p>
              {vote.organizer} <span className="cv2_divider">|</span>{' '}
              {vote.subText ?? `참여자 수 ${vote.participants}명`}
            </p>
          </Title>
          {vote.buttonType === 'notify' ? (
            <button type="button" className="cv2_outline_btn">
              <HeaderIcon type="notification" size={20} />
              알림받기
            </button>
          ) : (
            <button
              type="button"
              className={votedIds.includes(vote.id) ? 'cv2_outline_btn' : 'cv2_vote_btn'}
              onClick={() => openMissionVote(vote.id)}
            >
              {votedIds.includes(vote.id) ? '수정하기' : '투표하기'}
            </button>
          )}
        </div>
      ))}
    </div>
  )
}

export default MissionVoteSection
