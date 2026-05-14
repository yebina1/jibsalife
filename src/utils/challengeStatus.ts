import { readVotedMissionIds } from './communityVoteStatus'

export const CHALLENGE_STATUS_CHANGED_EVENT = 'challenge-status-changed'

function todayKey() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

function dispatch() {
  window.dispatchEvent(new CustomEvent(CHALLENGE_STATUS_CHANGED_EVENT))
}

// Day 1 (index 0): 산책 기록
const WALK_RECORDED_KEY = 'jibsalife.challenge.walkRecorded'

export function markWalkRecorded() {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(WALK_RECORDED_KEY, 'true')
  dispatch()
}

function checkDay0(): boolean {
  if (typeof window === 'undefined') return false
  return window.localStorage.getItem(WALK_RECORDED_KEY) === 'true'
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

// Day 6 (index 5): 식사량 기록
const MEAL_RECORDED_KEY = 'jibsalife.challenge.mealRecorded'

export function markMealRecorded() {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(MEAL_RECORDED_KEY, 'true')
  dispatch()
}

function checkDay5(): boolean {
  if (typeof window === 'undefined') return false
  return window.localStorage.getItem(MEAL_RECORDED_KEY) === 'true'
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
const PARTICIPATED_DAYS_KEY = 'jibsalife.challenge.participatedDays'

export function calculateChallengeRewardPoints(): number {
  const currentDay = getCurrentChallengeDay()
  try {
    const stored = typeof window !== 'undefined' ? window.localStorage.getItem(PARTICIPATED_DAYS_KEY) : null
    const claimed: Set<number> = stored ? new Set(JSON.parse(stored)) : new Set()
    let consecutive = 0
    for (let i = currentDay - 1; i >= 0; i--) {
      if (claimed.has(i)) consecutive++
      else break
    }
    const completingDay = consecutive + 1
    if (completingDay === 7) return 360
    if (completingDay === 3) return 160
  } catch { /* noop */ }
  return 60
}

export function claimChallengeDay(day: number) {
  if (typeof window === 'undefined') return
  try {
    const stored = window.localStorage.getItem(PARTICIPATED_DAYS_KEY)
    const claimed: number[] = stored ? JSON.parse(stored) : []
    if (!claimed.includes(day)) {
      window.localStorage.setItem(PARTICIPATED_DAYS_KEY, JSON.stringify([...claimed, day]))
    }
  } catch { /* noop */ }
}

export function getCurrentChallengeDay(): number {
  try {
    const stored = typeof window !== 'undefined' ? window.localStorage.getItem(PARTICIPATED_DAYS_KEY) : null
    const claimed: Set<number> = stored ? new Set(JSON.parse(stored)) : new Set()
    for (let i = 0; i < checks.length; i++) {
      if (!claimed.has(i)) return i
    }
  } catch { /* noop */ }
  return checks.length
}

export function checkChallengeDayDone(dayIndex: number): boolean {
  return checks[dayIndex]?.() ?? false
}
