import { useNavigate } from 'react-router'
import './health.css'
import './HealthCheckResult.css'
import PageHeader from '../components/PageHeader'
import HealthResultCard from '../components/HealthResultCard'
import HealthResultInsights from '../components/HealthResultInsights'
import HealthResultSummary from '../components/HealthResultSummary'
import type { HealthResultSummaryItem } from '../components/HealthResultSummary'
import Title from '../components/Title'
import Button from '../components/html/Button'
import BackButton from '../components/html/BackButton'
import CloseButton from '../components/html/CloseButton'
import checkMarkIcon from '../svg/Check Mark.svg'
import NoticeText from '../components/NoticeText'

const mockHealthResult = {
  score: 82,
  insights: ['이전보다 몸무게가 줄었어요!'],
}

const summaryItems: HealthResultSummaryItem[] = [
  {
    label: '이상 신호 감지',
    value: '경미한 변화 감지',
    to: '/health/result/detail',
  },
  {
    label: '원인 추정',
    value: '스트레스 가능성',
    to: '/health/result/detail',
  },
  {
    label: '증상 상담',
    value: '소화 불량 가능성',
    to: '/health/result/detail',
  },
  {
    label: '병원 방문 여부 가이드',
    value: '지켜보고 필요 시 방문',
    to: '/health/result/detail',
  },
  {
    label: '병원 방문 리포트 생성',
    value: '리포트 보기',
    to: '/health/result/detail',
  },
  {
    label: '관련 커뮤니티 게시글',
    value: '3개 추천',
    to: '/health/result/detail',
  },
]

function HealthCheckResult() {
  const navigate = useNavigate()

  return (
    <>
      <PageHeader title="AI 건강 체크" 
      leftContent={<BackButton />}
      rightContent={<CloseButton />} />
      <main className="page health_page health_check_result_page">
        <Title as="h3" title="확인이 완료되었어요!">
          <img className="health_check_result_icon" src={checkMarkIcon} alt="" />
        </Title>
        <HealthResultCard score={mockHealthResult.score} />
        <HealthResultInsights items={mockHealthResult.insights} />
        <HealthResultSummary title="확인 결과 요약" items={summaryItems} />
        <Button
          type="button"
          className="purple_btn"
          onClick={() => navigate('/health/result/detail')}
        >
          결과 자세히 보기
        </Button>
        <NoticeText>
          <p>
            ※ 이 결과는 참고용이며, 정확한 진단은
            <br />
            수의사 상담을 통해 확인해 주세요.
          </p>
        </NoticeText>
      </main>
    </>
  )
}

export default HealthCheckResult
