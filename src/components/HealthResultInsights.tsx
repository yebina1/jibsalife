import './HealthResultInsights.css'

type HealthResultInsightsProps = {
  items: string[]
}

function HealthResultInsights({ items }: HealthResultInsightsProps) {
  const warningIcon = `${import.meta.env.BASE_URL}warning.svg`

  return (
    <div className="health_result_insights">
      {items.map((item) => (
        <div className="health_result_insight" key={item}>
          <img src={warningIcon} alt="" aria-hidden="true" />
          <p>{item}</p>
        </div>
      ))}
    </div>
  )
}

export default HealthResultInsights
