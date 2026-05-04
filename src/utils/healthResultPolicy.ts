import type { HealthResultSummaryItem } from '../components/HealthResultSummary'
import type { HealthResultDetailItem } from '../components/HealthResultDetailBox'

export type HealthStatusTone = 'excellent' | 'good' | 'normal' | 'caution' | 'danger'
export type ObservationStatus = 'stable' | 'minor' | 'warning' | 'missing'

export type HealthStatus = {
  label: string
  tone: HealthStatusTone
  message: string
}

export type HealthEvaluationInput = {
  stoolStatus: ObservationStatus
  activityStatus: ObservationStatus
  mealStatus: ObservationStatus
  weightStatus: ObservationStatus
  symptomStatus: ObservationStatus
  photoStatus: ObservationStatus
}

export type HealthResultSummaryData = {
  signal: string
  cause: string
  consultation: string
  hospitalGuide: string
  report: string
}

export type HealthEvaluationResult = {
  score: number
  status: HealthStatus
  summary: HealthResultSummaryData
  insights: string[]
  input: HealthEvaluationInput
}

export const HEALTH_RESULT_INPUT_KEY = 'health-result-input'

const DEFAULT_INPUT: HealthEvaluationInput = {
  stoolStatus: 'missing',
  activityStatus: 'missing',
  mealStatus: 'missing',
  weightStatus: 'missing',
  symptomStatus: 'missing',
  photoStatus: 'missing',
}

const scoreWeights = {
  stoolStatus: 25,
  activityStatus: 20,
  mealStatus: 20,
  weightStatus: 15,
} as const

const defaultScoreRatio: Record<ObservationStatus, number> = {
  stable: 1,
  minor: 0.6,
  warning: 0.3,
  missing: 0.5,
}

const symptomScores: Record<ObservationStatus, number> = {
  stable: 15,
  minor: 9,
  warning: 4,
  missing: 8,
}

const photoScores: Record<ObservationStatus, number> = {
  stable: 5,
  minor: 3,
  warning: 1,
  missing: 0,
}

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

function getWeightedScore(status: ObservationStatus, weight: number) {
  return weight * defaultScoreRatio[status]
}

function getSignalText(input: HealthEvaluationInput) {
  const statuses = Object.values(input)
  const warningCount = statuses.filter((status) => status === 'warning').length
  const minorCount = statuses.filter((status) => status === 'minor').length
  const allStable = statuses.every((status) => status === 'stable')

  if (warningCount >= 2) return '반복 변화 감지'
  if (warningCount === 1) return '상태 변화 감지'
  if (minorCount >= 1) return '경미한 변화 감지'
  if (allStable) return '큰 변화 없음'
  return '큰 변화 없음'
}

function isChanged(status: ObservationStatus) {
  return status === 'minor' || status === 'warning'
}

function getCauseText(input: HealthEvaluationInput) {
  if (isChanged(input.activityStatus)) return '활동량 변화 가능성'
  if (isChanged(input.mealStatus)) return '식사량 변화 가능성'
  if (isChanged(input.stoolStatus)) return '배설 패턴 변화 가능성'
  if (isChanged(input.weightStatus)) return '체중 변화 가능성'
  if (isChanged(input.symptomStatus)) return '컨디션 변화 가능성'
  return '특이 요인 없음'
}

function getConsultationText(tone: HealthStatusTone) {
  if (tone === 'danger') return '상담 권장 안내'
  if (tone === 'caution') return '상담 정보 확인'
  if (tone === 'normal') return '케어 정보 확인'
  return '관련 정보 보기'
}

function getHospitalGuideText(score: number) {
  if (score >= 75) return '지켜봐도 괜찮아요'
  if (score >= 60) return '지켜보고 필요 시 확인'
  if (score >= 40) return '필요 시 방문 고려'
  return '상담 또는 방문 고려'
}

function getReportText(tone: HealthStatusTone, input: HealthEvaluationInput) {
  const hasMinorOrWarning = Object.values(input).some((status) => isChanged(status))

  if (tone === 'danger' || tone === 'caution') return '방문용 리포트 보기'
  if (hasMinorOrWarning) return '기록 리포트 보기'
  return '리포트 보기'
}

function createInsightMessage(summary: HealthResultSummaryData) {
  if (summary.cause === '특이 요인 없음') {
    return summary.signal
  }

  return `${summary.signal} · ${summary.cause}`
}

function getPrimaryChangedField(input: HealthEvaluationInput) {
  if (isChanged(input.activityStatus)) return 'activity'
  if (isChanged(input.mealStatus)) return 'meal'
  if (isChanged(input.stoolStatus)) return 'stool'
  if (isChanged(input.weightStatus)) return 'weight'
  if (isChanged(input.symptomStatus)) return 'symptom'
  if (isChanged(input.photoStatus)) return 'photo'
  return 'none'
}

function getPrimaryFieldMessage(field: ReturnType<typeof getPrimaryChangedField>, signal: string) {
  if (field === 'activity') {
    return signal === '반복 변화 감지'
      ? '평소보다\n활동량 변화가 반복되고 있어요.'
      : '평소보다\n활동량 변화가 보여요.'
  }

  if (field === 'meal') {
    return signal === '반복 변화 감지'
      ? '평소보다\n식사량 변화가 반복되고 있어요.'
      : '평소보다\n식사량 변화가 보여요.'
  }

  if (field === 'stool') {
    return signal === '반복 변화 감지'
      ? '평소보다\n배설 패턴 변화가 반복되고 있어요.'
      : '평소보다\n배설 패턴 변화가 보여요.'
  }

  if (field === 'weight') {
    return signal === '반복 변화 감지'
      ? '평소보다\n체중 변화가 반복되고 있어요.'
      : '평소보다\n체중 변화가 보여요.'
  }

  if (field === 'symptom') {
    return signal === '반복 변화 감지'
      ? '최근 기록에서\n컨디션 변화가 반복되고 있어요.'
      : '최근 기록에서\n컨디션 변화가 보여요.'
  }

  if (field === 'photo') {
    return signal === '반복 변화 감지'
      ? '사진 기록에서\n반복 변화가 감지되고 있어요.'
      : '사진 기록에서\n상태 변화가 보여요.'
  }

  return '현재 등록된 기록상\n큰 이상 신호는 없어요.'
}

function getWarningPoints(input: HealthEvaluationInput) {
  const points: string[] = []

  if (isChanged(input.activityStatus)) points.push('활동 기록에서 평소와 다른 변화가 감지되었어요.')
  if (isChanged(input.mealStatus)) points.push('식사 기록에서 평소와 다른 변화가 감지되었어요.')
  if (isChanged(input.stoolStatus)) points.push('배설 기록에서 평소와 다른 변화가 감지되었어요.')
  if (isChanged(input.weightStatus)) points.push('체중 기록에서 평소와 다른 변화가 감지되었어요.')
  if (isChanged(input.symptomStatus)) points.push('증상 또는 메모 기록에서 컨디션 변화가 보여요.')
  if (isChanged(input.photoStatus)) points.push('사진 기반 기록에서 보조 이상 신호가 감지되었어요.')

  if (points.length === 0) {
    return ['등록된 기록 기준으로 현재 큰 변화는 보이지 않아요.']
  }

  return points
}

function getCausePoints(field: ReturnType<typeof getPrimaryChangedField>) {
  if (field === 'activity') {
    return ['최근 산책 시간이나 놀이 시간이 줄었는지 확인해 주세요.', '휴식 시간이 늘었는지도 함께 살펴보세요.']
  }

  if (field === 'meal') {
    return ['사료 섭취량이나 간식량 변화가 있었는지 확인해 주세요.', '식사 반응이 평소와 다른지도 함께 살펴보세요.']
  }

  if (field === 'stool') {
    return ['배변 횟수나 상태 변화가 있었는지 확인해 주세요.', '수분 섭취량이나 식단 변화도 함께 살펴보세요.']
  }

  if (field === 'weight') {
    return ['최근 체중 변화가 있었는지 다시 확인해 주세요.', '식사량과 활동량 변화도 함께 살펴보세요.']
  }

  if (field === 'symptom') {
    return ['메모에 적은 증상이 반복되는지 확인해 주세요.', '다른 컨디션 변화가 동반되는지도 함께 살펴보세요.']
  }

  if (field === 'photo') {
    return ['사진에 보이는 부위가 평소와 다른지 다시 확인해 주세요.', '추가 사진 기록이 있다면 함께 비교해 보세요.']
  }

  return ['현재 기록상 뚜렷한 원인으로 보이는 항목은 없어요.']
}

function getConsultMessage(consultation: string) {
  if (consultation === '상담 권장 안내') return '전문가와 상담을 우선 고려해 주세요.'
  if (consultation === '상담 정보 확인') return '상담이 필요한 증상인지 먼저 확인해 보세요.'
  if (consultation === '케어 정보 확인') return '집에서 확인할 수 있는 케어 정보를 먼저 살펴보세요.'
  return '현재 상태와 관련된 정보를 먼저 확인해 보세요.'
}

function getConsultPoints(consultation: string) {
  if (consultation === '상담 권장 안내') {
    return ['이상 신호가 반복되면 수의사 상담을 권장드려요.', '기록한 사진, 영상, 메모를 함께 준비하면 도움이 돼요.']
  }

  if (consultation === '상담 정보 확인') {
    return ['증상이 더 뚜렷해지면 상담 연결을 고려해 주세요.', '기록을 추가로 남겨두면 상담 시 도움이 돼요.']
  }

  if (consultation === '케어 정보 확인') {
    return ['생활 패턴을 조금 더 지켜보며 기록을 이어가 주세요.', '필요 시 추가 기록 후 다시 확인해 보세요.']
  }

  return ['현재는 관련 정보를 먼저 확인하며 경과를 지켜봐도 괜찮아요.']
}

function getActionMessage(hospitalGuide: string) {
  if (hospitalGuide === '상담 또는 방문 고려') return '상담 또는 병원 방문을\n우선 고려해 주세요.'
  if (hospitalGuide === '필요 시 방문 고려') return '상태를 지켜보되\n필요 시 방문을 고려해 주세요.'
  if (hospitalGuide === '지켜보고 필요 시 확인') return '조금 더 지켜보며\n필요 시 추가 확인해 주세요.'
  return '현재는 조금 더\n지켜봐도 괜찮아요.'
}

function getActionPoints(hospitalGuide: string) {
  if (hospitalGuide === '상담 또는 방문 고려') {
    return ['증상이 반복되거나 심해지면 빠르게 상담해 주세요.', '추가 기록을 함께 가져가면 진료에 도움이 돼요.']
  }

  if (hospitalGuide === '필요 시 방문 고려') {
    return ['변화가 지속되면 병원 방문을 고려해 주세요.', '식사, 활동, 배설 변화를 함께 기록해 두세요.']
  }

  if (hospitalGuide === '지켜보고 필요 시 확인') {
    return ['하루 이틀 더 기록을 남기며 경과를 살펴보세요.', '변화가 커지면 다시 확인하거나 상담을 고려해 주세요.']
  }

  return ['현재 기록상 급한 방문이 필요해 보이진 않아요.', '다만 변화가 생기면 추가 기록 후 다시 확인해 주세요.']
}

export function createHealthResultDetailItems(result: HealthEvaluationResult): HealthResultDetailItem[] {
  const primaryField = getPrimaryChangedField(result.input)
  return [
    {
      variant: 'warning',
      title: '이상 신호 감지',
      badge: result.summary.signal,
      message: getPrimaryFieldMessage(primaryField, result.summary.signal),
      points: getWarningPoints(result.input),
    },
    {
      variant: 'cause',
      title: '원인 추정',
      badge: result.summary.cause,
      message:
        result.summary.cause === '특이 요인 없음'
          ? '현재 기록상\n특이 요인은 없어요.'
          : `${result.summary.cause.replace(' 가능성', '')}\n가능성이 있어요.`,
      points: getCausePoints(primaryField),
    },
    {
      variant: 'symptom',
      title: '증상 상담',
      badge: result.summary.consultation,
      message: getConsultMessage(result.summary.consultation),
      points: getConsultPoints(result.summary.consultation),
    },
    {
      variant: 'action',
      title: '추천 행동',
      badge: result.summary.hospitalGuide,
      message: getActionMessage(result.summary.hospitalGuide),
      description: '현재 기록 기준으로 아래 안내를 함께 확인해 주세요.',
      points: getActionPoints(result.summary.hospitalGuide),
    },
    {
      variant: 'consult',
      title: '',
      message: '궁금한 점이 있으시다면\n수의사와 상담해 보세요',
      description: '전문가의 의견으로 더 안심할 수 있어요.',
      to: '/health/result/actions',
    },
  ]
}

export function calculateHealthResult(input: Partial<HealthEvaluationInput>): HealthEvaluationResult {
  const normalizedInput: HealthEvaluationInput = {
    ...DEFAULT_INPUT,
    ...input,
  }

  const score = Math.round(
    getWeightedScore(normalizedInput.stoolStatus, scoreWeights.stoolStatus) +
      getWeightedScore(normalizedInput.activityStatus, scoreWeights.activityStatus) +
      getWeightedScore(normalizedInput.mealStatus, scoreWeights.mealStatus) +
      getWeightedScore(normalizedInput.weightStatus, scoreWeights.weightStatus) +
      symptomScores[normalizedInput.symptomStatus] +
      photoScores[normalizedInput.photoStatus],
  )

  const status = getHealthStatus(score)
  const summary: HealthResultSummaryData = {
    signal: getSignalText(normalizedInput),
    cause: getCauseText(normalizedInput),
    consultation: getConsultationText(status.tone),
    hospitalGuide: getHospitalGuideText(score),
    report: getReportText(status.tone, normalizedInput),
  }

  return {
    score,
    status,
    summary,
    insights: [createInsightMessage(summary)],
    input: normalizedInput,
  }
}

export function createHealthResultSummaryItems(summary: HealthResultSummaryData): HealthResultSummaryItem[] {
  return [
    {
      icon: 'warning',
      label: '이상 신호 감지',
      value: summary.signal,
      to: '/health/result/detail',
    },
    {
      icon: 'search',
      label: '원인 추정',
      value: summary.cause,
      to: '/health/result/detail',
    },
    {
      icon: 'chat',
      label: '증상 상담',
      value: summary.consultation,
      to: '/health/result/detail',
    },
    {
      icon: 'hospital',
      label: '병원 방문 여부 가이드',
      value: summary.hospitalGuide,
      to: '/health/result/detail',
    },
    {
      icon: 'report',
      label: '병원 방문 리포트 생성',
      value: summary.report,
      to: '/health/result/detail',
    },
  ]
}

export function readStoredHealthResultInput() {
  if (typeof window === 'undefined') {
    return DEFAULT_INPUT
  }

  try {
    const raw = window.sessionStorage.getItem(HEALTH_RESULT_INPUT_KEY)

    if (!raw) {
      return DEFAULT_INPUT
    }

    return {
      ...DEFAULT_INPUT,
      ...(JSON.parse(raw) as Partial<HealthEvaluationInput>),
    }
  } catch {
    return DEFAULT_INPUT
  }
}

export function writeStoredHealthResultInput(input: Partial<HealthEvaluationInput>) {
  if (typeof window === 'undefined') {
    return
  }

  window.sessionStorage.setItem(
    HEALTH_RESULT_INPUT_KEY,
    JSON.stringify({
      ...DEFAULT_INPUT,
      ...input,
    }),
  )
}
