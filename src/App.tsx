import './App.css'
import { Navigate, Route, Routes } from 'react-router'
import Community from './pages/community'
import Health from './pages/health'
import Home from './pages/home'
import MyPage from './pages/mypage'

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/health" element={<Health />} />
        <Route path="/community" element={<Community />} />
        <Route path="/mypage" element={<MyPage />} />
      </Routes>
    </div>
  )
}

export default App
