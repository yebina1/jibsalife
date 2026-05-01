import './HealthResultSummary.css'
import { Link } from 'react-router'
import Title from './Title'

const summaryItems = [
  {
    label: '이상 신호 감지',
    value: '경미한 변화 감지',
  },
  {
    label: '원인 추정',
    value: '스트레스 가능성',
  },
  {
    label: '증상 상담',
    value: '소화 불량 가능성',
  },
  {
    label: '병원 방문 여부 가이드',
    value: '지켜보고 필요 시 방문',
  },
  {
    label: '병원 방문 리포트 생성',
    value: '리포트 보기',
  },
  {
    label: '관련 커뮤니티 게시글',
    value: '3개 추천',
  },
]

function HealthResultSummary() {
  return (
    <section className="health_result_summary_box">
      <Title as="h2" title="확인 결과 요약" />
      <ul>
        {summaryItems.map((item) => (
          <li key={item.label}>
            <Link className="health_result_summary_link" to="/health/result/detail">
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
