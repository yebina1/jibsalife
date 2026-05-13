import { useState } from 'react'
import './Health.css'
import './HealthHospitalList.css'
import PageHeader from '../../components/PageHeader'
import HeaderIcon from '../../components/HeaderIcon'
import ContentSection from '../../components/ContentSection'
import BackButton from '../../components/html/BackButton'
import Button from '../../components/html/Button'
import LikeButton from '../../components/LikeButton'
import calendarIcon from '../../svg/calendar.svg'
import { getOperatingState, hospitalSearchItems } from './HealthHospitalData'

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
            <Button type="button" aria-label="알림">
              <HeaderIcon type="notification" />
            </Button>
          </>
        }
      />

      <main className="page health_page health_hospital_list_page">
        <ContentSection
          className="health_hospital_list_section"
          title="병원 목록"
          subtitle="내 주변 병원 목록을 한눈에 확인해 보세요."
        >
          <ul className="health_hospital_list">
            {hospitalSearchItems.map((item) => {
              const operatingState = getOperatingState(item.open, item.close)
              const isFavorite = favoriteNames.includes(item.name)

              return (
                <li key={item.name}>
                  <div className="health_hospital_list_item">
                    <img src={item.image} alt={`${item.name} 이미지`} aria-hidden="true" />
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

                    <LikeButton
                      type="button"
                      liked={isFavorite}
                      className="health_hospital_list_favorite"
                      aria-label={isFavorite ? `${item.name} 찜 해제` : `${item.name} 찜`}
                      onClick={() => handleFavoriteToggle(item.name)}
                    />
                  </div>
                </li>
              )
            })}
          </ul>
        </ContentSection>
      </main>
    </>
  )
}

export default HealthHospitalList
