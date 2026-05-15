export type AuthAccount = {
  id: string
  password: string
  petType?: 'dog' | 'cat' | null
  petName?: string
  createdAt: string
}

const AUTH_ACCOUNTS_STORAGE_KEY = 'jibsalife.auth.accounts'
export const AUTH_LOGGED_IN_STORAGE_KEY = 'jibsalife.auth.loggedIn'
export const AUTH_CURRENT_USER_STORAGE_KEY = 'jibsalife.auth.currentUser'

const demoAccount: AuthAccount = {
  id: 'hello@jipsa.app',
  password: '123456',
  createdAt: 'demo',
}

function normalizeId(id: string) {
  return id.trim().toLowerCase()
}

export function readAuthAccounts() {
  if (typeof window === 'undefined') {
    return [demoAccount]
  }

  const savedValue = window.localStorage.getItem(AUTH_ACCOUNTS_STORAGE_KEY)
  if (!savedValue) {
    return [demoAccount]
  }

  try {
    const parsedValue = JSON.parse(savedValue) as Partial<AuthAccount>[]
    const savedAccounts = parsedValue
      .filter((account): account is AuthAccount =>
        typeof account.id === 'string' &&
        typeof account.password === 'string' &&
        typeof account.createdAt === 'string',
      )
      .map((account) => ({
        ...account,
        id: normalizeId(account.id),
      }))

    return [demoAccount, ...savedAccounts.filter((account) => account.id !== demoAccount.id)]
  } catch {
    return [demoAccount]
  }
}

export function hasAuthAccount(id: string) {
  const normalizedId = normalizeId(id)
  return readAuthAccounts().some((account) => account.id === normalizedId)
}

export function saveAuthAccount(account: Omit<AuthAccount, 'id' | 'createdAt'> & { id: string }) {
  if (typeof window === 'undefined') {
    return
  }

  const normalizedId = normalizeId(account.id)
  const nextAccount: AuthAccount = {
    ...account,
    id: normalizedId,
    createdAt: new Date().toISOString(),
  }
  const nextAccounts = [
    nextAccount,
    ...readAuthAccounts().filter((savedAccount) => (
      savedAccount.id !== normalizedId && savedAccount.id !== demoAccount.id
    )),
  ]

  window.localStorage.setItem(AUTH_ACCOUNTS_STORAGE_KEY, JSON.stringify(nextAccounts))
}

export function findAuthAccount(id: string, password: string) {
  const normalizedId = normalizeId(id)
  return readAuthAccounts().find((account) => (
    account.id === normalizedId && account.password === password
  ))
}

export function markLoggedIn(account: AuthAccount) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(AUTH_LOGGED_IN_STORAGE_KEY, 'true')
  window.localStorage.setItem(AUTH_CURRENT_USER_STORAGE_KEY, account.id)
}
