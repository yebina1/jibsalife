import type { CSSProperties } from 'react'
import { NavLink } from 'react-router'
import navCommunicateIcon from '../svg/nav communicate.svg'
import navCommunicateOffIcon from '../svg/nav communicate off.svg'
import navHealthIcon from '../svg/nav health.svg'
import navHealthOffIcon from '../svg/nav health off.svg'
import navHomeIcon from '../svg/nav home.svg'
import navHomeOffIcon from '../svg/nav home off.svg'
import navMypageIcon from '../svg/nav mypage.svg'
import navMypageOffIcon from '../svg/nav mypage off.svg'

const navItems = [
  { path: '/health', label: '건강', icon: 'health' },
  { path: '/community', label: '커뮤니티', icon: 'community' },
  { path: '/home', label: '홈', icon: 'home' },
  { path: '/place', label: '장소', icon: 'place' },
  { path: '/mypage', label: '마이페이지', icon: 'mypage' },
] as const

const navIconMap = {
  home: {
    active: navHomeIcon,
    inactive: navHomeOffIcon,
  },
  health: {
    active: navHealthIcon,
    inactive: navHealthOffIcon,
  },
  community: {
    active: navCommunicateIcon,
    inactive: navCommunicateOffIcon,
  },
  mypage: {
    active: navMypageIcon,
    inactive: navMypageOffIcon,
  },
} as const

function NavIcon({ type, active }: { type: (typeof navItems)[number]['icon']; active: boolean }) {
  const className = active ? 'layout_nav_icon active' : 'layout_nav_icon'

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

  const icon = active ? navIconMap[type].active : navIconMap[type].inactive

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
