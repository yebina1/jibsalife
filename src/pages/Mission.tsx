import Header from '../components/Header'
import BackButton from '../components/html/BackButton'

function Mission() {
  return (
    <>
      <Header title="미션" leftContent={<BackButton />} />
      <main className="page mission_page">
        <h1>미션</h1>
      </main>
    </>
  )
}

export default Mission
