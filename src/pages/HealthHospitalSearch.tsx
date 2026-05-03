import './health.css'
import './HealthHospitalSearch.css'
import PageHeader from '../components/PageHeader'
import BackButton from '../components/html/BackButton'
import CloseButton from '../components/html/CloseButton'
import HospitalList from '../components/HospitalList'
import type { HospitalListItem } from '../components/HospitalList'
import Button from '../components/html/Button'
import NoticeText from '../components/NoticeText'

const hospitalItems: HospitalListItem[] = [
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

function HealthHospitalSearch() {
  return (
    <>
      <PageHeader title="병원찾기" 
      leftContent={<BackButton />}
      rightContent={<CloseButton />} />
      <main className="page health_page health_hospital_search_page">
        <div className="health_hospital_search_location">
          <strong>내 위치 기준</strong>
          <span aria-hidden="true"></span>
        </div>

        <HospitalList items={hospitalItems} />

        <Button type="button" className="purple_btn">
          지도에서 더 보기
        </Button>

        <NoticeText>
          <p>
            ※ 이 결과는 참고용이며, 정확한 진단은
            <br />
            수의사 상담을 통해 확인해 주세요.
          </p>
        </NoticeText>
      </main>
    </>
  )
}

export default HealthHospitalSearch
