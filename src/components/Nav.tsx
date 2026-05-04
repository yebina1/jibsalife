import { NavLink } from 'react-router'
import type { CSSProperties } from 'react'
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
  home: { active: navHomeIcon, inactive: navHomeOffIcon },
  health: { active: navHealthIcon, inactive: navHealthOffIcon },
  community: { active: navCommunicateIcon, inactive: navCommunicateOffIcon },
  mypage: { active: navMypageIcon, inactive: navMypageOffIcon },
} as const

const navIconAltMap = {
  home: '홈 아이콘',
  health: '건강 아이콘',
  community: '커뮤니티 아이콘',
  mypage: '마이페이지 아이콘',
} as const

function NavIcon({ type, active }: { type: (typeof navItems)[number]['icon']; active: boolean }) {
  const className = active ? 'layout_nav_icon active' : 'layout_nav_icon'

  if (type === 'place') {
    return (
      <svg
        viewBox="0 0 24 24"
        className={className}
        aria-hidden="true"
        fill={active ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 4.5 18.2 17a1.4 1.4 0 0 1-1.93 1.88L12 16.6l-4.27 2.28A1.4 1.4 0 0 1 5.8 17L12 4.5Z" />
      </svg>
    )
  }

  const icon = active ? navIconMap[type].active : navIconMap[type].inactive
  const iconStyle = active
    ? ({ '--layout-nav-icon-url': `url("${icon}")` } as CSSProperties)
    : undefined

  if (active) {
    return (
      <span
        className={`${className} layout_nav_icon_mask`}
        style={iconStyle}
        aria-hidden="true"
      />
    )
  }

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
