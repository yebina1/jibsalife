export const PROFILE_POINTS_STORAGE_KEY = 'profile-points'
export const COMMUNITY_VOTE_REWARD_CLAIMED_KEY = 'community-vote-reward-claimed'
export const DEFAULT_PROFILE_POINTS = 1200
export const COMMUNITY_VOTE_REWARD_POINTS = 60

export function formatProfilePoints(points: number) {
  return `${points.toLocaleString()}P`
}

export function readProfilePoints() {
  const savedPoints = window.localStorage.getItem(PROFILE_POINTS_STORAGE_KEY)
  const parsedPoints = savedPoints ? Number(savedPoints) : DEFAULT_PROFILE_POINTS

  return Number.isFinite(parsedPoints) ? parsedPoints : DEFAULT_PROFILE_POINTS
}

export function writeProfilePoints(points: number) {
  window.localStorage.setItem(PROFILE_POINTS_STORAGE_KEY, String(points))
  window.dispatchEvent(new CustomEvent('profile-points-change', { detail: points }))
}

export function readCommunityVoteRewardClaimed() {
  return window.localStorage.getItem(COMMUNITY_VOTE_REWARD_CLAIMED_KEY) === 'true'
}

export function writeCommunityVoteRewardClaimed() {
  window.localStorage.setItem(COMMUNITY_VOTE_REWARD_CLAIMED_KEY, 'true')
}
