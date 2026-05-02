import { useNavigate } from 'react-router'
import './health.css'
import './HealthConnect.css'
import PageHeader from '../components/PageHeader'
import CloseButton from '../components/html/CloseButton'
import BackButton from '../components/html/BackButton'
import NoticeText from '../components/NoticeText'
import ConnectServiceList from '../components/ConnectServiceList'
import type { ConnectServiceItem } from '../components/ConnectServiceList'
import SectionHeader from '../components/SectionHeader'
import HospitalList from '../components/HospitalList'
import type { HospitalListItem } from '../components/HospitalList'

function HealthConnect() {
  const navigate = useNavigate()

  const serviceItems: ConnectServiceItem[] = [
    {
      title: '병원 찾기',
      description: '내 주변 병원 검색 및 정보 확인',
      onClick: () => navigate('/health/hospitals'),
    },
    {
      title: '수의사 상담',
      description: '실시간 상담으로 전문가와 대화',
      onClick: () => navigate('/health/vet-chat'),
    },
  ]

  const hospitalItems: HospitalListItem[] = [
    {
      name: '24시 행복 동물병원',
      rating: '4.8 (120)',
      distance: '1.2KM',
    },
    {
      name: '우리 동물병원',
      rating: '4.6 (98)',
      distance: '1.8KM',
    },
  ]

  return (
    <>
      <PageHeader
        title="AI 건강 체크"
        leftContent={<BackButton />}
        rightContent={<CloseButton />}
      />
      <main className="page health_page health_connect_page">
        <section className="health_connect_services">
          <h2>어떤 서비스를 원하시나요?</h2>
          <ConnectServiceList items={serviceItems} />
        </section>

        <section className="health_connect_hospitals">
          <SectionHeader
            title="내 주변 추천 병원"
            actionText="더보기"
            actionIcon={<i className="bx bx-chevron-right" aria-hidden="true"></i>}
            onActionClick={() => navigate('/health/hospitals')}
          />
          <HospitalList items={hospitalItems} />
        </section>

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

export default HealthConnect
