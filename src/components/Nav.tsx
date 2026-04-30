import { NavLink } from 'react-router'

const navItems = [
  { path: '/home', label: '홈' },
  { path: '/health', label: '건강' },
  { path: '/community', label: '커뮤니티' },
  { path: '/mypage', label: '마이페이지' },
]

function Nav() {
  return (
    <nav className="layout_nav" aria-label="주요 메뉴">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            isActive ? 'layout_nav_link active' : 'layout_nav_link'
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}

export default Nav
