import { useEffect, useRef, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router'
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

const communityTabs = [
  { label: '전체', to: '/community/overview' },
  { label: '펫스토리', to: '/community/petstory' },
  { label: '챌린지', to: '/community/challenge' },
  { label: '투표', to: '/community/vote' },
] as const

const petStorySubTabs = [
  { label: '전체', to: '/community/petstory' },
  { label: '일상', to: '/community/petstory/daily' },
  { label: '반려상식', to: '/community/petstory/knowledge' },
] as const

const voteSubTabs = [
  { label: '전체', to: '/community/vote?sub=all' },
  { label: '목록', to: '/community/vote?sub=list' },
  { label: '투표결과', to: '/community/vote?sub=result' },
] as const

const communitySortOptions = [
  { label: '최신순', value: 'latest' },
  { label: '인기순', value: 'popular' },
  { label: '댓글순', value: 'comments' },
  { label: '공유순', value: 'shares' },
] as const

function getSubParam(to: string) {
  return new URLSearchParams(to.split('?')[1]).get('sub')
}

function Layout({ showHeader = true, showNav = true }: LayoutProps) {
  const [header, setHeader] = useState<HeaderConfig>(null)
  const [isCommunitySubtabOpen, setIsCommunitySubtabOpen] = useState(false)
  const [isCommunitySortOpen, setIsCommunitySortOpen] = useState(false)
  const [isCommunityControlsVisible, setIsCommunityControlsVisible] = useState(true)
  const headerRef = useRef<HTMLElement>(null)
  const layoutRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const { pathname, search } = useLocation()
  const searchParams = new URLSearchParams(search)
  const communitySubParam = searchParams.get('sub')
  const communitySortParam = searchParams.get('sort') ?? 'latest'
  const isCameraPage = pathname === '/health/camera' && searchParams.get('guide') === 'false'
  const isLoginPage = pathname === '/login'
  const isCommunityPath = pathname.startsWith('/community')
  const isCommunitySubAll = !communitySubParam || communitySubParam === 'all'
  const communitySubTabs = pathname.startsWith('/community/petstory')
    ? petStorySubTabs
    : pathname.startsWith('/community/vote') && pathname !== '/community/vote/detail'
      ? voteSubTabs
      : null
  const showCommunitySort =
    (pathname.startsWith('/community/vote') && !isCommunitySubAll) ||
    pathname.startsWith('/community/petstory')
  const activeCommunitySubTab = communitySubTabs
    ? communitySubTabs.find((tab) => {
        if (tab.to.includes('?')) {
          const tabSubParam = getSubParam(tab.to)
          return (
            pathname === tab.to.split('?')[0] &&
            (communitySubParam === tabSubParam || (!communitySubParam && tabSubParam === 'all'))
          )
        }
        return pathname === tab.to
      }) ?? communitySubTabs[0]
    : null
  const activeCommunitySort =
    communitySortOptions.find((option) => option.value === communitySortParam) ?? communitySortOptions[0]
  const hasContentPadding = true
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
  const hideFloatingAiButton = hideFloatingAiButtonPaths.includes(pathname) || isCommunityPath

  const buildCommunitySortTo = (sortValue: string) => {
    const nextParams = new URLSearchParams(search)
    nextParams.set('sort', sortValue)
    return `${pathname}?${nextParams.toString()}`
  }

  const isMinimal = !showHeader && !showNav
  const layoutClassName = isCameraPage
    ? 'layout layout_camera'
    : isMinimal
      ? `layout layout_minimal ${isLoginPage ? 'layout_login' : ''}`
      : isCommunityPath
        ? `layout layout_community ${communitySubTabs ? 'layout_community_with_subtabs' : ''} ${
            communitySubTabs && !isCommunityControlsVisible ? 'layout_community_subtabs_hidden' : ''
          }`
        : 'layout'

  useEffect(() => {
    const headerEl = headerRef.current
    const layoutEl = layoutRef.current
    if (!headerEl || !layoutEl) return
    const observer = new ResizeObserver(() => {
      layoutEl.style.setProperty('--layout-header-height', `${headerEl.offsetHeight}px`)
    })
    observer.observe(headerEl)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!communitySubTabs || typeof window === 'undefined') {
      setIsCommunityControlsVisible(true)
      return
    }

    const scrollEl: HTMLDivElement | Window = contentRef.current ?? window
    let lastScrollY = contentRef.current ? contentRef.current.scrollTop : window.scrollY

    const handleScroll = () => {
      const currentScrollY = contentRef.current ? contentRef.current.scrollTop : window.scrollY

      if (currentScrollY <= 8) {
        setIsCommunityControlsVisible(true)
      } else if (currentScrollY > lastScrollY) {
        setIsCommunityControlsVisible(false)
        setIsCommunitySubtabOpen(false)
        setIsCommunitySortOpen(false)
      } else if (currentScrollY < lastScrollY) {
        setIsCommunityControlsVisible(true)
      }

      lastScrollY = currentScrollY
    }

    scrollEl.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      scrollEl.removeEventListener('scroll', handleScroll)
    }
  }, [communitySubTabs])

  return (
    <HeaderContext.Provider value={setHeader}>
      <div className={layoutClassName} ref={layoutRef}>
        {!isCameraPage ? (
          <header ref={headerRef}>
            <StateBar />
            {showHeader && header && <Header {...header} />}
            {isCommunityPath ? (
              <>
                <nav className="layout_community_tabs" aria-label="커뮤니티 카테고리">
                  {communityTabs.map((tab) => (
                    <NavLink
                      key={tab.to}
                      to={tab.to}
                      className={({ isActive }) =>
                        `layout_community_tab ${
                          isActive || (pathname === '/community' && tab.to === '/community/overview')
                            ? 'active'
                            : ''
                        }`
                      }
                      end
                    >
                      {tab.label}
                    </NavLink>
                  ))}
                </nav>
                {communitySubTabs ? (
                  <div className="layout_community_controls">
                    <div className={`layout_community_subtab_dropdown ${isCommunitySubtabOpen ? 'open' : ''}`}>
                      <button
                        type="button"
                        className="layout_community_subtab_toggle"
                        onClick={() => {
                          setIsCommunitySubtabOpen((prev) => !prev)
                          setIsCommunitySortOpen(false)
                        }}
                      >
                        {activeCommunitySubTab?.label}
                      </button>
                      {isCommunitySubtabOpen ? (
                        <div className="layout_community_subtab_menu">
                          {communitySubTabs.map((tab) => {
                            const tabSubParam = getSubParam(tab.to)
                            const isActive = tab.to.includes('?')
                              ? pathname === tab.to.split('?')[0] &&
                                (communitySubParam === tabSubParam || (!communitySubParam && tabSubParam === 'all'))
                              : pathname === tab.to

                            return (
                              <NavLink
                                key={tab.to}
                                to={tab.to}
                                end
                                className={`layout_community_subtab_option ${isActive ? 'active' : ''}`}
                                style={{
                                  color: isActive ? '#6D59F8' : '#111111',
                                  WebkitTextFillColor: isActive ? '#6D59F8' : '#111111',
                                  fontWeight: isActive ? 600 : 400,
                                }}
                                onClick={() => setIsCommunitySubtabOpen(false)}
                              >
                                <span
                                  style={{
                                    color: isActive ? '#6D59F8' : '#111111',
                                    WebkitTextFillColor: isActive ? '#6D59F8' : '#111111',
                                    fontWeight: isActive ? 600 : 400,
                                  }}
                                >
                                  {tab.label}
                                </span>
                              </NavLink>
                            )
                          })}
                        </div>
                      ) : null}
                    </div>

                    {showCommunitySort ? (
                      <div className={`layout_community_sort_dropdown ${isCommunitySortOpen ? 'open' : ''}`}>
                        <button
                          type="button"
                          className="layout_community_sort_toggle"
                          onClick={() => {
                            setIsCommunitySortOpen((prev) => !prev)
                            setIsCommunitySubtabOpen(false)
                          }}
                        >
                          <span>{activeCommunitySort.label}</span>
                          <span className="layout_community_sort_icon" aria-hidden="true" />
                        </button>
                        {isCommunitySortOpen ? (
                          <div className="layout_community_sort_menu">
                            {communitySortOptions.map((option) => (
                              <NavLink
                                key={option.value}
                                to={buildCommunitySortTo(option.value)}
                                className={`layout_community_sort_option ${
                                  option.value === communitySortParam ? 'active' : ''
                                }`}
                                style={{
                                  color: option.value === communitySortParam ? '#6D59F8' : '#111111',
                                  WebkitTextFillColor:
                                    option.value === communitySortParam ? '#6D59F8' : '#111111',
                                  fontWeight: option.value === communitySortParam ? 600 : 400,
                                }}
                                onClick={() => setIsCommunitySortOpen(false)}
                              >
                                <span
                                  style={{
                                    color: option.value === communitySortParam ? '#6D59F8' : '#111111',
                                    WebkitTextFillColor:
                                      option.value === communitySortParam ? '#6D59F8' : '#111111',
                                    fontWeight: option.value === communitySortParam ? 600 : 400,
                                  }}
                                >
                                  {option.label}
                                </span>
                              </NavLink>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </>
            ) : null}
          </header>
        ) : null}
        <div className={contentClassName} ref={contentRef}>
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
