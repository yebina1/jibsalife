import './App.css'
import { Navigate, Route, Routes } from 'react-router'
import Layout from './layouts/Layout'
import Community from './pages/community'
import Health from './pages/health'
import Home from './pages/home'
import Mission from './pages/Mission'
import MyPage from './pages/mypage'

function App() {
  return (
    <div className="app">
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/mission" element={<Mission />} />
          <Route path="/health" element={<Health />} />
          <Route path="/community" element={<Community />} />
          <Route path="/mypage" element={<MyPage />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
