import './App.css'
import { Navigate, Route, Routes } from 'react-router'
import Layout from './layouts/Layout'
import ScrollToTop from './components/ScrollToTop'
import CommunityChallenge from './pages/community/CommunityChallenge'
import CommunityKnowledgeDetail from './pages/community/CommunityKnowledgeDetail'
import CommunityOverview from './pages/community/CommunityOverview'
import CommunityPetStory from './pages/community/CommunityPetStory'
import CommunityWrite from './pages/community/CommunityWrite'
import CommunityPetStoryDetails from './pages/community/CommunityPetStoryDetails'
import CommunityReward from './pages/community/CommunityReward'
import CommunityVote from './pages/community/CommunityVote'
import CommunityVoteDetail from './pages/community/CommunityVoteDetail'
import CommunityVoteResult from './pages/community/CommunityVoteResult'
import Health from './pages/health/Health'
import HealthCamera from './pages/health/HealthCamera'
import HealthCameraCapture from './pages/health/HealthCameraCapture'
import HealthCheckLoading from './pages/health/HealthCheckLoading'
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
import Onboarding from './pages/onboarding'
import Place from './pages/Place'
import SubscriptionPage from './pages/mypage/SubscriptionPage'

function App() {
  return (
    <div className="app">
      <ScrollToTop />
      <Routes>
        <Route element={<Layout showHeader={false} showNav={false} showFooter={false} hasContentPadding={false} />}>
          <Route path="/onboarding" element={<Onboarding />} />
        </Route>
        <Route element={<Layout showHeader={false} showNav={false} showFooter={false} />}>
          <Route path="/login" element={<Login />} />
          <Route path="/mypage/subscription" element={<SubscriptionPage />} />
        </Route>
        <Route element={<Layout showNav={false} />}>
          <Route path="/health/qna" element={<HealthQna />} />
          <Route path="/health/vet-chat" element={<HealthVetChat />} />
        </Route>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/onboarding" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/place" element={<Place />} />
          <Route path="/mission" element={<Mission />} />
          <Route path="/health" element={<Health />} />
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
          <Route path="/community/petstory/detail/:postId" element={<CommunityPetStoryDetails />} />
          <Route path="/community/petstory/write" element={<CommunityWrite />} />
          <Route path="/community/petstory/knowledge/walk-problems" element={<CommunityKnowledgeDetail />} />
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
