export const STATE_BAR_MESSAGE_EVENT = 'state-bar-message'

export type StateBarMessageDetail = {
  message: string
  duration?: number
}

export function showStateBarMessage(message: string, duration = 2200) {
  if (typeof window === 'undefined') return

  window.dispatchEvent(
    new CustomEvent<StateBarMessageDetail>(STATE_BAR_MESSAGE_EVENT, {
      detail: { message, duration },
    }),
  )
}
