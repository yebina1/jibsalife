import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import './Health.css'
import './HealthQna.css'
import PageHeader from '../../components/PageHeader'
import ChatRoom from '../../components/ChatRoom'
import type { ChatAction, ChatMessage } from '../../components/ChatRoom'
import BackButton from '../../components/html/BackButton'
import Button from '../../components/html/Button'
import HeaderIcon from '../../components/HeaderIcon'
import mascotImage from '../../img/onboarding/onboarding3_mascot.png'
import {
  appendChatbotRecord,
  readChatbotDataStore,
  upsertChatbotFeedback,
  type ChatbotRecordCategory,
  type ChatbotFeedbackType,
} from '../../utils/chatbotRecords'
import { createLocalChatbotAnswer } from '../../utils/localChatbotAnswers'
import {
  parseMealRecordDetail,
  parsePoopRecordDetail,
  parseSymptomRecordDetail,
  parseWalkActivityDetail,
  writeMissionActivityRecord,
  writeMissionMealRecord,
  writeMissionPoopRecord,
  writeMissionSymptomRecord,
} from '../../utils/missionActivityRecords'
import { MY_PROFILE_CHANGE_EVENT, readMyProfileName } from '../../utils/myProfile'

type RecordKind = 'meal' | 'poop' | 'symptom' | 'activity'

type RecordDraft = {
  kind: RecordKind
  category: ChatbotRecordCategory
  value: string
  calendarDetail: string
  walkTime?: string
}

type PendingOtherRecord = {
  kind: RecordKind
  category: ChatbotRecordCategory
}

const HEALTH_QNA_STORAGE_KEY = 'jibsalife.health.qna.history'
const DEFAULT_CHIPS = ['식사', '배변·배뇨', '증상', '활동', '캘린더', '커뮤니티', '투표', '주변병원'] as const
const WALK_TIME_OPTIONS = ['10분 미만', '10~30분', '30~60분', '60분 이상'] as const

const chipResponses = {
  식사: {
    message: '오늘 식사는 어땠나요? 🍽️',
    options: ['잘 먹음', '보통', '조금 먹음', '안 먹음'],
    kind: 'meal' as const,
    category: '식사' as const,
  },
  '배변·배뇨': {
    message: '오늘 배변 상태는 어땠나요? 🐾',
    options: ['정상', '묽음', '딱딱함', '이상 있음'],
    kind: 'poop' as const,
    category: '배변' as const,
  },
  증상: {
    message: '오늘 눈에 띄는 변화가 있었나요?',
    options: ['무기력', '구토', '설사', '긁음', '기침', '없음'],
    kind: 'symptom' as const,
    category: '증상' as const,
  },
  활동: {
    message: '오늘 활동은 어땠나요? 🐕',
    options: ['활발', '보통', '적음', '거의 없음'],
    kind: 'activity' as const,
    category: '활동' as const,
  },
} as const

const calendarQuickMessageOptions: Record<RecordKind, string[]> = {
  meal: ['사료 30g', '사료 60g', '사료 90g', '사료 120g', '사료 150g', '기타'],
  poop: ['정상 변', '묽은 변', '딱딱한 변', '배변 못함', '소변 잦음', '실수 배뇨', '평소와 다름', '기타'],
  symptom: ['기침', '재채기', '구토', '설사', '헐떡', '무기력', '긁음', '기타'],
  activity: ['활발함', '보통', '활동 적음', '무기력', '평소와 다름', '기타'],
}

function createIntroMessages(profileName: string): ChatMessage[] {
  return [
    {
      id: 1,
      sender: 'bot',
      text:
        `${profileName}님 안녕하세요, 집사님 🐾\n` +
        `오늘 우리 아이 상태를 함께 확인해볼까요?\n\n` +
        `식사·산책·배변 기록을 기반으로\n` +
        `변화를 정리해드릴게요.`,
      chips: [...DEFAULT_CHIPS],
    },
  ]
}

function buildMessageId() {
  return Date.now() + Math.floor(Math.random() * 1000)
}

function buildContinueMessage(): ChatMessage {
  return {
    id: buildMessageId(),
    sender: 'bot',
    text: '좋아요 🐾 오늘 상태를 더 기록해볼까요?',
    chips: [...DEFAULT_CHIPS],
  }
}

function writeMissionRecordByKind(kind: RecordKind, detail: string) {
  if (kind === 'meal') return writeMissionMealRecord(detail)
  if (kind === 'poop') return writeMissionPoopRecord(detail)
  if (kind === 'symptom') return writeMissionSymptomRecord(detail)
  return writeMissionActivityRecord(detail)
}

function saveRecordDraft(draft: RecordDraft) {
  appendChatbotRecord({
    category: draft.category,
    value: draft.value,
    walkTime: draft.walkTime,
  })
}

function buildConfirmMessage(draft: RecordDraft, profileName: string, preface?: string): ChatMessage {
  const confirmText = preface
    ? `${preface}\n\n캘린더에\n${profileName}의 ${draft.calendarDetail}을 등록할까요?`
    : `캘린더에\n${profileName}의 ${draft.calendarDetail}을 등록할까요?`

  return {
    id: buildMessageId(),
    sender: 'bot',
    text: confirmText,
    actions: [
      { label: '아니요', value: 'dismiss' },
      {
        label: '등록하기',
        variant: 'primary',
        value: 'register',
        data: {
          kind: draft.kind,
          category: draft.category,
          value: draft.value,
          calendarDetail: draft.calendarDetail,
          walkTime: draft.walkTime ?? '',
        },
      },
    ],
    showFeedback: true,
  }
}

function buildChipOptionMessage(chip: keyof typeof chipResponses): ChatMessage {
  const response = chipResponses[chip]
  const options = calendarQuickMessageOptions[response.kind]

  return {
    id: buildMessageId(),
    sender: 'bot',
    text: response.message,
    actions: options.map((option) => ({
      label: option,
      value: 'select-option',
      data: {
        kind: response.kind,
        category: response.category,
        value: option,
      },
    })),
  }
}

function buildWalkTimeMessage(activityValue: string): ChatMessage {
  return {
    id: buildMessageId(),
    sender: 'bot',
    text: '산책 시간은 어느 정도였나요? ⏱️',
    actions: WALK_TIME_OPTIONS.map((walkTime) => ({
      label: walkTime,
      value: 'select-walk-time',
      data: {
        kind: 'activity',
        category: '활동',
        value: activityValue,
        walkTime,
      },
    })),
  }
}

void buildWalkTimeMessage

function buildFeedbackSelections() {
  return readChatbotDataStore().feedbacks.reduce<Record<number, ChatbotFeedbackType>>(
    (result, feedback) => {
      const messageId = Number(feedback.messageId)
      if (!Number.isNaN(messageId)) {
        result[messageId] = feedback.type
      }
      return result
    },
    {},
  )
}

function HealthQna() {
  const navigate = useNavigate()
  const [profileName, setProfileName] = useState(() => readMyProfileName())
  const [feedbackSelections, setFeedbackSelections] = useState(buildFeedbackSelections)
  const [pendingOtherRecord, setPendingOtherRecord] = useState<PendingOtherRecord | null>(null)
  const introMessages = useMemo(() => createIntroMessages(profileName), [profileName])

  useEffect(() => {
    const syncProfileName = () => {
      setProfileName(readMyProfileName())
    }

    window.addEventListener(MY_PROFILE_CHANGE_EVENT, syncProfileName)
    window.addEventListener('storage', syncProfileName)

    return () => {
      window.removeEventListener(MY_PROFILE_CHANGE_EVENT, syncProfileName)
      window.removeEventListener('storage', syncProfileName)
    }
  }, [])

  const handleChipSelect = (chip: string) => {
    setPendingOtherRecord(null)

    if (chip === '식사' || chip === '배변·배뇨' || chip === '증상' || chip === '활동') {
      return buildChipOptionMessage(chip)
    }

    if (chip === '캘린더') {
      navigate('/mission')
      return
    }

    if (chip === '커뮤니티') {
      navigate('/community')
      return
    }

    if (chip === '투표') {
      navigate('/community/vote')
      return
    }

    if (chip === '주변병원') {
      navigate('/place')
    }
  }

  const handleMessageSubmit = (message: string) => {
    if (pendingOtherRecord) {
      const draft: RecordDraft = {
        kind: pendingOtherRecord.kind,
        category: pendingOtherRecord.category,
        value: message,
        calendarDetail: message,
      }

      setPendingOtherRecord(null)
      saveRecordDraft(draft)

      return buildConfirmMessage(draft, profileName)
    }

    const walkActivityDetail = parseWalkActivityDetail(message)
    if (walkActivityDetail) {
      const walkTime = walkActivityDetail.replace(/^산책\s*/, '')
      const draft: RecordDraft = {
        kind: 'activity',
        category: '활동',
        value: walkActivityDetail,
        walkTime,
        calendarDetail: walkActivityDetail,
      }
      saveRecordDraft(draft)
      return buildConfirmMessage(draft, profileName, '활동 기록을 저장했어요.')
    }

    const mealRecordDetail = parseMealRecordDetail(message)
    if (mealRecordDetail) {
      const draft: RecordDraft = {
        kind: 'meal',
        category: '식사',
        value: mealRecordDetail,
        calendarDetail: mealRecordDetail,
      }
      saveRecordDraft(draft)
      return buildConfirmMessage(draft, profileName, '식사 기록을 저장했어요.')
    }

    const poopRecordDetail = parsePoopRecordDetail(message)
    if (poopRecordDetail) {
      const draft: RecordDraft = {
        kind: 'poop',
        category: '배변',
        value: poopRecordDetail,
        calendarDetail: poopRecordDetail,
      }
      saveRecordDraft(draft)
      return buildConfirmMessage(draft, profileName, '배변 기록을 저장했어요.')
    }

    const symptomRecordDetail = parseSymptomRecordDetail(message)
    if (symptomRecordDetail) {
      const draft: RecordDraft = {
        kind: 'symptom',
        category: '증상',
        value: symptomRecordDetail,
        calendarDetail: symptomRecordDetail,
      }
      saveRecordDraft(draft)
      return buildConfirmMessage(draft, profileName, '증상 기록을 저장했어요.')
    }

    const chatbotAnswer = createLocalChatbotAnswer(message)
    if (!chatbotAnswer) return

    return {
      id: buildMessageId(),
      sender: 'bot' as const,
      text: chatbotAnswer,
    }
  }

  const handleActionSelect = (action: ChatAction) => {
    if (action.value === 'dismiss') {
      setPendingOtherRecord(null)
      return buildContinueMessage()
    }

    if (action.value === 'register') {
      setPendingOtherRecord(null)
      const kind = action.data?.kind as RecordKind | undefined
      const calendarDetail = action.data?.calendarDetail
      if (!kind || !calendarDetail) return

      writeMissionRecordByKind(kind, calendarDetail)

      return [
        {
          id: buildMessageId(),
          sender: 'bot' as const,
          text: `등록 완료했어요.\n캘린더에서 ${calendarDetail} 기록을 확인해보세요.`,
        },
        buildContinueMessage(),
      ]
    }

    if (action.value === 'select-option') {
      const kind = action.data?.kind as RecordKind | undefined
      const category = action.data?.category as ChatbotRecordCategory | undefined
      const value = action.data?.value

      if (!kind || !category || !value) return

      if (value === '기타') {
        setPendingOtherRecord({ kind, category })

        return {
          id: buildMessageId(),
          sender: 'bot' as const,
          text: '추가로 기록할 내용을 입력해 주세요.',
        }
      }

      setPendingOtherRecord(null)

      const draft: RecordDraft = {
        kind,
        category,
        value,
        calendarDetail: value,
      }

      saveRecordDraft(draft)

      return buildConfirmMessage(draft, profileName)
    }

    if (action.value === 'select-walk-time') {
      const value = action.data?.value
      const walkTime = action.data?.walkTime
      if (!value || !walkTime) return

      const draft: RecordDraft = {
        kind: 'activity',
        category: '활동',
        value,
        walkTime,
        calendarDetail: `산책 ${walkTime}`,
      }

      saveRecordDraft(draft)

      return buildConfirmMessage(
        draft,
        profileName,
        `활동은 ${value},\n산책 시간은 ${walkTime}으로\n저장했어요.`,
      )
    }
  }

  const handleFeedbackSelect = (message: ChatMessage, type: ChatbotFeedbackType) => {
    upsertChatbotFeedback({
      messageId: String(message.id),
      type,
    })
    setFeedbackSelections((currentSelections) => ({
      ...currentSelections,
      [message.id]: type,
    }))
  }

  return (
    <>
      <PageHeader
        title="AI 건강 체크"
        leftContent={<BackButton />}
        rightContent={(
          <>
            <Button type="button" aria-label="캘린더" onClick={() => navigate('/mission')}>
              <HeaderIcon type="calendar" />
            </Button>
            <Button
              type="button"
              aria-label="알림"
              onClick={() => navigate('/mission')}
            >
              <HeaderIcon type="notification" />
            </Button>
          </>
        )}
      />
      <main className="page health_page health_qna_page">
        <ChatRoom
          key={profileName}
          initialMessages={introMessages}
          bottomPromptMessage={introMessages[0]}
          storageKey={HEALTH_QNA_STORAGE_KEY}
          placeholder="메시지를 입력해 주세요."
          submitLabel="보내기"
          helpText="도움이 되셨나요?"
          ariaLabel="AI 건강 체크 채팅"
          inputAriaLabel="채팅 메시지"
          botName="AI 챗봇"
          botAvatarSrc={mascotImage}
          feedbackSelections={feedbackSelections}
          onChipSelect={handleChipSelect}
          onMessageSubmit={handleMessageSubmit}
          onActionSelect={handleActionSelect}
          onFeedbackSelect={handleFeedbackSelect}
        />
      </main>
    </>
  )
}

export default HealthQna
