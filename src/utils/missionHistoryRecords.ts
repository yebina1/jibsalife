import type { MissionActivityRecord } from './missionActivityRecords'

export type MissionHistoryRecord = {
  id: number
  title: string
  detail: string
  time: string
  color: string
  date: string
  source?: 'chat'
}

export const MISSION_HISTORY_RECORDS_STORAGE_KEY = 'jibsalife.mission.historyRecords'

export const DEFAULT_MISSION_HISTORY_RECORDS: MissionHistoryRecord[] = [
  { id: 101, title: '식사 기록', detail: '간식 2개', time: '10:30', color: '#ffd1a8', date: '2026-05-01' },
  { id: 102, title: '활동 기록', detail: '산책 20분', time: '18:40', color: '#428fe6', date: '2026-05-02' },
  { id: 106, title: '식사 기록', detail: '사료 55g', time: '08:20', color: '#ffd1a8', date: '2026-05-02' },
  { id: 103, title: '배변 기록', detail: '배변 실수', time: '09:15', color: '#527ca3', date: '2026-05-03' },
  { id: 107, title: '증상 기록', detail: '재채기', time: '14:10', color: '#b9dfe3', date: '2026-05-03' },
  { id: 104, title: '증상 기록', detail: '가려움', time: '21:05', color: '#b9dfe3', date: '2026-05-04' },
  { id: 105, title: '식사 기록', detail: '밥 80g', time: '07:50', color: '#ffd1a8', date: '2026-05-05' },
  { id: 1, title: '식사 기록', detail: '사료 60g', time: '08:00', color: '#ffd1a8', date: '2026-05-06' },
  { id: 2, title: '활동 기록', detail: '산책 30분', time: '19:20', color: '#428fe6', date: '2026-05-06' },
  { id: 3, title: '증상 기록', detail: '헐떡', time: '18:10', color: '#b9dfe3', date: '2026-05-06' },
]

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

export function readStoredMissionHistoryRecords() {
  if (typeof window === 'undefined') return []

  try {
    const savedValue = window.localStorage.getItem(MISSION_HISTORY_RECORDS_STORAGE_KEY)
    if (!savedValue) return []

    const parsedValue = JSON.parse(savedValue)
    if (!Array.isArray(parsedValue)) return []

    return parsedValue.filter(isMissionHistoryRecord)
  } catch {
    return []
  }
}

export function readMissionHistoryRecordsWithDefaults() {
  const storedRecords = readStoredMissionHistoryRecords()

  return storedRecords.length > 0 ? storedRecords : DEFAULT_MISSION_HISTORY_RECORDS
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
