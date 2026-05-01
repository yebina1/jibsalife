import { NavLink } from 'react-router'

const navItems = [
  { path: '/home', label: '홈', icon: 'home' },
  { path: '/health', label: '건강', icon: 'health' },
  { path: '/community', label: '커뮤니티', icon: 'community' },
  { path: '/mypage', label: '마이페이지', icon: 'mypage' },
] as const

function NavIcon({ type, active }: { type: (typeof navItems)[number]['icon']; active: boolean }) {
  const className = active ? 'layout_nav_icon active' : 'layout_nav_icon'

  if (type === 'health') {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <path d="M10.5 4a1 1 0 0 1 1 1v5.5H17a1 1 0 1 1 0 2h-5.5V18a1 1 0 1 1-2 0v-5.5H4a1 1 0 1 1 0-2h5.5V5a1 1 0 0 1 1-1Z" />
      </svg>
    )
  }

  if (type === 'community') {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <path d="M12 4c4.4 0 8 2.9 8 6.5S16.4 17 12 17c-.7 0-1.4-.1-2-.2L5.8 19a.8.8 0 0 1-1.2-.7v-2.7C3 14.4 2 12.6 2 10.5 2 6.9 5.6 4 10 4Zm-4 6a1.1 1.1 0 1 0 1.1 1.1A1.1 1.1 0 0 0 8 10Zm4 0a1.1 1.1 0 1 0 1.1 1.1A1.1 1.1 0 0 0 12 10Zm4 0a1.1 1.1 0 1 0 1.1 1.1A1.1 1.1 0 0 0 16 10Z" />
      </svg>
    )
  }

  if (type === 'home') {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <path d="M7 10.5a2.5 2.5 0 1 1 2.5-2.5A2.5 2.5 0 0 1 7 10.5Zm10 0a2.5 2.5 0 1 1 2.5-2.5A2.5 2.5 0 0 1 17 10.5ZM4.5 15.5A2.5 2.5 0 1 1 7 13a2.5 2.5 0 0 1-2.5 2.5Zm15 0A2.5 2.5 0 1 1 22 13a2.5 2.5 0 0 1-2.5 2.5ZM12 13c-3 0-5.5 2.2-5.5 4.8 0 1.6 1.2 2.7 2.8 2.7 1.1 0 1.9-.5 2.7-1 .8.5 1.6 1 2.7 1 1.6 0 2.8-1.1 2.8-2.7C17.5 15.2 15 13 12 13Z" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M12 4a6 6 0 1 1-6 6 6 6 0 0 1 6-6Zm0 10.2c-4.4 0-8 2.8-8 6.3a.9.9 0 0 0 .9.9h14.2a.9.9 0 0 0 .9-.9c0-3.5-3.6-6.3-8-6.3Z" />
    </svg>
  )
}

function Nav() {
  return (
    <nav className="layout_nav" aria-label="주요 메뉴">
      <div className="layout_nav_inner">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive ? 'layout_nav_link active' : 'layout_nav_link'
            }
          >
            {({ isActive }) => (
              <>
                <NavIcon type={item.icon} active={isActive} />
                <span className="layout_nav_label">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export default Nav
