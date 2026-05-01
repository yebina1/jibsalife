import { useNavigate } from 'react-router'
import './health.css'
import './HealthResultDetail.css'
import Header from '../components/Header'
import BackButton from '../components/html/BackButton'
import HealthResultCard from '../components/HealthResultCard'
import HealthResultDetailBox from '../components/HealthResultDetailBox'
import type { HealthResultDetailItem } from '../components/HealthResultDetailBox'
import HealthConsultBox from '../components/HealthConsultBox'
import NoticeText from '../components/NoticeText'

const mockHealthResult = {
  score: 82,
}

const detailItems: HealthResultDetailItem[] = [
  {
    title: '이상 신호 감지',
    badge: '경미한 변화 감지',
    message: '평소보다 활동량이 15% 감소했어요.',
    points: [
      '총 활동 시간: 평소 42분, 오늘 36분',
      '식욕, 배변 상태는 정상 범위예요.',
    ],
  },
  {
    title: '원인 추정',
    badge: '가능성 있음',
    message: '스트레스 가능성이 있어요.',
    points: [
      '최근 환경 변화가 있었나요?',
      '산책 시간이나 놀이 시간이 줄었을 수 있어요.',
    ],
  },
  {
    title: '증상 상담',
    badge: '소화 불량 가능성',
    message: '구토나 설사는 없었어요.',
    points: [
      '식사 후 평소와 다른 행동이 있었는지 확인해 주세요.',
      '변 상태가 묽거나 무르지 않은지 살펴봐 주세요.',
    ],
  },
  {
    title: '추천 행동',
    badge: '지켜보고 필요 시 방문',
    message: '당장 병원 방문은 필요하지 않아 보여요.',
    description: '다만, 다음과 같은 경우 병원 방문을 추천드려요.',
    points: [
      '증상이 2일 이상 지속될 경우',
      '식사량이나 활동량이 급격히 줄어든 경우',
      '구토, 설사 등이 반복되는 경우',
    ],
  },
]

function HealthResultDetail() {
  const navigate = useNavigate()

  return (
    <>
      <Header
        title="AI 건강 체크"
        leftContent={<BackButton />}
        rightContent={<p>오늘 AI 건강체크 1/1회 사용</p>}
      />
      <main className="page health_page health_result_detail_page">
        <HealthResultCard score={mockHealthResult.score} />
        <HealthResultDetailBox items={detailItems} />
        <HealthConsultBox
          buttonText="상담하기"
          onButtonClick={() => navigate('/health/check-summary')}
        >
          <h3>
            궁금한 점이 있으시다면
            <br />
            수의사와 상담해 보세요.
          </h3>
          <p>전문가의 의견으로 더 안심할 수 있어요.</p>
        </HealthConsultBox>
        <NoticeText>
          <p>
            이 결과는 참고용이며,
            <br />
            정확한 진단은 수의사 상담을 통해 확인해 주세요.
          </p>
        </NoticeText>
      </main>
    </>
  )
}

export default HealthResultDetail
