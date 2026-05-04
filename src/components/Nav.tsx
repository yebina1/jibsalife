import type { CSSProperties } from 'react'
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

function NavIcon({ type, active }: { type: (typeof navItems)[number]['icon']; active: boolean }) {
  const className = active ? 'layout_nav_icon active' : 'layout_nav_icon'

  if (active && type === 'home') {
    return (
      <svg viewBox="0 0 28 28" className={className} aria-hidden="true">
        <circle cx="14" cy="14" r="11.2" fill="currentColor" opacity="0.14" />
        <circle cx="9.6" cy="10.3" r="1.9" fill="#ffffff" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="14" cy="8.6" r="1.9" fill="#ffffff" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="18.4" cy="10.3" r="1.9" fill="#ffffff" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="21.1" cy="14.4" r="1.9" fill="#ffffff" stroke="currentColor" strokeWidth="1.6" />
        <path
          d="M9.9 18.7c.7-2.5 2.5-4.3 4.6-4.3s3.9 1.8 4.6 4.3c.4 1.6-.8 2.9-2.3 2.3-.8-.3-1.3-.8-2.3-.8s-1.5.5-2.3.8c-1.5.6-2.8-.7-2.3-2.3Z"
          fill="#ffffff"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  if (active && type === 'health') {
    return (
      <svg viewBox="0 0 28 28" className={className} aria-hidden="true" fill="currentColor">
        <path d="M15 3C16.6569 3 18 4.34315 18 6V10H22C23.6569 10 25 11.3431 25 13V15C25 16.6569 23.6569 18 22 18H18V22C18 23.6569 16.6569 25 15 25H13C11.3431 25 10 23.6569 10 22V18H6C4.34315 18 3 16.6569 3 15V13C3 11.3431 4.34315 10 6 10H10V6C10 4.34315 11.3431 3 13 3H15Z" />
      </svg>
    )
  }

  if (active && type === 'community') {
    return (
      <svg viewBox="0 0 28 28" className={className} aria-hidden="true" fill="currentColor">
        <path d="M14 4.2c5.9 0 10.8 4.4 10.8 9.8 0 5.5-4.9 9.9-10.8 9.9-1.6 0-3.2-.3-4.6-.9L5 24.5l1.5-4.4c-1.5-1.7-2.3-3.8-2.3-6.1 0-5.4 4.9-9.8 10.8-9.8Z" />
        <circle cx="13.9999" cy="14" r="1.16667" fill="#ffffff" />
        <circle cx="18.6667" cy="14" r="1.16667" fill="#ffffff" />
        <circle cx="9.33342" cy="14" r="1.16667" fill="#ffffff" />
      </svg>
    )
  }

  if (active && type === 'mypage') {
    return (
      <svg viewBox="0 0 28 28" className={className} aria-hidden="true">
        <circle cx="14" cy="14" r="11.5" fill="currentColor" />
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
    if (active) {
      return (
        <svg
          viewBox="0 0 24 24"
          className={`${className} layout_nav_icon_place`}
          aria-hidden="true"
          fill="currentColor"
        >
          <path d="M12 3.6 19.2 18a1.5 1.5 0 0 1-2.1 2L12 17.2 6.9 20a1.5 1.5 0 0 1-2.1-2L12 3.6Z" />
        </svg>
      )
    }

    return (
      <svg
        viewBox="0 0 24 24"
        className={`${className} layout_nav_icon_place`}
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 4.2 18.7 18a1.45 1.45 0 0 1-2 1.9L12 17.3l-4.7 2.6a1.45 1.45 0 0 1-2-1.9L12 4.2Z" />
      </svg>
    )
  }

  const icon = navIconMap[type]

  return (
    <span
      className={`${className} layout_nav_icon_mask`}
      aria-hidden="true"
      style={{ '--layout-nav-icon-url': `url("${icon}")` } as CSSProperties}
    />
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
