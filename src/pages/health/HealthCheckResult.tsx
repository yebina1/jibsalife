import { useMemo } from 'react'
import { useNavigate } from 'react-router'
import './Health.css'
import './HealthCheckResult.css'
import PageHeader from '../../components/PageHeader'
import BackButton from '../../components/html/BackButton'
import HeaderIcon from '../../components/HeaderIcon'
import Button from '../../components/html/Button'
import dogSittingImage from '../../img/dog_sitting.png'
import foodBowlImage from '../../img/food_bowl.png'
import { readPetProfiles, readSelectedPetProfileId } from '../../utils/petProfiles'
import { calculateHealthResult, readStoredHealthResultInput } from '../../utils/healthResultPolicy'

const activityData = [
  { label: '5/1', minutes: 48 },
  { label: '5/2', minutes: 55 },
  { label: '5/3', minutes: 46 },
  { label: '5/4', minutes: 50 },
  { label: '5/5', minutes: 44 },
  { label: '5/6', minutes: 56 },
  { label: '오늘', minutes: 38 },
]

const CHART_MAX = 60

const hospitalGuideItems = ['2일 이상 지속', '활동량 급감', '식사량 급감', '구토,설사 반복']

function HealthCheckResult() {
  const navigate = useNavigate()

  const pets = useMemo(() => readPetProfiles(), [])
  const selectedPetId = useMemo(() => readSelectedPetProfileId(), [])
  const selectedPet = useMemo(
    () => pets.find((p) => p.id === selectedPetId) ?? pets[0] ?? null,
    [pets, selectedPetId],
  )
  const petName = selectedPet?.name ?? '반려동물'
  const petImage = selectedPet?.image || dogSittingImage

  const result = useMemo(() => calculateHealthResult(readStoredHealthResultInput()), [])
  const isPositive =
    result.status.tone === 'excellent' ||
    result.status.tone === 'good' ||
    result.status.tone === 'normal'

  return (
    <>
      <PageHeader
        title="AI 건강 체크"
        leftContent={<BackButton />}
        rightContent={
          <>
            <Button type="button" aria-label="calendar" onClick={() => navigate('/mission')}>
              <HeaderIcon type="calendar" />
            </Button>
            <Button type="button" aria-label="notification">
              <HeaderIcon type="notification" />
            </Button>
          </>
        }
      />
      <main className="page health_page health_check_result_page">

        {/* 펫 상태 카드 */}
        <section className="hcr_card hcr_pet_card">
          <img className="hcr_pet_img" src={petImage} alt={petName} />
          <p className="hcr_pet_msg">
            <strong>{petName}</strong>의 상태는<br />
            {result.status.message}.
          </p>
          <span className={`hcr_pet_check${isPositive ? ' is_positive' : ''}`} aria-hidden="true">
            <i className="bx bxs-check-circle" />
          </span>
        </section>

        {/* 최근 7일 활동량 */}
        <section className="hcr_card hcr_chart_card">
          <div className="hcr_chart_header">
            <div>
              <h2 className="hcr_chart_title">최근 7일 활동량</h2>
              <p className="hcr_chart_subtitle">평균보다 15% 감소</p>
            </div>
            <span className="hcr_badge">정상</span>
          </div>
          <div className="hcr_chart" aria-hidden="true">
            <div className="hcr_chart_yaxis">
              <span>60분</span>
              <span>40분</span>
              <span>20분</span>
              <span>0분</span>
            </div>
            <div className="hcr_chart_plot">
              <div className="hcr_chart_grid">
                <span /><span /><span /><span />
              </div>
              <div className="hcr_chart_bars">
                {activityData.map((d) => (
                  <div key={d.label} className="hcr_chart_bar_col">
                    <div
                      className={`hcr_chart_bar${d.label === '오늘' ? ' is_today' : ''}`}
                      style={{ height: `${(d.minutes / CHART_MAX) * 100}%` }}
                    />
                  </div>
                ))}
              </div>
              <div className="hcr_chart_xlabels">
                {activityData.map((d) => (
                  <span
                    key={d.label}
                    className={`hcr_chart_xlabel${d.label === '오늘' ? ' is_today' : ''}`}
                  >
                    {d.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 식욕 / 배변 */}
        <section className="hcr_card hcr_status_pair_card">
          <div className="hcr_status_pair_item">
            <img src={foodBowlImage} alt="" aria-hidden="true" className="hcr_status_pair_img" />
            <strong className="hcr_status_pair_label">식욕</strong>
            <span className="hcr_badge">정상</span>
          </div>
          <div className="hcr_status_pair_divider" aria-hidden="true" />
          <div className="hcr_status_pair_item">
            <span className="hcr_status_pair_emoji" aria-hidden="true">💩</span>
            <strong className="hcr_status_pair_label">배변</strong>
            <span className="hcr_badge">정상</span>
          </div>
        </section>

        {/* 병원 방문 권장 기준 */}
        <section className="hcr_card hcr_guide_card">
          <div className="hcr_guide_header">
            <span className="hcr_guide_icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L3 7V12C3 16.55 6.84 20.74 12 22C17.16 20.74 21 16.55 21 12V7L12 2Z" fill="#6d59f8" />
                <path d="M12 8V16" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <path d="M8 12H16" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
            <h2 className="hcr_guide_title">병원 방문 권장 기준</h2>
          </div>
          <div className="hcr_guide_grid">
            {hospitalGuideItems.map((item) => (
              <div key={item} className="hcr_guide_item">
                <i className="bx bxs-check-circle hcr_guide_check" aria-hidden="true" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 하단 액션 버튼 */}
        <div className="hcr_actions">
          <button type="button" className="hcr_action hcr_action_hospital">
            <span className="hcr_action_emoji" aria-hidden="true">🏥</span>
            <div className="hcr_action_content">
              <span className="hcr_action_title">병원 찾기 &gt;</span>
              <span className="hcr_action_desc">내 주변 병원 검색<br />및 정보 확인</span>
            </div>
          </button>
          <button type="button" className="hcr_action hcr_action_vet">
            <span className="hcr_action_emoji" aria-hidden="true">💬</span>
            <div className="hcr_action_content">
              <span className="hcr_action_title">수의사 상담 &gt;</span>
              <span className="hcr_action_desc">실시간 상담으로<br />전문가와 대화</span>
            </div>
          </button>
        </div>

        <p className="hcr_notice">
          ※ 이 결과는 참고용이며,<br />
          정확한 진단은 수의사 상담을 통해 확인해주세요.
        </p>
      </main>
    </>
  )
}

export default HealthCheckResult
