import './home.css'
import Header from '../components/Header'
import calendarIcon from '../svg/calendar.svg'
import notificationIcon from '../svg/notification.svg'


function Home() {
  return (
    <>
      <Header
        title="집사인생"
        rightContent={
          <>
            <button type="button" aria-label="calendar">
              <img src={calendarIcon} alt="" />
            </button>
            <button type="button" aria-label="notification">
              <img src={notificationIcon} alt="" />
            </button>
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
