import { useEffect, useRef, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router'
import Header from '../components/Header'
import Button from '../components/html/Button'
import FloatingAiButton from '../components/FloatingAiButton'
import HomeIndicator from '../components/HomeIndicator'
import Nav from '../components/Nav'
import StateBar from '../components/StateBar'
import { HeaderContext, type HeaderConfig } from '../contexts/HeaderContext'

type LayoutProps = {
  showHeader?: boolean
  showNav?: boolean
  showFooter?: boolean
  hasContentPadding?: boolean
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
  { label: '투표 목록', to: '/community/vote?sub=list' },
  { label: '구독자 챌린지', to: '/community/vote?sub=subscriber' },
  { label: '투표 결과', to: '/community/vote?sub=result' },
] as const

const communitySortOptions = [
  { label: '최신순', value: 'latest' },
  { label: '인기순', value: 'popular' },
  { label: '댓글순', value: 'comments' },
  { label: '공유순', value: 'shares' },
] as const

const voteSortOptions = [
  { label: '최신순', value: 'latest' },
  { label: '인기순', value: 'popular' },
  { label: '임박순', value: 'deadline' },
] as const

function getSubParam(to: string) {
  return new URLSearchParams(to.split('?')[1]).get('sub')
}

function Layout({
  showHeader = true,
  showNav = true,
  showFooter = true,
  hasContentPadding = true,
}: LayoutProps) {
  const [header, setHeader] = useState<HeaderConfig>(null)
  const [isCommunitySortOpen, setIsCommunitySortOpen] = useState(false)
  const navigate = useNavigate()
  const [isCommunityControlsVisible, setIsCommunityControlsVisible] = useState(true)
  const headerRef = useRef<HTMLElement>(null)
  const layoutRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const { pathname, search } = useLocation()
  const searchParams = new URLSearchParams(search)
  const communitySubParam = searchParams.get('sub')
  const communitySortParam = searchParams.get('sort') ?? 'latest'
  const isCameraPage = pathname === '/health/camera'
  const isLoginPage = pathname === '/login'
  const isOnboardingPage = pathname === '/onboarding'
  const isCommunityPath = pathname.startsWith('/community')
  const isPetStoryDetailPage = pathname.startsWith('/community/petstory/detail/')
  const isPetStoryWritePage = pathname === '/community/petstory/write'
  const isKnowledgeDetailPage = pathname.startsWith('/community/petstory/knowledge/')
  const isVoteDetailPage = pathname === '/community/vote/detail'
  const showCommunityChrome =
    isCommunityPath && !isPetStoryDetailPage && !isPetStoryWritePage && !isKnowledgeDetailPage && !isVoteDetailPage
  const communitySubTabs = !isPetStoryDetailPage && !isPetStoryWritePage && !isKnowledgeDetailPage && pathname.startsWith('/community/petstory')
    ? petStorySubTabs
    : !isPetStoryDetailPage && !isKnowledgeDetailPage && pathname.startsWith('/community/vote') && pathname !== '/community/vote/detail'
      ? voteSubTabs
      : null
  const showCommunitySort =
    !isPetStoryDetailPage &&
    !isKnowledgeDetailPage &&
    !pathname.startsWith('/community/vote') &&
    pathname.startsWith('/community/petstory')
  const activeCommunitySortOptions = pathname.startsWith('/community/vote') ? voteSortOptions : communitySortOptions
  const activeCommunitySort =
    activeCommunitySortOptions.find((option) => option.value === communitySortParam) ?? activeCommunitySortOptions[0]
  const contentClassName =
    hasContentPadding ? 'layout_content' : 'layout_content layout_content_no_padding'
  const hideFloatingAiButtonPaths = [
    '/onboarding',
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

  const isCommunityTopTabActive = (to: string, isActive: boolean) => {
    if (pathname === '/community' && to === '/community/overview') return true
    if (to === '/community/overview') return isActive
    return pathname === to || pathname.startsWith(`${to}/`)
  }

  const isCommunitySubTabActive = (to: string) => {
    if (to === '/community/petstory') {
      return pathname === '/community/petstory' || pathname === '/community/petstory/'
    }

    if (to.includes('?')) {
      const tabPathname = to.split('?')[0]
      const tabSubParam = getSubParam(to)
      return (
        pathname === tabPathname &&
        (communitySubParam === tabSubParam || (!communitySubParam && tabSubParam === 'all'))
      )
    }

    return pathname === to
  }

  const buildCommunitySortTo = (sortValue: string) => {
    const nextParams = new URLSearchParams(search)
    nextParams.set('sort', sortValue)
    return `${pathname}?${nextParams.toString()}`
  }

  const isMinimal = !showHeader && !showNav && !showFooter
  const layoutClassName = isCameraPage
    ? 'layout layout_camera'
    : isMinimal
      ? `layout layout_minimal ${isLoginPage ? 'layout_login' : ''} ${
          isOnboardingPage && !hasContentPadding ? 'layout_minimal_no_header_space' : ''
        }`
      : showCommunityChrome
        ? `layout layout_community ${communitySubTabs ? 'layout_community_with_subtabs' : ''} ${
            communitySubTabs && !isCommunityControlsVisible ? 'layout_community_subtabs_hidden' : ''
          }`
        : `layout ${!showFooter ? 'layout_no_footer' : ''} ${
            !showNav && showFooter ? 'layout_indicator_only' : ''
          } ${isKnowledgeDetailPage ? 'layout_knowledge_detail' : ''}`

  useEffect(() => {
    setIsCommunitySortOpen(false)
  }, [pathname])

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
      return
    }

    const scrollEl: HTMLDivElement | Window = contentRef.current ?? window
    let lastScrollY = contentRef.current ? contentRef.current.scrollTop : window.scrollY
    const resetTimerId = window.setTimeout(() => {
      setIsCommunityControlsVisible(true)
    }, 0)

    const handleScroll = () => {
      const currentScrollY = contentRef.current ? contentRef.current.scrollTop : window.scrollY

      if (currentScrollY <= 8) {
        setIsCommunityControlsVisible(true)
      } else if (currentScrollY > lastScrollY) {
        setIsCommunityControlsVisible(false)
        setIsCommunitySortOpen(false)
      } else if (currentScrollY < lastScrollY) {
        setIsCommunityControlsVisible(true)
      }

      lastScrollY = currentScrollY
    }

    scrollEl.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.clearTimeout(resetTimerId)
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
            {showCommunityChrome ? (
              <>
                <nav className="layout_community_tabs" aria-label="커뮤니티 카테고리">
                  {communityTabs.map((tab) => (
                    <NavLink
                      key={tab.to}
                      to={tab.to}
                      className={({ isActive }) =>
                        `layout_community_tab ${
                          isCommunityTopTabActive(tab.to, isActive) ? 'active' : ''
                        }`
                      }
                      end={tab.to === '/community/overview'}
                    >
                      {tab.label}
                    </NavLink>
                  ))}
                </nav>
                {communitySubTabs ? (
                  <div className="layout_community_controls">
                    {showCommunitySort ? (
                      <div className={`layout_community_sort_dropdown ${isCommunitySortOpen ? 'open' : ''}`}>
                        <Button
                          type="button"
                          className="s_white_radius_btn"
                          icon={<span className="layout_community_sort_icon" />}
                          iconPosition="right"
                          onClick={() => setIsCommunitySortOpen((prev) => !prev)}
                        >
                          {activeCommunitySort.label}
                        </Button>
                        {isCommunitySortOpen ? (
                          <div className="layout_community_sort_menu">
                            {activeCommunitySortOptions.map((option) => (
                              <NavLink
                                key={option.value}
                                to={buildCommunitySortTo(option.value)}
                                className={`layout_community_sort_option ${
                                  option.value === activeCommunitySort.value ? 'active' : ''
                                }`}
                                style={{
                                  color: option.value === activeCommunitySort.value ? '#6D59F8' : '#111111',
                                  WebkitTextFillColor:
                                    option.value === activeCommunitySort.value ? '#6D59F8' : '#111111',
                                  fontWeight: option.value === activeCommunitySort.value ? 600 : 400,
                                }}
                                onClick={() => setIsCommunitySortOpen(false)}
                              >
                                <span
                                  style={{
                                    color: option.value === activeCommunitySort.value ? '#6D59F8' : '#111111',
                                    WebkitTextFillColor:
                                      option.value === activeCommunitySort.value ? '#6D59F8' : '#111111',
                                    fontWeight: option.value === activeCommunitySort.value ? 600 : 400,
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

                    <div
                      className={`layout_community_subtab_scroll${
                        pathname.startsWith('/community/vote') ? ' layout_community_vote_subtab_scroll' : ''
                      }`}
                    >
                      {communitySubTabs.map((tab) => {
                        const isActive = isCommunitySubTabActive(tab.to)
                        const isSmallRadiusSubtab =
                          pathname.startsWith('/community/vote') || pathname.startsWith('/community/petstory')
                        const subtabButtonClassName = isSmallRadiusSubtab
                          ? 's_white_radius_btn'
                          : 'white_radius_btn'

                        return (
                          <Button
                            key={tab.to}
                            type="button"
                            className={`${subtabButtonClassName}${isActive ? ' layout_community_subtab_active' : ''}`}
                            onClick={() => { navigate(tab.to); setIsCommunitySortOpen(false) }}
                          >
                            {tab.label}
                          </Button>
                        )
                      })}
                    </div>
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
        {!isCameraPage && showFooter ? (
          <footer>
            {showNav && !isPetStoryDetailPage && <Nav />}
            <HomeIndicator />
          </footer>
        ) : null}
      </div>
    </HeaderContext.Provider>
  )
}

export default Layout
