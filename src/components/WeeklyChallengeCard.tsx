import { useEffect, useState } from 'react'
import Title from './Title'
import Button from './html/Button'
import './WeeklyChallengeCard.css'
import challengeImg from '../img/challenge/challenge_3.png'

function getTimeUntilMidnight() {
  const now = new Date()
  const midnight = new Date()
  midnight.setHours(24, 0, 0, 0)
  const diff = Math.max(0, midnight.getTime() - now.getTime())
  return {
    hours: Math.floor(diff / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  }
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}

type WeeklyChallengeCardProps = {
  showTimer?: boolean
  showImage?: boolean
}

function WeeklyChallengeCard({ showTimer = true, showImage = true }: WeeklyChallengeCardProps) {
  const [timeLeft, setTimeLeft] = useState(getTimeUntilMidnight)

  useEffect(() => {
    if (!showTimer) return
    const id = window.setInterval(() => setTimeLeft(getTimeUntilMidnight()), 1000)
    return () => window.clearInterval(id)
  }, [showTimer])

  return (
    <section className="co_challenge_card co_challenge_card_first">
      <div className="wcc_header">
        {showTimer && (
          <p className="wcc_timer">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <circle cx="10" cy="11" r="7.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M10 7.5V11l2.5 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M7.5 2.5h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            {pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:{pad(timeLeft.seconds)} 남음
          </p>
        )}
        <Title
          className="co_challenge_info"
          beforeTitle={<span className="co_day_label">Day 3</span>}
        >
          <strong>이번주 집사 챌린지</strong>
        </Title>
      </div>
      {showImage && <img src={challengeImg} alt="" className="wcc_challenge_img" />}
      <p className="co_challenge_desc">
        내 반려동물의<br />발바닥 상태를 체크해줘요
      </p>
      <div className="co_challenge_meta">
        <p>
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <circle cx="10" cy="10" r="8.5" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="10" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M4 16.5C4 13.74 6.69 11.5 10 11.5s6 2.24 6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span>22명 참여</span>
        </p>
        <p>
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <rect x="2.5" y="4" width="15" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
            <path d="M2.5 8h15" stroke="currentColor" strokeWidth="1.5" />
            <path d="M13.5 2.5v3M6.5 2.5v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span>오늘 24:00 마감</span>
        </p>
      </div>
      <Button type="button" className="purple_btn">참여하고 포인트 받기</Button>
    </section>
  )
}

export default WeeklyChallengeCard
