import './HealthResultDetailBox.css'
import Title from './Title'

const detailItems = [
  {
    title: '이상 신호 감지',
    badge: '경미한 변화 감지',
    message: '평소보다 활동량이 15% 감소했어요.',
    points: ['• 활동 시간: 평소 42분 → 오늘 36분',
      '• 식욕, 배변 등은 정상 범위예요.'],
  },
  {
    title: '원인 추정',
    badge: '가능성 있음',
    message: '스트레스 가능성이 있어요.',
    points: ['• 최근 환경 변화가 있었나요?',
      '• 산책 시간이나 놀이 시간이 줄었나요?'],
  },
  {
    title: '증상 상담',
    badge: '소화 불량 가능성',
    message: '구토나 설사는 없었나요?',
    points: ['• 식사 후 헛구역질을 한 적이 있었나요?',
      '• 변 상태가 묽거나 무르지 않았나요?'],
  },
  {
    title: '추천 행동',
    badge: '지켜 보고 필요 시 방문',
    message: '당장 병원 방문은 필요하지 않아요.',
    description: '다만, 다음과 같은 경우 병원 방문을 추천드려요.',
    points: [
      '• 증상이 2일 이상 지속될 경우',
      '• 식사나 활동량이 급격히 줄어든 경우',
      '• 구토, 설사 등이 반복되는 경우',
    ],
  },
]

function HealthResultDetailBox() {
  return (
    <div className="health_result_detail_boxes">
      {detailItems.map((item) => (
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
