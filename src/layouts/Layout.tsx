import { Outlet } from 'react-router'
import Nav from '../components/Nav'
import StateBar from '../components/StateBar'

function Layout() {
  return (
    <div className="layout">
      <StateBar />
      <Outlet />
      <Nav />
    </div>
  )
}

export default Layout
