import { readMissionActivityRecords } from './missionActivityRecords'
import { readVotedMissionIds } from './communityVoteStatus'

export const CHALLENGE_STATUS_CHANGED_EVENT = 'challenge-status-changed'

function todayKey() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

function dispatch() {
  window.dispatchEvent(new CustomEvent(CHALLENGE_STATUS_CHANGED_EVENT))
}

// Day 1 (index 0): 산책 기록 — activityRecords에 오늘 '활동 기록' 존재
function checkDay0(): boolean {
  const t = todayKey()
  return readMissionActivityRecords().some((r) => r.title === '활동 기록' && r.date === t)
}

// Day 2 (index 1): 댓글 3회 이상 — comment count 별도 키로 추적
const COMMENT_COUNT_KEY = 'jibsalife.challenge.commentCount'

export function incrementChallengeCommentCount() {
  if (typeof window === 'undefined') return
  const t = todayKey()
  let count = 0
  try {
    const stored = window.localStorage.getItem(COMMENT_COUNT_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (parsed.date === t) count = parsed.count
    }
  } catch { /* noop */ }
  window.localStorage.setItem(COMMENT_COUNT_KEY, JSON.stringify({ date: t, count: count + 1 }))
  dispatch()
}

function checkDay1(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const stored = window.localStorage.getItem(COMMENT_COUNT_KEY)
    if (!stored) return false
    const parsed = JSON.parse(stored)
    return parsed.date === todayKey() && parsed.count >= 3
  } catch { return false }
}

// Day 3 (index 2): 투표 참여 — votedMissionIds 존재
function checkDay2(): boolean {
  return readVotedMissionIds().length > 0
}

// Day 4 (index 3): 건강 리포트 확인 — HealthReport.tsx 작업 완료 후 markHealthReportViewed() 연결 예정
const HEALTH_REPORT_KEY = 'jibsalife.challenge.healthReportViewed'

export function markHealthReportViewed() {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(HEALTH_REPORT_KEY, todayKey())
  dispatch()
}

function checkDay3(): boolean {
  if (typeof window === 'undefined') return false
  return window.localStorage.getItem(HEALTH_REPORT_KEY) === todayKey()
}

// Day 5 (index 4): 반려상식 좋아요 1개 이상
const KNOWLEDGE_LIKED_KEY = 'jibsalife.challenge.knowledgeLiked'

export function markKnowledgeLiked() {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(KNOWLEDGE_LIKED_KEY, 'true')
  dispatch()
}

function checkDay4(): boolean {
  if (typeof window === 'undefined') return false
  return window.localStorage.getItem(KNOWLEDGE_LIKED_KEY) === 'true'
}

// Day 6 (index 5): 체중 기록 — HealthRegister.tsx 작업 완료 후 markWeightRecorded() 연결 예정
const WEIGHT_RECORDED_KEY = 'jibsalife.challenge.weightRecorded'

export function markWeightRecorded() {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(WEIGHT_RECORDED_KEY, todayKey())
  dispatch()
}

function checkDay5(): boolean {
  if (typeof window === 'undefined') return false
  return window.localStorage.getItem(WEIGHT_RECORDED_KEY) === todayKey()
}

// Day 7 (index 6): 게시글 작성 — createdPosts 존재
function checkDay6(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const stored = window.localStorage.getItem('jibsalife.community.createdPosts')
    if (!stored) return false
    const posts = JSON.parse(stored)
    return Array.isArray(posts) && posts.length > 0
  } catch { return false }
}

const checks = [checkDay0, checkDay1, checkDay2, checkDay3, checkDay4, checkDay5, checkDay6]

export function checkChallengeDayDone(dayIndex: number): boolean {
  return checks[dayIndex]?.() ?? false
}
