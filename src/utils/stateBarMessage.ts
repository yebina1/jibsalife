export const STATE_BAR_MESSAGE_EVENT = 'state-bar-message'

export type StateBarMessagePlacement = 'footer' | 'notification' | 'sheet'

export type StateBarMessageDetail = {
  message: string
  duration?: number
  placement?: StateBarMessagePlacement
}

export type StateBarMessageOptions = {
  placement?: StateBarMessagePlacement
}

export function showStateBarMessage(
  message: string,
  duration = 2200,
  options: StateBarMessageOptions = {},
) {
  if (typeof window === 'undefined') return

  window.dispatchEvent(
    new CustomEvent<StateBarMessageDetail>(STATE_BAR_MESSAGE_EVENT, {
      detail: { message, duration, placement: options.placement },
    }),
  )
}
