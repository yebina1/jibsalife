import './health.css'
import './HealthResultDetail.css'
import Header from '../components/Header'
import Title from '../components/Title'
import BackButton from '../components/html/BackButton'

function HealthResultDetail() {
  return (
    <>
      <Header title="AI 건강 체크" 
      leftContent={<BackButton />}
      rightContent={
        <p>오늘 AI 건강체크 1/1회 사용</p>
        } />
      <main className="page health_page health_result_detail_page">
        <Title as="h1" title="확인 결과 자세히 보기">
          <p>선택한 결과 항목의 상세 내용을 확인할 수 있어요.</p>
        </Title>
      </main>
    </>
  )
}

export default HealthResultDetail
