import './Place.css'
import PageHeader from '../components/PageHeader'
import HospitalList from '../components/HospitalList'
import type { HospitalListItem } from '../components/HospitalList'
import Button from '../components/html/Button'

const nearbyPlaces: HospitalListItem[] = [
  {
    name: '24시 행복 동물병원',
    rating: '4.8 (120)',
    distance: '1.2KM',
    status: '영업중',
    hours: '24시간 진료',
  },
  {
    name: '우리 동물병원',
    rating: '4.6 (98)',
    distance: '1.8KM',
    status: '영업중',
    hours: '09:00~21:00',
  },
  {
    name: '사랑 동물병원',
    rating: '4.6 (76)',
    distance: '2.1KM',
    status: '영업중',
    hours: '10:00~20:00',
  },
]

const quickFilters = ['24시', '응급', '미용', '호텔', '약국'] as const

function Place() {
  return (
    <>
      <PageHeader title="장소" />
      <main className="page place_page">
        <section className="place_hero">
          <p className="place_eyebrow">내 주변 맞춤 장소</p>
          <h2>가까운 반려생활 스팟을 한 번에 찾아보세요</h2>
          <p className="place_description">
            병원, 응급 진료, 돌봄 관련 장소를 빠르게 확인할 수 있어요.
          </p>
          <div className="place_filters" aria-label="장소 빠른 필터">
            {quickFilters.map((filter) => (
              <button key={filter} type="button">
                {filter}
              </button>
            ))}
          </div>
        </section>

        <section className="place_section">
          <div className="place_section_heading">
            <div>
              <strong>현재 위치 기준</strong>
              <p>서울시 강남구</p>
            </div>
            <Button type="button" className="place_location_button">
              위치 새로고침
            </Button>
          </div>

          <HospitalList items={nearbyPlaces} />
        </section>
      </main>
    </>
  )
}

export default Place
