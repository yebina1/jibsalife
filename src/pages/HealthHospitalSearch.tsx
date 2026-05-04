import './health.css'
import './HealthHospitalSearch.css'
import PageHeader from '../components/PageHeader'
import BackButton from '../components/html/BackButton'
import Button from '../components/html/Button'
import { Link } from 'react-router'
import calendarIcon from '../svg/calendar.svg'
import notificationIcon from '../svg/notification.svg'
import hospital3d from '../img/hospital_3d.png'
import message3d from '../img/message_3d.png'
import hospitalPhoto24h from '../img/24h_animal.png'
import hospitalPhotoCompanion from '../img/companion_animal.png'
import hospitalPhotoLove from '../img/love_animal.png'
import hospitalPhotoWe from '../img/we_animal.png'

type ServiceCard = {
  title: string
  description: string
  image: string
  to?: string
}

type HospitalItem = {
  name: string
  image: string
  rating: string
  reviewCount: number
  distanceKm: number
  tags: string[]
  open: string
  close: string
}

const serviceCards: ServiceCard[] = [
  {
    title: '병원 찾기',
    description: '내 주변 병원 검색\n및 정보 확인',
    image: hospital3d,
  },
  {
    title: '수의사 상담',
    description: '실시간 상담으로\n전문가와 대화',
    image: message3d,
    to: '/health/vet-chat',
  },
]

const hospitalItems: HospitalItem[] = [
  {
    name: '24시 행복 동물병원',
    image: hospitalPhoto24h,
    rating: '4.8',
    reviewCount: 120,
    distanceKm: 1.2,
    tags: ['고양이친화', '건강검진', '스케일링'],
    open: '09:00',
    close: '20:30',
  },
  {
    name: '우리반려 동물병원',
    image: hospitalPhotoCompanion,
    rating: '4.5',
    reviewCount: 680,
    distanceKm: 0.7,
    tags: ['중성화수술', '건강검진', '스케일링'],
    open: '09:00',
    close: '19:00',
  },
  {
    name: '사랑 동물병원',
    image: hospitalPhotoLove,
    rating: '4.3',
    reviewCount: 420,
    distanceKm: 2.1,
    tags: ['슬개골탈구', '강아지친화', '스케일링'],
    open: '09:00',
    close: '20:00',
  },
  {
    name: '우리 동물병원',
    image: hospitalPhotoWe,
    rating: '4.6',
    reviewCount: 198,
    distanceKm: 1.8,
    tags: ['고양이친화', '건강검진', '스케일링'],
    open: '09:00',
    close: '20:30',
  },
]

function toMinutes(value: string) {
  const [hour, minute] = value.split(':').map(Number)
  return hour * 60 + minute
}

function getOperatingState(open: string, close: string) {
  const now = new Date()
  const currentMinutes = now.getHours() * 60 + now.getMinutes()
  const isOpen = currentMinutes >= toMinutes(open) && currentMinutes <= toMinutes(close)

  return {
    isOpen,
  }
}

function HealthHospitalSearch() {
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
            <Button type="button" aria-label="알림" className="health_hospital_search_notification">
              <img src={notificationIcon} alt="" />
            </Button>
          </>
        }
      />

      <main className="page health_page health_hospital_search_page">
        <section className="health_hospital_search_services">
          <h2>어떤 서비스를 원하시나요?</h2>
          <div className="health_hospital_search_service_grid">
            {serviceCards.map((item) =>
              item.to ? (
                <Link key={item.title} className="health_hospital_search_service_card" to={item.to}>
                  <img src={item.image} alt="" aria-hidden="true" />
                  <strong>{item.title}</strong>
                  <p>{item.description}</p>
                </Link>
              ) : (
                <button key={item.title} type="button" className="health_hospital_search_service_card">
                  <img src={item.image} alt="" aria-hidden="true" />
                  <strong>{item.title}</strong>
                  <p>{item.description}</p>
                </button>
              ),
            )}
          </div>
        </section>

        <section className="health_hospital_search_nearby">
          <div className="health_hospital_search_nearby_header">
            <h2>내 주변 추천 병원</h2>
            <button type="button">
              더보기
              <i className="bx bx-chevron-right" aria-hidden="true"></i>
            </button>
          </div>

          <ul className="health_hospital_search_list">
            {hospitalItems.map((item) => {
              const operatingState = getOperatingState(item.open, item.close)

              return (
                <li key={item.name}>
                  <button type="button" className="health_hospital_search_item">
                    <img src={item.image} alt="" aria-hidden="true" />
                    <div className="health_hospital_search_item_body">
                      <div className="health_hospital_search_item_top">
                        <strong>{item.name}</strong>
                      </div>

                      <p className="health_hospital_search_rating">
                        <i className="bx bxs-star" aria-hidden="true"></i>
                        {item.rating} ({item.reviewCount})
                        <span>{item.distanceKm.toFixed(1)} KM</span>
                      </p>

                      <p className="health_hospital_search_tags">{item.tags.join(' · ')}</p>

                      <span
                        className={`health_hospital_search_hours ${operatingState.isOpen ? 'is_open' : ''}`}
                      >
                        {operatingState.isOpen ? '진료중' : '진료 마감'} {item.open} ~ {item.close}
                      </span>
                    </div>

                    <span className="health_hospital_search_favorite" aria-hidden="true">
                      <i className="bx bx-heart"></i>
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </section>
      </main>
    </>
  )
}

export default HealthHospitalSearch
