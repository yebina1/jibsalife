import { useState } from 'react'
import { Outlet, useLocation } from 'react-router'
import Header from '../components/Header'
import FloatingAiButton from '../components/FloatingAiButton'
import HomeIndicator from '../components/HomeIndicator'
import Nav from '../components/Nav'
import StateBar from '../components/StateBar'
import { HeaderContext, type HeaderConfig } from '../contexts/HeaderContext'

function Layout() {
  const [header, setHeader] = useState<HeaderConfig>(null)
  const { pathname } = useLocation()
  const isCameraPage = pathname === '/health/camera'
  const noPaddingPaths = ['/community']
  const hasContentPadding = !noPaddingPaths.includes(pathname)
  const contentClassName =
    hasContentPadding ? 'layout_content' : 'layout_content layout_content_no_padding'
  const hideFloatingAiButtonPaths = [
    '/mypage',
    '/community',
    '/mission',
    '/health/camera',
    '/health/qna',
    '/health/vet-chat',
  ]
  const hideFloatingAiButton = hideFloatingAiButtonPaths.includes(pathname)

  return (
    <HeaderContext.Provider value={setHeader}>
      <div className={isCameraPage ? 'layout layout_camera' : 'layout'}>
        {!isCameraPage ? (
          <header>
            <StateBar />
            {header && <Header {...header} />}
          </header>
        ) : null}
        <div className={contentClassName}>
          <Outlet />
        </div>
        {!hideFloatingAiButton ? <FloatingAiButton /> : null}
        {!isCameraPage ? (
          <footer>
            <Nav />
            <HomeIndicator />
          </footer>
        ) : null}
      </div>
    </HeaderContext.Provider>
  )
}

export default Layout
