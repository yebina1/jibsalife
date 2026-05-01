import './HealthResultDetailBox.css'
import Title from './Title'

export type HealthResultDetailItem = {
  title: string
  badge: string
  message: string
  description?: string
  points: string[]
}

type HealthResultDetailBoxProps = {
  items: HealthResultDetailItem[]
}

function HealthResultDetailBox({ items }: HealthResultDetailBoxProps) {
  return (
    <div className="health_result_detail_boxes">
      {items.map((item) => (
        <section className="health_result_detail_box" key={item.title}>
          <div className="health_result_detail_box_header">
            <Title as="h2" title={item.title} />
            <span>{item.badge}</span>
          </div>

          <p className="health_result_detail_box_message">{item.message}</p>
          {item.description && (
            <p className="health_result_detail_box_description">{item.description}</p>
          )}

          <ul>
            {item.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}

export default HealthResultDetailBox
