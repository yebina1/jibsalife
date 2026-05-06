import './App.css'
import { Navigate, Route, Routes } from 'react-router'
import Layout from './layouts/Layout'
import ScrollToTop from './components/ScrollToTop'
import Community from './pages/community'
import Health from './pages/health'
import HealthCamera from './pages/HealthCamera'
import HealthCheckLoading from './pages/HealthCheckLoading'
import HealthCheckResult from './pages/HealthCheckResult'
import HealthCheckSummary from './pages/HealthCheckSummary'
import HealthConnect from './pages/HealthConnect'
import HealthHospitalList from './pages/HealthHospitalList'
import HealthHospitalSearch from './pages/HealthHospitalSearch'
import HealthResultDetail from './pages/HealthResultDetail'
import HealthResultActions from './pages/HealthResultActions'
import HealthQna from './pages/HealthQna'
import HealthRegister from './pages/HealthRegister'
import HealthVetChat from './pages/HealthVetChat'
import Home from './pages/home'
import Login from './pages/Login'
import Mission from './pages/Mission'
import MyPage from './pages/mypage'
import Place from './pages/Place'
import SubscriptionPage from './pages/SubscriptionPage'

function App() {
  return (
    <div className="app">
      <ScrollToTop />
      <Routes>
        <Route element={<Layout showHeader={false} showNav={false} />}>
          <Route path="/login" element={<Login />} />
          <Route path="/mypage/subscription" element={<SubscriptionPage />} />
        </Route>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/place" element={<Place />} />
          <Route path="/mission" element={<Mission />} />
          <Route path="/health" element={<Health />} />
          <Route path="/health/camera" element={<HealthCamera />} />
          <Route path="/health/register" element={<HealthRegister />} />
          <Route path="/health/check-loading" element={<HealthCheckLoading />} />
          <Route path="/health/result" element={<HealthCheckResult />} />
          <Route path="/health/result/detail" element={<HealthResultDetail />} />
          <Route path="/health/result/actions" element={<HealthResultActions />} />
          <Route path="/health/check-summary" element={<HealthCheckSummary />} />
          <Route path="/health/connect" element={<HealthConnect />} />
          <Route path="/health/hospitals" element={<HealthHospitalSearch />} />
          <Route path="/health/hospitals/list" element={<HealthHospitalList />} />
          <Route path="/health/qna" element={<HealthQna />} />
          <Route path="/health/vet-chat" element={<HealthVetChat />} />
          <Route path="/community" element={<Community />} />
          <Route path="/mypage" element={<MyPage />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
