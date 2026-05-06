import { useState } from 'react'
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
  { label: '?ÑÏ≤¥', to: '/community/overview' },
  { label: '?´Ïä§?†Î¶¨', to: '/community/pet-story' },
  { label: 'Ï±åÎ¶∞ÏßÄ', to: '/community/challenge' },
  { label: '?¨Ìëú', to: '/community/vote' },
] as const

const petStorySubTabs = [
  { label: '?ÑÏ≤¥', to: '/community/pet-story?sub=all' },
  { label: '?êÎûë?òÍ∏∞', to: '/community/pet-story?sub=brag' },
  { label: '?ºÏÉÅ', to: '/community/pet-story?sub=daily' },
  { label: 'Î∞òÎ†§?ÅÏãù', to: '/community/pet-story?sub=knowledge' },
] as const

const communitySortOptions = [
  { label: '¿Œ±‚º¯', value: 'popular' },
  { label: '√÷Ω≈º¯', value: 'latest' },
  { label: '¥Ò±€º¯', value: 'comments' },
  { label: '∞¯¿Øº¯', value: 'shares' },
] as const

function getSubParam(to: string) {
  return new URLSearchParams(to.split('?')[1]).get('sub')
}

function Layout({ showHeader = true, showNav = true }: LayoutProps) {
  const [header, setHeader] = useState<HeaderConfig>(null)
  const [isCommunitySubtabOpen, setIsCommunitySubtabOpen] = useState(false)
  const [isCommunitySortOpen, setIsCommunitySortOpen] = useState(false)
  const { pathname, search } = useLocation()
  const searchParams = new URLSearchParams(search)
  const communitySubParam = searchParams.get('sub')
  const communitySortParam = searchParams.get('sort') ?? 'popular'
  const isCameraPage = pathname === '/health/camera' && searchParams.get('guide') === 'false'
  const isCommunityPath = pathname.startsWith('/community')
  const isCommunitySubAll = !communitySubParam || communitySubParam === 'all'
  const communitySubTabs = pathname.endsWith('/community/pet-story')
    ? petStorySubTabs
    : null
  const showCommunitySort =
    (pathname.endsWith('/community/vote') && !isCommunitySubAll) ||
    (pathname.endsWith('/community/pet-story') && !isCommunitySubAll && communitySubParam !== 'knowledge')
  const activeCommunitySubTab = communitySubTabs
    ? communitySubTabs.find((tab) => {
        const tabSubParam = getSubParam(tab.to)
        return communitySubParam === tabSubParam || (!communitySubParam && tabSubParam === 'all')
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
      ? 'layout layout_minimal'
      : isCommunityPath
        ? `layout layout_community ${communitySubTabs ? 'layout_community_with_subtabs' : ''}`
        : 'layout'

  return (
    <HeaderContext.Provider value={setHeader}>
      <div className={layoutClassName}>
        {!isCameraPage ? (
          <header>
            <StateBar />
            {showHeader && header && <Header {...header} />}
            {isCommunityPath ? (
              <>
                <nav className="layout_community_tabs" aria-label="Ïª§Î??àÌã∞ Ïπ¥ÌÖåÍ≥†Î¶¨">
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
                        onClick={() => setIsCommunitySubtabOpen((prev) => !prev)}
                      >
                        {activeCommunitySubTab?.label}
                      </button>
                      {isCommunitySubtabOpen ? (
                        <div className="layout_community_subtab_menu">
                          {communitySubTabs.map((tab) => {
                            const tabSubParam = getSubParam(tab.to)
                            const isActive =
                              communitySubParam === tabSubParam || (!communitySubParam && tabSubParam === 'all')

                            return (
                              <NavLink
                                key={tab.to}
                                to={tab.to}
                                className={`layout_community_subtab_option ${isActive ? 'active' : ''}`}
                                style={{ color: isActive ? '#6D59F8' : '#111111', fontWeight: 400 }}
                                onClick={() => setIsCommunitySubtabOpen(false)}
                              >
                                {tab.label}
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
                          onClick={() => setIsCommunitySortOpen((prev) => !prev)}
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
                                  fontWeight: 400,
                                }}
                                onClick={() => setIsCommunitySortOpen(false)}
                              >
                                {option.label}
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

