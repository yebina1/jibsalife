import { useNavigate } from 'react-router'
import { AUTH_LOGGED_IN_STORAGE_KEY } from '../utils/authAccounts'
import './Splash.css'

const SPLASH_SEEN_KEY = 'jibsalife.splash.seen'

function Splash() {
  const navigate = useNavigate()

  const handleEnded = () => {
    localStorage.setItem(SPLASH_SEEN_KEY, 'true')
    const isLoggedIn = localStorage.getItem(AUTH_LOGGED_IN_STORAGE_KEY) === 'true'
    navigate(isLoggedIn ? '/home' : '/onboarding', { replace: true })
  }

  return (
    <main className="splash_page" aria-label="집사인생 시작 화면">
      <video
        className="splash_video"
        src="/splash_video.mp4"
        autoPlay
        muted
        playsInline
        onEnded={handleEnded}
      />
    </main>
  )
}

export default Splash
