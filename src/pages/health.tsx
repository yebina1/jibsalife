import './health.css'
import Header from '../components/Header'
import HealthCheck from '../components/HealthCheck'
import BackButton from '../components/html/BackButton'
import aboutIcon from '../svg/About.svg'

function Health() {
  return (
    <>
      <Header
        title="AI 건강 체크"
        leftContent={<BackButton />}
        rightContent={
          <div className="health_guide">
            <img src={aboutIcon} alt="" />
            <span>내용 가이드</span>
          </div>
        }
      />
      <main className="page health_page">
        <div className="tit">
          <h1>
            우리 아이의 상태를
            <br />
            확인해 볼까요?
          </h1>
          <p>
            영상, 음성, 사진, 메모 중
            <br />
            편한 방법으로 기록해 주세요
          </p>
        </div>
        <button type="button">
          반려동물 수동 기록 입력하기
          <i className="bx bx-chevron-right"></i>
        </button>
        <HealthCheck />
      </main>
    </>
  )
}

export default Health
