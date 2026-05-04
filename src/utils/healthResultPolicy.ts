import type { HealthResultSummaryItem } from '../components/HealthResultSummary'

export type HealthStatusTone = 'excellent' | 'good' | 'normal' | 'caution' | 'danger'

export type HealthStatus = {
  label: string
  tone: HealthStatusTone
  message: string
}

export type CareChangeFactor = 'activity' | 'meal' | 'excretion' | 'complex' | 'none'

export const careScoreWeights = {
  excretion: 25,
  activity: 20,
  meal: 20,
  weight: 15,
  symptom: 15,
  photo: 5,
} as const

export const photoObservationScores = {
  stable: 5,
  mildChange: 3,
  clearChange: 1,
} as const

export const photoObservationMessages = [
  '눈 주변에 눈곱이 보여요',
  '털이 다소 건조해 보여요',
  '조금 무기력해 보여요',
] as const

export function getHealthStatus(score: number): HealthStatus {
  if (score >= 90) {
    return {
      label: '아주 좋음',
      tone: 'excellent',
      message: '오늘 컨디션이 안정적으로 보여요',
    }
  }

  if (score >= 75) {
    return {
      label: '좋음',
      tone: 'good',
      message: '전반적으로 좋은 상태예요',
    }
  }

  if (score >= 60) {
    return {
      label: '보통',
      tone: 'normal',
      message: '큰 변화는 없지만 조금 더 지켜봐 주세요',
    }
  }

  if (score >= 40) {
    return {
      label: '주의',
      tone: 'caution',
      message: '최근 상태 변화가 보여요',
    }
  }

  return {
    label: '관리 필요',
    tone: 'danger',
    message: '상태 확인이 필요해 보여요',
  }
}

function getSignalText(tone: HealthStatusTone) {
  if (tone === 'excellent' || tone === 'good') return '큰 변화 없음'
  if (tone === 'normal') return '경미한 변화 감지'
  if (tone === 'caution') return '상태 변화 감지'
  return '반복 변화 감지'
}

function getCauseText(changeFactor: CareChangeFactor) {
  if (changeFactor === 'activity') return '활동량 변화 가능성'
  if (changeFactor === 'meal') return '식사량 변화 가능성'
  if (changeFactor === 'excretion') return '배설 패턴 변화 가능성'
  if (changeFactor === 'complex') return '컨디션 변화 가능성'
  return '특이 요인 없음'
}

function getConsultText(tone: HealthStatusTone) {
  if (tone === 'excellent' || tone === 'good') return '관련 정보 보기'
  if (tone === 'normal') return '케어 정보 확인'
  if (tone === 'caution') return '상담 정보 확인'
  return '상담 권장 안내'
}

function getVisitGuideText(score: number) {
  if (score >= 75) return '지켜봐도 괜찮아요'
  if (score >= 60) return '지켜보고 필요 시 확인'
  if (score >= 40) return '필요 시 방문 고려'
  return '상담 또는 방문 고려'
}

function getReportText(tone: HealthStatusTone) {
  if (tone === 'caution' || tone === 'danger') return '방문용 리포트 보기'
  if (tone === 'normal') return '기록 리포트 보기'
  return '리포트 보기'
}

export function createHealthResultSummaryItems({
  score,
  changeFactor = 'none',
}: {
  score: number
  changeFactor?: CareChangeFactor
}): HealthResultSummaryItem[] {
  const status = getHealthStatus(score)

  return [
    {
      icon: 'warning',
      label: '이상 신호 감지',
      value: getSignalText(status.tone),
      to: '/health/result/detail',
    },
    {
      icon: 'search',
      label: '원인 추정',
      value: getCauseText(status.tone === 'excellent' || status.tone === 'good' ? 'none' : changeFactor),
      to: '/health/result/detail',
    },
    {
      icon: 'chat',
      label: '증상 상담',
      value: getConsultText(status.tone),
      to: '/health/result/detail',
    },
    {
      icon: 'hospital',
      label: '병원 방문 여부 가이드',
      value: getVisitGuideText(score),
      to: '/health/result/detail',
    },
    {
      icon: 'report',
      label: '병원 방문 리포트 생성',
      value: getReportText(status.tone),
      to: '/health/result/detail',
    },
  ]
}
