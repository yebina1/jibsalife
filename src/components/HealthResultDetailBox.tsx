import './HealthResultDetailBox.css'
import { Link } from 'react-router'
import warning3d from '../img/warning_3d.png'
import search3d from '../img/search_3d.png'
import message3d from '../img/message_3d.png'
import clipboard3d from '../img/clipboard_3d.png'
import consult3d from '../img/consult_3d.png'

export type HealthResultDetailItem = {
  variant: 'warning' | 'cause' | 'symptom' | 'action' | 'consult'
  title: string
  badge?: string
  message: string
  description?: string
  points?: string[]
  to?: string
}

type HealthResultDetailBoxProps = {
  items: HealthResultDetailItem[]
}

const visualMap = {
  warning: warning3d,
  cause: search3d,
  symptom: message3d,
  action: clipboard3d,
  consult: consult3d,
} as const

function HealthResultDetailBox({ items }: HealthResultDetailBoxProps) {
  return (
    <div className="health_result_detail_boxes">
      {items.map((item) => {
        const content = (
          <>
            <div className="health_result_detail_content">
              <div className="health_result_detail_box_header">
                {item.title ? <h2>{item.title}</h2> : <span aria-hidden="true"></span>}
                {item.badge ? <span>{item.badge}</span> : null}
              </div>

              <p className="health_result_detail_box_message">{item.message}</p>
              {item.description ? (
                <p className="health_result_detail_box_description">{item.description}</p>
              ) : null}

              {item.points?.length ? (
                <ul>
                  {item.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              ) : null}
            </div>

            <img
              className="health_result_detail_visual"
              src={visualMap[item.variant]}
              alt=""
              aria-hidden="true"
            />
          </>
        )

        if (item.to) {
          return (
            <Link className={`health_result_detail_box ${item.variant} is_link`} key={item.variant} to={item.to}>
              {content}
            </Link>
          )
        }

        return (
          <section className={`health_result_detail_box ${item.variant}`} key={item.variant}>
            {content}
          </section>
        )
      })}
    </div>
  )
}

export default HealthResultDetailBox
