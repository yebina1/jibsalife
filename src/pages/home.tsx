import './home.css'
import { useNavigate } from 'react-router'
import Header from '../components/Header'
import Button from '../components/html/Button'
import calendarIcon from '../svg/calendar.svg'
import notificationIcon from '../svg/notification.svg'


function Home() {
  const navigate = useNavigate()

  return (
    <>
      <Header
        title="집사인생"
        rightContent={
          <>
            <Button type="button" aria-label="calendar" onClick={() => navigate('/mission')}>
              <img src={calendarIcon} alt="" />
            </Button>
            <Button type="button" aria-label="notification">
              <img src={notificationIcon} alt="" />
            </Button>
          </>
        }
      />
    <main className="page home_page">
      <h1>홈</h1>
    </main>
    </>
  )
}

export default Home
