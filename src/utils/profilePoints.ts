import { AUTH_CURRENT_USER_STORAGE_KEY, isDemoAccount } from './authAccounts'

export const PROFILE_POINTS_STORAGE_KEY = 'profile-points'
export const COMMUNITY_VOTE_REWARD_CLAIMED_KEY = 'community-vote-reward-claimed'
export const DEFAULT_PROFILE_POINTS = 1200
export const DEFAULT_SIGNUP_PROFILE_POINTS = 0
export const COMMUNITY_VOTE_REWARD_POINTS = 60

export function formatProfilePoints(points: number) {
  return `${points.toLocaleString()}P`
}

function getCurrentUserId() {
  return window.localStorage.getItem(AUTH_CURRENT_USER_STORAGE_KEY)
}

function getProfilePointsStorageKey() {
  const currentUserId = getCurrentUserId()
  return currentUserId ? `${PROFILE_POINTS_STORAGE_KEY}.${currentUserId}` : PROFILE_POINTS_STORAGE_KEY
}

function getDefaultProfilePoints() {
  return isDemoAccount(getCurrentUserId()) ? DEFAULT_PROFILE_POINTS : DEFAULT_SIGNUP_PROFILE_POINTS
}

export function readProfilePoints() {
  const storageKey = getProfilePointsStorageKey()
  const savedPoints = window.localStorage.getItem(storageKey)
  const defaultPoints = getDefaultProfilePoints()
  const parsedPoints = savedPoints ? Number(savedPoints) : defaultPoints

  return Number.isFinite(parsedPoints) ? parsedPoints : defaultPoints
}

export function writeProfilePoints(points: number) {
  window.localStorage.setItem(getProfilePointsStorageKey(), String(points))
  window.dispatchEvent(new CustomEvent('profile-points-change', { detail: points }))
}

export function readCommunityVoteRewardClaimed() {
  return window.localStorage.getItem(COMMUNITY_VOTE_REWARD_CLAIMED_KEY) === 'true'
}

export function writeCommunityVoteRewardClaimed() {
  window.localStorage.setItem(COMMUNITY_VOTE_REWARD_CLAIMED_KEY, 'true')
}
