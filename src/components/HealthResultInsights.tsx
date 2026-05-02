import './HealthResultInsights.css'
import lightIcon from '../svg/Light.svg'

type HealthResultInsightsProps = {
  items: string[]
}

function HealthResultInsights({ items }: HealthResultInsightsProps) {
  return (
    <div className="health_result_insights">
      {items.map((item) => (
        <div className="health_result_insight" key={item}>
          <img src={lightIcon} alt="건강 인사이트" />
          <p>{item}</p>
        </div>
      ))}
    </div>
  )
}

export default HealthResultInsights
