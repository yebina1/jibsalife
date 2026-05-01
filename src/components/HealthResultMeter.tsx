import type { CSSProperties } from 'react'
import './HealthResultMeter.css'

type HealthResultMeterProps = {
  score: number
}

function HealthResultMeter({ score }: HealthResultMeterProps) {
  const safeScore = Math.min(100, Math.max(0, score))

  return (
    <div className="health_result_meter">
      <div className="health_result_meter_track">
        <div
          className="health_result_meter_fill"
          style={{ '--score': `${safeScore}%` } as CSSProperties}
        ></div>
      </div>
      <div className="health_result_meter_labels">
        <span>0</span>
        <span>50</span>
        <span>100</span>
      </div>
    </div>
  )
}

export default HealthResultMeter
