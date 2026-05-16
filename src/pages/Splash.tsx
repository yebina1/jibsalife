import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import loginPetImg from '../img/illust_login_pet.png'
import './Splash.css'

const SPLASH_SEEN_SESSION_KEY = 'jibsalife.session.splash.seen'

function Splash() {
  const navigate = useNavigate()

  useEffect(() => {
    sessionStorage.setItem(SPLASH_SEEN_SESSION_KEY, 'true')

    const timerId = window.setTimeout(() => {
      navigate('/login', { replace: true })
    }, 1200)

    return () => window.clearTimeout(timerId)
  }, [navigate])

  return (
    <main className="splash_page" aria-label="집사인생 시작 화면">
      <div className="splash_content">
        <img
          src={loginPetImg}
          alt=""
          aria-hidden="true"
          className="splash_image"
          width={180}
          height={180}
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
        <div className="splash_copy">
          <h1>집사인생</h1>
          <p>우리 아이의 하루를 기록해요</p>
        </div>
      </div>
    </main>
  )
}

export default Splash
