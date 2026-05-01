import './health.css'
import Header from '../components/Header'
import BackButton from '../components/html/BackButton'

function HealthCheckLoading() {
  return (
    <>
      <Header title="AI 건강 체크" leftContent={<BackButton />} />
      <main className="page health_page health_check_loading_page">
        <div className="health_check_loading">
          <i className="bx bx-loader-alt bx-spin"></i>
          <h1>건강 상태 확인중</h1>
          <p>잠시만 기다려주세요.</p>
        </div>
      </main>
    </>
  )
}

export default HealthCheckLoading
