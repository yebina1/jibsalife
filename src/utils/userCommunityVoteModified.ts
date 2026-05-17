const KEY = 'jibsalife.community.modifiedVoteIds'

export function readModifiedVoteIds(): number[] {
  try {
    const raw = localStorage.getItem(KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed.filter((v): v is number => typeof v === 'number') : []
  } catch {
    return []
  }
}

export function writeModifiedVoteId(voteId: number): void {
  try {
    const current = readModifiedVoteIds()
    if (!current.includes(voteId)) {
      localStorage.setItem(KEY, JSON.stringify([...current, voteId]))
    }
  } catch { /* noop */ }
}
