import { useEffect, useState } from 'react'
import './HealthResultCard.css'
import HealthResultCardTop from './HealthResultCardTop'
import HealthResultMeter from './HealthResultMeter'

type HealthResultCardProps = {
  score: number
}

function HealthResultCard({ score }: HealthResultCardProps) {
  const [animatedScore, setAnimatedScore] = useState(0)

  useEffect(() => {
    const safeScore = Math.min(100, Math.max(0, score))
    const duration = 1200
    let animationFrameId = 0
    let startTime = 0

    const animate = (timestamp: number) => {
      if (!startTime) {
        startTime = timestamp
      }

      const elapsed = timestamp - startTime
      const progress = Math.min(1, elapsed / duration)
      const easedProgress = 1 - Math.pow(1 - progress, 3)

      setAnimatedScore(Math.round(safeScore * easedProgress))

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(animate)
      }
    }

    setAnimatedScore(0)
    animationFrameId = window.requestAnimationFrame(animate)

    return () => {
      window.cancelAnimationFrame(animationFrameId)
    }
  }, [score])

  return (
    <section className="health_result_card">
      <HealthResultCardTop score={animatedScore} />
      <HealthResultMeter score={animatedScore} />
    </section>
  )
}

export default HealthResultCard
