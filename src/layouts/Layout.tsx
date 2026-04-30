import { NavLink, Outlet } from 'react-router'

const navItems = [
  { path: '/home', label: '홈' },
  { path: '/health', label: '건강' },
  { path: '/community', label: '커뮤니티' },
  { path: '/mypage', label: '마이페이지' },
]

function Layout() {
  return (
    <div className="layout">
      <nav className="layout-nav" aria-label="주요 메뉴">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive ? 'layout-nav-link active' : 'layout-nav-link'
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <Outlet />
    </div>
  )
}

export default Layout
