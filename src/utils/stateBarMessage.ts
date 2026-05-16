export const STATE_BAR_MESSAGE_EVENT = 'state-bar-message'

export type StateBarMessagePlacement = 'footer' | 'notification' | 'sheet'

export type StateBarMessageDetail = {
  message: string
  duration?: number
  placement?: StateBarMessagePlacement
  closeButton?: boolean
  actionLabel?: string
  onAction?: () => void
}

export type StateBarMessageOptions = {
  placement?: StateBarMessagePlacement
  closeButton?: boolean
  actionLabel?: string
  onAction?: () => void
}

export function showStateBarMessage(
  message: string,
  duration = 3000,
  options: StateBarMessageOptions = {},
) {
  if (typeof window === 'undefined') return

  window.dispatchEvent(
    new CustomEvent<StateBarMessageDetail>(STATE_BAR_MESSAGE_EVENT, {
      detail: {
        message,
        duration,
        placement: options.placement,
        closeButton: options.closeButton,
        actionLabel: options.actionLabel,
        onAction: options.onAction,
      },
    }),
  )
}
