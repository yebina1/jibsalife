import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { AUTH_LOGGED_IN_STORAGE_KEY } from '../utils/authAccounts'
import './Splash.css'

const SPLASH_SEEN_KEY = 'jibsalife.splash.seen'

function Splash() {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      sessionStorage.setItem(SPLASH_SEEN_KEY, 'true')
      const isLoggedIn = localStorage.getItem(AUTH_LOGGED_IN_STORAGE_KEY) === 'true'
      navigate(isLoggedIn ? '/home' : '/onboarding', { replace: true })
    }, 2000)

    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <main className="splash_page" aria-label="집사인생 시작 화면">
      <img className="splash_icon" src="/icon-512.png" alt="집사인생" />
    </main>
  )
}

export default Splash
