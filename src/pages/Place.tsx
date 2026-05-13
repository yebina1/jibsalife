import { useState } from 'react'
import { useNavigate } from 'react-router'
import './Place.css'
import PageHeader from '../components/PageHeader'
import HeaderIcon from '../components/HeaderIcon'
import BackButton from '../components/html/BackButton'
import Button from '../components/html/Button'
import LikeButton from '../components/LikeButton'
import { getOperatingState, hospitalSearchItems } from './health/HealthHospitalData'

function Place() {
  const navigate = useNavigate()
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
        title="내 주변 병원 목록"
        leftContent={<BackButton to="/home" />}
        rightContent={(
          <>
            <Button type="button" aria-label="캘린더" onClick={() => navigate('/mission')}>
              <HeaderIcon type="calendar" />
            </Button>
            <Button type="button" aria-label="알림">
              <HeaderIcon type="notification" />
            </Button>
          </>
        )}
      />

      <main className="page place_page">
        <section className="place_section" aria-label="병원 목록">
          <ul className="place_hospital_list">
            {hospitalSearchItems.map((item) => {
              const operatingState = getOperatingState(item.open, item.close)
              const isFavorite = favoriteNames.includes(item.name)

              return (
                <li key={item.name}>
                  <article className="place_hospital_item">
                    <img src={item.image} alt="" aria-hidden="true" />

                    <div className="place_hospital_body">
                      <strong>{item.name}</strong>

                      <p className="place_hospital_rating">
                        {item.rating} ({item.reviewCount})
                        <span>{item.distanceKm.toFixed(1)} KM</span>
                      </p>

                      <p className="place_hospital_tags">{item.tags.join(' · ')}</p>

                      <span className={`place_hospital_hours ${operatingState.isOpen ? 'is_open' : ''}`}>
                        진료 마감 {item.open} ~ {item.close}
                      </span>
                    </div>

                    <LikeButton
                      type="button"
                      liked={isFavorite}
                      className="place_hospital_favorite"
                      aria-label={isFavorite ? `${item.name} 찜 해제` : `${item.name} 찜`}
                      onClick={() => handleFavoriteToggle(item.name)}
                    />
                  </article>
                </li>
              )
            })}
          </ul>
        </section>
      </main>
    </>
  )
}

export default Place
