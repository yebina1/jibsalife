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
  { path: '/home', label: '홈', icon: 'home' },
  { path: '/health', label: '건강', icon: 'health' },
  { path: '/community', label: '커뮤니티', icon: 'community' },
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
  const icon = active ? navIconMap[type].active : navIconMap[type].inactive

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
