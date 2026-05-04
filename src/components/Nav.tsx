import { NavLink } from 'react-router'
import navCommunicateOffIcon from '../svg/nav communicate off.svg'
import navHealthOffIcon from '../svg/nav health off.svg'
import navHomeOffIcon from '../svg/nav home off.svg'
import navMypageOffIcon from '../svg/nav mypage off.svg'

const navItems = [
  { path: '/health', label: '건강', icon: 'health' },
  { path: '/community', label: '커뮤니티', icon: 'community' },
  { path: '/home', label: '홈', icon: 'home' },
  { path: '/place', label: '장소', icon: 'place' },
  { path: '/mypage', label: '마이페이지', icon: 'mypage' },
] as const

const navIconMap = {
  home: navHomeOffIcon,
  health: navHealthOffIcon,
  community: navCommunicateOffIcon,
  mypage: navMypageOffIcon,
} as const

const navIconAltMap = {
  home: '홈 아이콘',
  health: '건강 아이콘',
  community: '커뮤니티 아이콘',
  mypage: '마이페이지 아이콘',
} as const

function NavIcon({ type, active }: { type: (typeof navItems)[number]['icon']; active: boolean }) {
  const className = active ? 'layout_nav_icon active' : 'layout_nav_icon'

  if (active && type === 'home') {
    return (
      <svg viewBox="0 0 28 28" className={className} aria-hidden="true">
        <ellipse cx="9.2" cy="9" rx="2.1" ry="3" transform="rotate(-22 9.2 9)" />
        <ellipse cx="13" cy="7.2" rx="2.2" ry="3.2" />
        <ellipse cx="17" cy="7.2" rx="2.2" ry="3.2" />
        <ellipse cx="20.8" cy="9" rx="2.1" ry="3" transform="rotate(22 20.8 9)" />
        <path d="M8.2 18.2c0-3.8 3.5-7 6.8-7s6.8 3.2 6.8 7c0 2.1-1.6 3.5-3.6 3.5-1.3 0-2.1-.6-3.2-.6s-1.9.6-3.2.6c-2 0-3.6-1.4-3.6-3.5Z" />
      </svg>
    )
  }

  if (active && type === 'health') {
    return (
      <svg viewBox="0 0 28 28" className={className} aria-hidden="true">
        <path d="M15.2 3.5a2.2 2.2 0 0 1 2.2 2.2v5h5a2.2 2.2 0 0 1 2.2 2.2v2.2a2.2 2.2 0 0 1-2.2 2.2h-5v5a2.2 2.2 0 0 1-2.2 2.2H13a2.2 2.2 0 0 1-2.2-2.2v-5h-5a2.2 2.2 0 0 1-2.2-2.2v-2.2a2.2 2.2 0 0 1 2.2-2.2h5v-5A2.2 2.2 0 0 1 13 3.5h2.2Z" />
      </svg>
    )
  }

  if (active && type === 'community') {
    return (
      <svg viewBox="0 0 28 28" className={className} aria-hidden="true">
        <path d="M14 3.7c6 0 10.9 4.4 10.9 9.9s-4.9 9.9-10.9 9.9c-1.7 0-3.3-.3-4.7-1L4.8 24c-.6.2-1.1-.4-.9-.9l1.4-4.2a9 9 0 0 1-2.2-5.3c0-5.5 4.9-9.9 10.9-9.9Z" />
        <circle cx="9.7" cy="13.8" r="1.1" fill="#ffffff" />
        <circle cx="14" cy="13.8" r="1.1" fill="#ffffff" />
        <circle cx="18.3" cy="13.8" r="1.1" fill="#ffffff" />
      </svg>
    )
  }

  if (active && type === 'mypage') {
    return (
      <svg viewBox="0 0 28 28" className={className} aria-hidden="true">
        <circle cx="14" cy="14" r="11.5" />
        <circle cx="14" cy="10.8" r="3.1" fill="#ffffff" />
        <path
          d="M5.6 21.4c1.8-3.3 4.8-5.2 8.4-5.2s6.6 1.9 8.4 5.2"
          fill="none"
          stroke="#ffffff"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </svg>
    )
  }

  if (type === 'place') {
    return (
      <svg
        viewBox="0 0 24 24"
        className={`${className} layout_nav_icon_place`}
        aria-hidden="true"
        fill={active ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={active ? '1.8' : '1.5'}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 4.2 18.7 18a1.45 1.45 0 0 1-2 1.9L12 17.3l-4.7 2.6a1.45 1.45 0 0 1-2-1.9L12 4.2Z" />
      </svg>
    )
  }

  const icon = navIconMap[type]

  return <img src={icon} className={className} alt={navIconAltMap[type]} />
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
