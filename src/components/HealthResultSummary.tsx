import './HealthResultSummary.css'
import { Link } from 'react-router'
import Title from './Title'

export type HealthResultSummaryItem = {
  label: string
  value: string
  to: string
}

type HealthResultSummaryProps = {
  title: string
  items: HealthResultSummaryItem[]
}

function HealthResultSummary({ title, items }: HealthResultSummaryProps) {
  return (
    <section className="health_result_summary_box">
      <Title as="h2" title={title} />
      <ul>
        {items.map((item) => (
          <li key={item.label}>
            <Link className="health_result_summary_link" to={item.to}>
              <div className="health_result_summary_label">
                <span aria-hidden="true"></span>
                <strong>{item.label}</strong>
              </div>
              <div className="health_result_summary_value">
                <span>{item.value}</span>
                <i className="bx bx-chevron-right"></i>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default HealthResultSummary
