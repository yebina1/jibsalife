const DEFAULT_COMMUNITY_VOTES_KEY = 'jibsalife.community.defaultVotes'

export type DefaultCommunityVoteSelections = Record<number, number>

export function readDefaultCommunityVotes(): DefaultCommunityVoteSelections {
  try {
    const raw = localStorage.getItem(DEFAULT_COMMUNITY_VOTES_KEY)
    return raw ? (JSON.parse(raw) as DefaultCommunityVoteSelections) : {}
  } catch {
    return {}
  }
}

export function writeDefaultCommunityVotes(selections: DefaultCommunityVoteSelections): void {
  try {
    localStorage.setItem(DEFAULT_COMMUNITY_VOTES_KEY, JSON.stringify(selections))
  } catch { /* noop */ }
}
