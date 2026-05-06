type HeaderIconType = 'calendar' | 'notification' | 'search' | 'settings'

type HeaderIconProps = {
  type: HeaderIconType
}

function HeaderIcon({ type }: HeaderIconProps) {
  if (type === 'calendar') {
    return (
      <svg className="header_icon" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <rect x="4.75" y="5.75" width="18.5" height="17.5" rx="2.25" />
        <path d="M4.75 10.25h18.5" />
        <path d="M19.75 3.5v3" />
        <path d="M8.25 3.5v3" />
      </svg>
    )
  }

  if (type === 'search') {
    return (
      <svg className="header_icon" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <circle cx="12.25" cy="12.25" r="6.75" />
        <path d="m17.25 17.25 5.25 5.25" />
      </svg>
    )
  }

  if (type === 'settings') {
    return (
      <svg className="header_icon" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <path d="M16.1 3.2h-4.2l-.7 3.1a8.2 8.2 0 0 0-1.8.8L6.7 5.4 3.8 8.3l1.7 2.7a8.2 8.2 0 0 0-.8 1.8l-3.1.7v4.2l3.1.7c.2.6.5 1.2.8 1.8l-1.7 2.7 2.9 2.9 2.7-1.7c.6.3 1.2.6 1.8.8l.7 3.1h4.2l.7-3.1c.6-.2 1.2-.5 1.8-.8l2.7 1.7 2.9-2.9-1.7-2.7c.3-.6.6-1.2.8-1.8l3.1-.7v-4.2l-3.1-.7a8.2 8.2 0 0 0-.8-1.8l1.7-2.7-2.9-2.9-2.7 1.7a8.2 8.2 0 0 0-1.8-.8l-.7-3.1Z" />
        <circle cx="14" cy="15.6" r="4.6" />
      </svg>
    )
  }

  return (
    <svg className="header_icon" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path d="M18.65 20c0 2.57-2.08 4.65-4.65 4.65S9.35 22.57 9.35 20" />
      <path d="M14 4.55c2.1 0 4.1.9 5.55 2.45 1.3 1.4 2 4.05 2.43 6.75.34 2.12.58 4.25.72 5.5.06.58-.4 1.05-1 1.05H6.3c-.6 0-1.06-.47-1-1.05.14-1.25.38-3.38.72-5.5C6.45 11.05 7.15 8.4 8.45 7A7.55 7.55 0 0 1 14 4.55Z" />
    </svg>
  )
}

export default HeaderIcon
