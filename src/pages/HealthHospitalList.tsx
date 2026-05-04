import { useState } from 'react'
import './health.css'
import './HealthHospitalList.css'
import PageHeader from '../components/PageHeader'
import BackButton from '../components/html/BackButton'
import Button from '../components/html/Button'
import calendarIcon from '../svg/calendar.svg'
import notificationIcon from '../svg/notification.svg'
import { getOperatingState, hospitalSearchItems } from './healthHospitalData'

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 20.2 4.9 13.6a4.8 4.8 0 0 1 6.8-6.8L12 7.1l.3-.3a4.8 4.8 0 0 1 6.8 6.8L12 20.2Z"
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function HealthHospitalList() {
  const [favoriteNames, setFavoriteNames] = useState<string[]>([])

  const handleFavoriteToggle = (hospitalName: string) => {
    setFavoriteNames((current) =>
      current.includes(hospitalName)
        ? current.filter((name) => name !== hospitalName)
        : [...current, hospitalName],
    )
  }

  return (
    <>
      <PageHeader
        title="AI 건강 체크"
        leftContent={<BackButton />}
        rightContent={
          <>
            <Button type="button" aria-label="캘린더">
              <img src={calendarIcon} alt="" />
            </Button>
            <Button type="button" aria-label="알림" className="health_hospital_list_notification">
              <img src={notificationIcon} alt="" />
            </Button>
          </>
        }
      />

      <main className="page health_page health_hospital_list_page">
        <section className="health_hospital_list_section">
          <div className="health_hospital_list_header">
            <h2>병원 목록</h2>
            <p>내 주변 추천 병원을 한눈에 확인해 보세요.</p>
          </div>

          <ul className="health_hospital_list">
            {hospitalSearchItems.map((item) => {
              const operatingState = getOperatingState(item.open, item.close)
              const isFavorite = favoriteNames.includes(item.name)

              return (
                <li key={item.name}>
                  <div className="health_hospital_list_item">
                    <img src={item.image} alt="" aria-hidden="true" />
                    <div className="health_hospital_list_item_body">
                      <div className="health_hospital_list_item_top">
                        <strong>{item.name}</strong>
                      </div>

                      <p className="health_hospital_list_rating">
                        <i className="bx bxs-star" aria-hidden="true"></i>
                        {item.rating} ({item.reviewCount})
                        <span>{item.distanceKm.toFixed(1)} KM</span>
                      </p>

                      <p className="health_hospital_list_tags">{item.tags.join(' · ')}</p>

                      <span className={`health_hospital_list_hours ${operatingState.isOpen ? 'is_open' : ''}`}>
                        {operatingState.isOpen ? '진료중' : '진료 마감'} {item.open} ~ {item.close}
                      </span>
                    </div>

                    <button
                      type="button"
                      className={`health_hospital_list_favorite ${isFavorite ? 'is_active' : ''}`}
                      aria-label={isFavorite ? `${item.name} 찜 해제` : `${item.name} 찜`}
                      aria-pressed={isFavorite}
                      onClick={() => handleFavoriteToggle(item.name)}
                    >
                      <HeartIcon filled={isFavorite} />
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
      </main>
    </>
  )
}

export default HealthHospitalList
