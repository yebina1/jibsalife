import type { MissionActivityRecord } from './missionActivityRecords'

export type MissionHistoryRecord = {
  id: number
  title: string
  detail: string
  time: string
  color: string
  date: string
  source?: 'chat' | 'health'
  media?: {
    type: 'image'
    src: string
    label?: string
  }[]
}

export const MISSION_HISTORY_RECORDS_STORAGE_KEY = 'jibsalife.mission.historyRecords'
export const MISSION_HISTORY_RECORDS_CHANGE_EVENT = 'mission-history-records-change'
const HEALTH_CHECK_TITLE = '건강 체크 기록'
const HEALTH_CHECK_COLOR = '#A08DFF'

export const DEFAULT_MISSION_HISTORY_RECORDS: MissionHistoryRecord[] = [
  { id: 101, title: '식사 기록', detail: '사료 90g', time: '08:00', color: '#F2B472', date: '2026-05-01' },
  { id: 102, title: '활동 기록', detail: '활발함', time: '13:20', color: '#162447', date: '2026-05-01' },
  { id: 103, title: '산책 기록', detail: '산책 30분', time: '18:40', color: '#A4CE95', date: '2026-05-02' },
  { id: 104, title: '식사 기록', detail: '사료 90g', time: '08:20', color: '#F2B472', date: '2026-05-02' },
  { id: 105, title: '배변 · 배뇨 기록', detail: '정상 변', time: '09:15', color: '#BEE3F8', date: '2026-05-03' },
  { id: 106, title: '배변 · 배뇨 기록', detail: '소변 잦음', time: '16:30', color: '#BEE3F8', date: '2026-05-03' },
  { id: 107, title: '증상 기록', detail: '기침', time: '14:10', color: '#A28BFA', date: '2026-05-04' },
  { id: 108, title: '활동 기록', detail: '보통', time: '17:45', color: '#162447', date: '2026-05-04' },
  { id: 109, title: '식사 기록', detail: '사료 90g', time: '07:50', color: '#F2B472', date: '2026-05-05' },
  { id: 110, title: '증상 기록', detail: '헐떡', time: '18:10', color: '#A28BFA', date: '2026-05-05' },
  { id: 111, title: '활동 기록', detail: '활동 적음', time: '16:46', color: '#162447', date: '2026-05-06' },
  { id: 112, title: '산책 기록', detail: '산책 30분', time: '19:20', color: '#A4CE95', date: '2026-05-06' },
  { id: 113, title: '배변 · 배뇨 기록', detail: '묽은 변', time: '08:40', color: '#BEE3F8', date: '2026-05-12' },
  { id: 114, title: '증상 기록', detail: '무기력', time: '19:36', color: '#A28BFA', date: '2026-05-12' },
  { id: 115, title: '배변 · 배뇨 기록', detail: '평소와 다름', time: '10:10', color: '#BEE3F8', date: '2026-05-13' },
  { id: 116, title: '식사 기록', detail: '사료 90g', time: '16:00', color: '#F2B472', date: '2026-05-13' },
]

const DEFAULT_MISSION_HISTORY_RECORD_IDS = new Set(
  DEFAULT_MISSION_HISTORY_RECORDS.map((record) => record.id),
)
const DEFAULT_MISSION_HISTORY_RECORD_MAP = new Map(
  DEFAULT_MISSION_HISTORY_RECORDS.map((record) => [record.id, record]),
)
const LEGACY_DEFAULT_MISSION_HISTORY_RECORD_IDS = new Set([
  1,
  2,
  3,
  101,
  102,
  103,
  104,
  105,
  106,
  107,
])
const LEGACY_DEFAULT_MISSION_HISTORY_COLORS = new Set([
  '#ffd1a8',
  '#428fe6',
  '#527ca3',
  '#b9dfe3',
])

function isMissionHistoryRecord(record: unknown): record is MissionHistoryRecord {
  if (!record || typeof record !== 'object') return false

  const candidate = record as Partial<MissionHistoryRecord>

  return (
    typeof candidate.id === 'number' &&
    typeof candidate.title === 'string' &&
    typeof candidate.detail === 'string' &&
    typeof candidate.time === 'string' &&
    typeof candidate.color === 'string' &&
    typeof candidate.date === 'string'
  )
}

function normalizeMissionHistoryRecord(record: MissionHistoryRecord): MissionHistoryRecord {
  if (record.source === 'health' || record.title === HEALTH_CHECK_TITLE) {
    const recordWithoutMedia = { ...record }
    delete recordWithoutMedia.media

    return {
      ...recordWithoutMedia,
      title: HEALTH_CHECK_TITLE,
      detail: 'AI 건강 기록',
      source: 'health',
    }
  }

  return record
}

export function readStoredMissionHistoryRecords() {
  if (typeof window === 'undefined') return []

  try {
    const savedValue = window.localStorage.getItem(MISSION_HISTORY_RECORDS_STORAGE_KEY)
    if (!savedValue) return []

    const parsedValue = JSON.parse(savedValue)
    if (!Array.isArray(parsedValue)) return []

    return parsedValue.filter(isMissionHistoryRecord).map(normalizeMissionHistoryRecord)
  } catch {
    return []
  }
}

export function readMissionHistoryRecordsWithDefaults() {
  const storedRecords = readStoredMissionHistoryRecords()

  if (storedRecords.length === 0) return DEFAULT_MISSION_HISTORY_RECORDS

  const hasCurrentDefaults = storedRecords.some((record) =>
    DEFAULT_MISSION_HISTORY_RECORD_IDS.has(record.id)
  )
  const hasLegacyDefaults = storedRecords.some((record) =>
    LEGACY_DEFAULT_MISSION_HISTORY_RECORD_IDS.has(record.id) &&
    LEGACY_DEFAULT_MISSION_HISTORY_COLORS.has(record.color.toLowerCase())
  )

  if (!hasCurrentDefaults && hasLegacyDefaults) {
    const customRecords = storedRecords.filter(
      (record) => !LEGACY_DEFAULT_MISSION_HISTORY_RECORD_IDS.has(record.id),
    )

    return [...DEFAULT_MISSION_HISTORY_RECORDS, ...customRecords]
  }

  return storedRecords.map((record) =>
    DEFAULT_MISSION_HISTORY_RECORD_MAP.get(record.id) ?? record
  )
}

export function writeStoredMissionHistoryRecords(records: MissionHistoryRecord[]) {
  if (typeof window === 'undefined') return

  window.localStorage.setItem(
    MISSION_HISTORY_RECORDS_STORAGE_KEY,
    JSON.stringify(records.filter((record) => record.source !== 'chat')),
  )
}

export function toMissionHistoryRecord(record: MissionActivityRecord): MissionHistoryRecord {
  return record
}

function getTodayDateKey() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

function getCurrentTime() {
  const now = new Date()
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
}

export function writeHealthCheckMissionHistoryRecord(
  detail: string,
  media: MissionHistoryRecord['media'] = [],
) {
  if (typeof window === 'undefined') return null

  const nextRecord: MissionHistoryRecord = {
    id: Date.now(),
    title: HEALTH_CHECK_TITLE,
    detail,
    time: getCurrentTime(),
    color: HEALTH_CHECK_COLOR,
    date: getTodayDateKey(),
    source: 'health',
    media,
  }
  const nextRecords = [nextRecord, ...readMissionHistoryRecordsWithDefaults()].slice(0, 120)

  window.localStorage.setItem(MISSION_HISTORY_RECORDS_STORAGE_KEY, JSON.stringify(nextRecords))
  window.dispatchEvent(new CustomEvent(MISSION_HISTORY_RECORDS_CHANGE_EVENT, { detail: nextRecord }))

  return nextRecord
}
