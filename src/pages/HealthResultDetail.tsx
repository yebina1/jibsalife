import './health.css'
import './HealthResultDetail.css'
import PageHeader from '../components/PageHeader'
import BackButton from '../components/html/BackButton'
import HealthResultDetailBox from '../components/HealthResultDetailBox'
import type { HealthResultDetailItem } from '../components/HealthResultDetailBox'

const detailItems: HealthResultDetailItem[] = [
  {
    variant: 'warning',
    title: '이상 신호 감지',
    badge: '경미한 변화 감지',
    message: '평소보다\n활동량이 15% 감소했어요.',
    points: ['활동 시간: 평소 42분 -> 오늘 36분', '식욕, 배변 등은 정상 범위예요.'],
  },
  {
    variant: 'cause',
    title: '원인 추정',
    badge: '가능성 있음',
    message: '스트레스\n가능성이 있어요.',
    points: ['최근 환경 변화가 있었나요?', '산책 시간이나 놀이 시간이 줄었나요?'],
  },
  {
    variant: 'symptom',
    title: '증상 상담',
    badge: '소화 불량 가능성',
    message: '구토나 설사는\n없었나요?',
    points: ['식사 후 헛구역질을 한 적이 있었나요?', '변 상태가 묽거나 무르지 않았나요?'],
  },
  {
    variant: 'action',
    title: '추천 행동',
    badge: '지켜보고 필요 시 방문',
    message: '당장 병원 방문은\n필요하지 않아요.',
    description: '다만, 다음과 같은 경우 병원 방문을 추천드려요.',
    points: [
      '증상이 2일 이상 지속될 경우',
      '식사나 활동량이 급격히 줄어든 경우',
      '구토, 설사 등이 반복되는 경우',
    ],
  },
  {
    variant: 'consult',
    title: '',
    message: '궁금한 점이 있으시다면\n수의사와 상담해 보세요',
    description: '전문가의 의견으로 더 안심할 수 있어요.',
  },
]

function HealthResultDetail() {
  return (
    <>
      <PageHeader title="AI 건강 체크" leftContent={<BackButton />} />
      <main className="page health_page health_result_detail_page">
        <HealthResultDetailBox items={detailItems} />
      </main>
    </>
  )
}

export default HealthResultDetail
