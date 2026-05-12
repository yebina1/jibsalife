import './Community.css'
import './CommunityVoteResult.css'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import PageHeader from '../../components/PageHeader'
import BackButton from '../../components/html/BackButton'
import Alert from '../../components/Alert'

import Button from '../../components/html/Button'
import ChevronIcon from '../../components/ChevronIcon'
import ConfettiEffect from '../../components/effect/ConfettiEffect'
import RewardHero from '../../components/RewardHero'
import RewardPointCard from '../../components/RewardPointCard'
import {
  COMMUNITY_VOTE_REWARD_POINTS,
  readCommunityVoteRewardClaimed,
  readProfilePoints,
  writeCommunityVoteRewardClaimed,
  writeProfilePoints,
} from '../../utils/profilePoints'
import crownIcon from '../../svg/crown.svg'
import instaIcon from '../../svg/Instagram icon.svg'
import voting1 from '../../img/voting/voting1.jpg'
import voting2 from '../../img/voting/voting2.jpg'
import voting3 from '../../img/voting/voting3.jpg'
import voting4 from '../../img/voting/voting4.jpg'
import voting5 from '../../img/voting/voting5.jpg'
import voting6 from '../../img/voting/voting6.jpg'

const top2Rankings = [
  { rank: 2, name: '콩냥이', image: voting2, votes: 842, percentage: 26.1 },
  { rank: 3, name: '모카', image: voting3, votes: 615, percentage: 19.1 },
]

const otherRankings = [
  { rank: 4, image: voting4, name: '초코' },
  { rank: 5, image: voting5, name: '망고' },
  { rank: 6, image: voting6, name: '보리' },
]

function CommunityVoteResult() {
  const navigate = useNavigate()
  const [isCompleteAlertOpen, setIsCompleteAlertOpen] = useState(false)
  const [profilePoints, setProfilePoints] = useState(() => readProfilePoints())
  const [isRewardClaimed, setIsRewardClaimed] = useState(() => readCommunityVoteRewardClaimed())

  useEffect(() => {
    setProfilePoints(readProfilePoints())
    setIsRewardClaimed(readCommunityVoteRewardClaimed())
  }, [])

  const handleRewardClick = () => {
    if (isRewardClaimed) return

    setIsCompleteAlertOpen(true)
  }

  const confirmReward = () => {
    if (isRewardClaimed) {
      setIsCompleteAlertOpen(false)
      return
    }

    const nextPoints = profilePoints + COMMUNITY_VOTE_REWARD_POINTS
    writeProfilePoints(nextPoints)
    writeCommunityVoteRewardClaimed()
    setProfilePoints(nextPoints)
    setIsRewardClaimed(true)
    setIsCompleteAlertOpen(false)
  }

  return (
    <div className="cv_wrap">
      <PageHeader
        title="투표결과"
        leftContent={<BackButton />}
      />
      {/* 제목 */}
      <div className="cv_header">
        <h2 className="cv_title">
          밥 먹는 사진 중
          <br /><span className="cv_title_highlight">BEST 10</span> 결과 발표
        </h2>
        <p className="cv_subtitle">당첨자는 한 달 후 포인트 지금 안내가 개별 전달됩니다.</p>
      </div>

      {/* 1위 카드 */}
      <div className="cv_first_card">
        <span className="cv_sparkle cv_sparkle_tl" aria-hidden="true" />
        <span className="cv_sparkle cv_sparkle_tr" aria-hidden="true" />
        <span className="cv_sparkle cv_sparkle_bl" aria-hidden="true" />
        <span className="cv_sparkle cv_sparkle_br" aria-hidden="true" />

        <div className="cv_first_crown_row">
          <img src={crownIcon} alt="" className="cv_crown_icon" />
          <span className="cv_best_badge">BEST 1</span>
        </div>

        <p className="cv_first_name">1위: 콩이</p>

        <div className="cv_first_stats_row">
          <span className="cv_first_votes">득표수 <strong>1,248표</strong></span>
          <span className="cv_first_percent">(38.7%)</span>
        </div>

        <div className="cv_progress_bar">
          <div className="cv_progress_fill" style={{ width: '38.7%' }} />
        </div>
      </div>

      {/* 1위 원형 이미지 */}
      <div className="cv_first_image_wrap">
        <img src={voting1} alt="1위 쿵이" className="cv_first_image" />
      </div>

      {/* 인스타 버튼 */}
      <Button type="button" className="white_btn cv_insta_btn">
        <img src={instaIcon} alt="" className="cv_insta_icon" />
        @insta_wlqtk
        <svg className="cv_chevron" viewBox="0 0 8 14" fill="none" aria-hidden="true">
          <path d="M1 1l6 6-6 6" stroke="#555" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </Button>

      {/* 2위, 3위 */}
      <div className="cv_rankings">
        {top2Rankings.map((item) => (
          <div key={item.rank} className="cv_rank_item">
            <div className="cv_rank_image_wrap">
              <img src={item.image} alt={`${item.rank}위 ${item.name}`} className="cv_rank_image" />
              <span className="cv_rank_num">{item.rank}</span>
            </div>
            <div className="cv_rank_body">
              <div className="cv_rank_name_row">
                <span className="cv_rank_name">
                  {item.rank}위 {item.name}
                </span>
                <img src={instaIcon} alt="" className="cv_rank_insta_icon" />
              </div>
              <div className="cv_rank_stats_row">
                <span className="cv_rank_votes">득표수 <strong>{item.votes.toLocaleString()}표</strong></span>
                <span className="cv_rank_percent">({item.percentage}%)</span>
              </div>
              <div className="cv_progress_bar">
                <div className="cv_progress_fill" style={{ width: `${item.percentage}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 기타 순위 */}
      <div className="cv_others">
        <div className="cv_others_header">
          <span className="cv_others_title">기타 순위 (4위~10위)</span>
          <button type="button" className="cv_others_more" disabled>
            모두 보기
            <ChevronIcon direction="right" size="sm" />
          </button>
        </div>
        <div className="cv_others_list">
          {otherRankings.map((item) => (
            <div key={item.rank} className="cv_others_item">
              <img src={item.image} alt={`${item.rank}위 ${item.name}`} className="cv_others_image" />
              <span className="cv_others_label">{item.rank}위 {item.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="cv_btn_wrap">
        <Button
          type="button"
          className="purple_btn"
          onClick={handleRewardClick}
          disabled={isRewardClaimed}
        >
          공유하고 포인트 받기
        </Button>
      </div>

      {isCompleteAlertOpen ? (
        <Alert onClose={() => setIsCompleteAlertOpen(false)}>
          <ConfettiEffect contained />
          <div className="cvd_reward_alert">
            <RewardHero rewardAmount={COMMUNITY_VOTE_REWARD_POINTS} />
            <RewardPointCard
              currentPoints={profilePoints}
              rewardAmount={COMMUNITY_VOTE_REWARD_POINTS}
              onClick={() => navigate('/mypage')}
            />
            <Button type="button" className="purple_btn cvd_reward_confirm" onClick={confirmReward}>
              확인
            </Button>
          </div>
        </Alert>
      ) : null}
    </div>
  )
}

export default CommunityVoteResult
