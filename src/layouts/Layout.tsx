import { Outlet } from 'react-router'
import Nav from '../components/Nav'

function Layout() {
  return (
    <div className="layout">
      <Outlet />
      <Nav />
    </div>
  )
}

export default Layout
