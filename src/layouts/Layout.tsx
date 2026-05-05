import { useEffect, useState } from 'react'
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
  ]
  const hideFloatingAiButton = hideFloatingAiButtonPaths.includes(pathname)

  const isMinimal = !showHeader && !showNav

  useEffect(() => {
    if (typeof window === 'undefined') return

    const root = document.documentElement
    const viewport = window.visualViewport
    const keyboardThreshold = 120

    const isEditableElement = (target: EventTarget | null) =>
      target instanceof HTMLElement &&
      (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT')

    const updateViewportHeight = () => {
      const viewportHeight = viewport?.height ?? window.innerHeight
      root.style.setProperty('--app-viewport-height', `${viewportHeight}px`)
      const keyboardOpen = window.innerHeight - viewportHeight > keyboardThreshold
      root.dataset.keyboardOpen = keyboardOpen ? 'true' : 'false'
    }

    const handleFocusIn = (event: FocusEvent) => {
      if (!isEditableElement(event.target)) return

      window.setTimeout(() => {
        if (event.target instanceof HTMLElement) {
          event.target.scrollIntoView({ block: 'center', inline: 'nearest' })
        }
        updateViewportHeight()
      }, 250)
    }

    const handleFocusOut = () => {
      window.setTimeout(updateViewportHeight, 120)
    }

    updateViewportHeight()
    viewport?.addEventListener('resize', updateViewportHeight)
    viewport?.addEventListener('scroll', updateViewportHeight)
    window.addEventListener('resize', updateViewportHeight)
    document.addEventListener('focusin', handleFocusIn)
    document.addEventListener('focusout', handleFocusOut)

    return () => {
      viewport?.removeEventListener('resize', updateViewportHeight)
      viewport?.removeEventListener('scroll', updateViewportHeight)
      window.removeEventListener('resize', updateViewportHeight)
      document.removeEventListener('focusin', handleFocusIn)
      document.removeEventListener('focusout', handleFocusOut)
      delete root.dataset.keyboardOpen
      root.style.removeProperty('--app-viewport-height')
    }
  }, [])

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
