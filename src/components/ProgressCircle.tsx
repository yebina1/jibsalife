import type { CSSProperties, ReactNode } from 'react'
import './ProgressCircle.css'

type ProgressCircleProps = {
  value: number
  children?: ReactNode
}

function ProgressCircle({ value, children }: ProgressCircleProps) {
  const safeValue = Math.min(100, Math.max(0, value))

  return (
    <div
      className="progress_circle"
      style={{ '--progress': `${safeValue}%` } as CSSProperties}
      aria-label={`진행률 ${safeValue}%`}
    >
      <span className="progress_circle_value">{safeValue}</span>
      <div className="progress_circle_inner">{children}</div>
    </div>
  )
}

export default ProgressCircle
