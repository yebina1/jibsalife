import { useState } from 'react'
import { Outlet, useLocation } from 'react-router'
import Header from '../components/Header'
import FloatingAiButton from '../components/FloatingAiButton'
import HomeIndicator from '../components/HomeIndicator'
import Nav from '../components/Nav'
import StateBar from '../components/StateBar'
import { HeaderContext, type HeaderConfig } from '../contexts/HeaderContext'

type LayoutProps = {
  showHeader?: boolean
  showNav?: boolean
}

function Layout({ showHeader = true, showNav = true }: LayoutProps) {
  const [header, setHeader] = useState<HeaderConfig>(null)
  const { pathname, search } = useLocation()
  const isCameraPage = pathname === '/health/camera' && new URLSearchParams(search).get('guide') === 'false'
  const noPaddingPaths = ['/community']
  const hasContentPadding = !noPaddingPaths.includes(pathname)
  const contentClassName =
    hasContentPadding ? 'layout_content' : 'layout_content layout_content_no_padding'
  const hideFloatingAiButtonPaths = [
    '/login',
    '/mypage',
    '/community',
    '/mission',
    '/health/camera',
    '/health/register',
    '/health/qna',
    '/health/vet-chat',
    '/mypage/subscription',
  ]
  const hideFloatingAiButton = hideFloatingAiButtonPaths.includes(pathname)

  const isMinimal = !showHeader && !showNav

  return (
    <HeaderContext.Provider value={setHeader}>
      <div className={isCameraPage ? 'layout layout_camera' : isMinimal ? 'layout layout_minimal' : 'layout'}>
        {!isCameraPage ? (
          <header>
            <StateBar />
            {showHeader && header && <Header {...header} />}
          </header>
        ) : null}
        <div className={contentClassName}>
          <Outlet />
        </div>
        {!hideFloatingAiButton ? <FloatingAiButton /> : null}
        {!isCameraPage ? (
          <footer>
            {showNav && <Nav />}
            <HomeIndicator />
          </footer>
        ) : null}
      </div>
    </HeaderContext.Provider>
  )
}

export default Layout
