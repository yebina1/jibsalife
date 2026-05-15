import './App.css'
import { Navigate, Route, Routes, useLocation } from 'react-router'
import type { ReactNode } from 'react'
import Layout from './layouts/Layout'
import ScrollToTop from './components/ScrollToTop'
import CommunityChallenge from './pages/community/CommunityChallenge'
import CommunityKnowledgeDetail from './pages/community/CommunityKnowledgeDetail'
import CommunityOverview from './pages/community/CommunityOverview'
import CommunityPetStory from './pages/community/CommunityPetStory'
import CommunityPetStoryComments from './pages/community/CommunityPetStoryComments'
import CommunityWrite from './pages/community/CommunityWrite'
import CommunityPetStoryDetails from './pages/community/CommunityPetStoryDetails'
import CommunityReward from './pages/community/CommunityReward'
import CommunityVote from './pages/community/CommunityVote'
import CommunityVoteDetail from './pages/community/CommunityVoteDetail'
import CommunityVoteResult from './pages/community/CommunityVoteResult'
import Health from './pages/health/Health'
import HealthCamera from './pages/health/HealthCamera'
import HealthCameraCapture from './pages/health/HealthCameraCapture'
import HealthCheckAnalysis from './pages/health/HealthCheckAnalysis'
import HealthCheckLoading from './pages/health/HealthCheckLoading'
import HealthHospitalRecommend from './pages/health/HealthHospitalRecommend'
import HealthReport from './pages/health/HealthReport'
import HealthCheckResult from './pages/health/HealthCheckResult'
import HealthCheckSummary from './pages/health/HealthCheckSummary'
import HealthConnect from './pages/health/HealthConnect'
import HealthHospitalList from './pages/health/HealthHospitalList'
import HealthHospitalSearch from './pages/health/HealthHospitalSearch'
import HealthResultDetail from './pages/health/HealthResultDetail'
import HealthResultActions from './pages/health/HealthResultActions'
import HealthQna from './pages/health/HealthQna'
import HealthRegister from './pages/health/HealthRegister'
import HealthVetChat from './pages/health/HealthVetChat'
import Home from './pages/Home'
import Login from './pages/Login'
import Mission from './pages/Mission'
import MyPage from './pages/mypage/MyPage'
import MyPostsPage from './pages/mypage/MyPostsPage'
import Onboarding from './pages/onboarding'
import Place from './pages/Place'
import Signup from './pages/Signup'
import SubscriptionPage from './pages/mypage/SubscriptionPage'
import TermsDetail from './pages/TermsDetail'
import PrivacyDetail from './pages/PrivacyDetail'

const ONBOARDING_DONE_KEY = 'jibsalife.onboarding.done'
const AUTH_LOGGED_IN_KEY = 'jibsalife.auth.loggedIn'
const PROFILE_SETUP_DONE_KEY = 'jibsalife.onboarding.profile.done'

function RootRedirect() {
  if (localStorage.getItem(AUTH_LOGGED_IN_KEY) === 'true') {
    return localStorage.getItem(PROFILE_SETUP_DONE_KEY) === 'true'
      ? <Navigate to="/home" replace />
      : <Navigate to="/onboarding?setup=profile" replace />
  }
  if (localStorage.getItem(ONBOARDING_DONE_KEY) === 'true') return <Navigate to="/login" replace />
  return <Navigate to="/onboarding" replace />
}

function OnboardingGuard({ children }: { children: ReactNode }) {
  const { search } = useLocation()
  const isProfileSetup = new URLSearchParams(search).get('setup') === 'profile'
  const isLoggedIn = localStorage.getItem(AUTH_LOGGED_IN_KEY) === 'true'
  const isProfileSetupDone = localStorage.getItem(PROFILE_SETUP_DONE_KEY) === 'true'

  if (isProfileSetup) {
    if (!isLoggedIn) return <Navigate to="/login" replace />
    if (isProfileSetupDone) return <Navigate to="/home" replace />
    return <>{children}</>
  }

  if (isLoggedIn) {
    return isProfileSetupDone
      ? <Navigate to="/home" replace />
      : <Navigate to="/onboarding?setup=profile" replace />
  }
  if (localStorage.getItem(ONBOARDING_DONE_KEY) === 'true') return <Navigate to="/login" replace />
  return <>{children}</>
}

function LoginGuard({ children }: { children: ReactNode }) {
  if (localStorage.getItem(AUTH_LOGGED_IN_KEY) === 'true') {
    return localStorage.getItem(PROFILE_SETUP_DONE_KEY) === 'true'
      ? <Navigate to="/home" replace />
      : <Navigate to="/onboarding?setup=profile" replace />
  }
  return <>{children}</>
}

function App() {
  return (
    <div className="app">
      <ScrollToTop />
      <Routes>
        <Route element={<Layout showHeader={false} showNav={false} showFooter={false} hasContentPadding={false} />}>
          <Route path="/onboarding" element={<OnboardingGuard><Onboarding /></OnboardingGuard>} />
        </Route>
        <Route element={<Layout showHeader={false} showNav={false} showFooter={false} />}>
          <Route path="/login" element={<LoginGuard><Login /></LoginGuard>} />
          <Route path="/signup" element={<Signup />} />
        </Route>
        <Route element={<Layout showHeader={false} showNav={false} />}>
          <Route path="/mypage/subscription" element={<SubscriptionPage />} />
        </Route>
        <Route element={<Layout />}>
          <Route path="/mypage/posts" element={<MyPostsPage />} />
        </Route>
        <Route element={<Layout showHeader={false} showNav={false} showFooter={false} hasContentPadding={false} />}>
          <Route path="/signup/terms/service" element={<TermsDetail />} />
          <Route path="/signup/terms/privacy" element={<PrivacyDetail />} />
        </Route>
        <Route element={<Layout showNav={false} />}>
          <Route path="/health/qna" element={<HealthQna />} />
          <Route path="/health/vet-chat" element={<HealthVetChat />} />
          <Route path="/community/vote/write" element={<CommunityWrite />} />
        </Route>
        <Route element={<Layout showHeader={false} />}>
          <Route path="/health/cam" element={<Health />} />
        </Route>
        <Route element={<Layout />}>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/home" element={<Home />} />
          <Route path="/place" element={<Place />} />
          <Route path="/mission" element={<Mission />} />
          <Route path="/health/check" element={<HealthCheckAnalysis />} />
          <Route path="/health/report" element={<HealthReport />} />
          <Route path="/health/hospital" element={<HealthHospitalRecommend />} />
          <Route path="/health/camera" element={<HealthCamera />} />
          <Route path="/health/camera/capture" element={<HealthCameraCapture />} />
          <Route path="/health/register" element={<HealthRegister />} />
          <Route path="/health/check-loading" element={<HealthCheckLoading />} />
          <Route path="/health/result" element={<HealthCheckResult />} />
          <Route path="/health/result/detail" element={<HealthResultDetail />} />
          <Route path="/health/result/actions" element={<HealthResultActions />} />
          <Route path="/health/check-summary" element={<HealthCheckSummary />} />
          <Route path="/health/connect" element={<HealthConnect />} />
          <Route path="/health/hospitals" element={<HealthHospitalSearch />} />
          <Route path="/health/hospitals/list" element={<HealthHospitalList />} />
          <Route path="/community" element={<CommunityOverview />} />
          <Route path="/community/overview" element={<CommunityOverview />} />
          <Route path="/community/petstory" element={<CommunityPetStory />} />
          <Route path="/community/petstory/daily" element={<CommunityPetStory />} />
          <Route path="/community/petstory/knowledge" element={<CommunityPetStory />} />
          <Route path="/community/petstory/detail/:postId/comments" element={<CommunityPetStoryComments />} />
          <Route path="/community/petstory/detail/:postId" element={<CommunityPetStoryDetails />} />
          <Route path="/community/petstory/write" element={<CommunityWrite />} />
          <Route path="/community/petstory/knowledge/:knowledgeId/comments" element={<CommunityPetStoryComments />} />
          <Route path="/community/petstory/knowledge/:knowledgeId" element={<CommunityKnowledgeDetail />} />
          <Route path="/community/challenge" element={<CommunityChallenge />} />
          <Route path="/community/challenge/reward" element={<CommunityReward />} />
          <Route path="/community/vote" element={<CommunityVote />} />
          <Route path="/community/vote/detail" element={<CommunityVoteDetail />} />
          <Route path="/community/vote/result" element={<CommunityVoteResult />} />
          <Route path="/mypage" element={<MyPage />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
