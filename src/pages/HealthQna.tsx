import './health.css'
import './HealthQna.css'
import Header from '../components/Header'
import Title from '../components/Title'
import CloseButton from '../components/html/CloseButton'

function HealthQna() {
  return (
    <>
      <Header title="건강 Q&A" rightContent={<CloseButton />} />
      <main className="page health_page health_qna_page">
        <Title as="h1" title="건강 Q&A">
          <p>궁금한 내용을 남기고 답변을 확인해 보세요.</p>
        </Title>
      </main>
    </>
  )
}

export default HealthQna
