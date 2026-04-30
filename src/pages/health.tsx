import './health.css'
import { useNavigate } from 'react-router'
import Header from '../components/Header'
import Button from '../components/html/Button'
import BackButton from '../components/html/BackButton'
import calendarIcon from '../svg/calendar.svg'
import notificationIcon from '../svg/notification.svg'

function Health() {
  const navigate = useNavigate()

  return (
    <>
      <Header
        title="집사인생"
        leftContent={<BackButton />}
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
      <main className="page health_page">
        <h1>건강</h1>
      </main>
    </>
  )
}

export default Health
