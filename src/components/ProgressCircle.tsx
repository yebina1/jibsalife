import type { CSSProperties, ReactNode } from 'react'
import './ProgressCircle.css'

type ProgressCircleProps = {
  value: number
  children?: ReactNode
  showValue?: boolean
}

function ProgressCircle({ value, children, showValue = true }: ProgressCircleProps) {
  const safeValue = Math.min(100, Math.max(0, value))

  return (
    <div
      className="progress_circle"
      style={{ '--progress': `${safeValue}%` } as CSSProperties}
      aria-label={`진행률 ${safeValue}%`}
    >
      {showValue ? <span className="progress_circle_value">{safeValue}</span> : null}
      <div className="progress_circle_inner">{children}</div>
    </div>
  )
}

export default ProgressCircle
