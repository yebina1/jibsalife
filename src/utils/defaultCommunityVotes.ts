export type DefaultCommunityVoteSelections = Record<number, number>

let defaultCommunityVoteSelections: DefaultCommunityVoteSelections = {}

export function readDefaultCommunityVotes(): DefaultCommunityVoteSelections {
  return defaultCommunityVoteSelections
}

export function writeDefaultCommunityVotes(selections: DefaultCommunityVoteSelections): void {
  defaultCommunityVoteSelections = selections
}
