import './health.css'
import Header from '../components/Header'
import calendarIcon from '../svg/calendar.svg'
import notificationIcon from '../svg/notification.svg'

function Health() {
  return (
    <>
      <Header
        title="집사인생"
        leftContent={
          <button type='button'>
            <i className="bx bx-chevron-left"></i>
          </button>
        }
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
      <main className="page health_page">
        <h1>건강</h1>
      </main>
    </>
  )
}

export default Health
