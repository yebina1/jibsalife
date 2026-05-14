import { useEffect } from 'react'
import { Dog } from 'lucide-react'
import { useNavigate } from 'react-router'
import './HealthReport.css'
import { markHealthReportViewed } from '../../utils/challengeStatus'
import PageHeader from '../../components/PageHeader'
import HeaderIcon from '../../components/HeaderIcon'
import BackButton from '../../components/html/BackButton'
import Button from '../../components/html/Button'
import hospitalImage from '../../img/hospital_3d.png'
import consultImage from '../../img/consult_3d.png'
import iconMeal from '../../img/icon_meal.png'
import iconPoop from '../../img/icon_poop.png'
import healthShield from '../../img/health_shield.png'
import blueCheckIcon from '../../img/blue-check-icon.png'
import checkIcon from '../../img/check-icon.png'
import { readSelectedPetProfile } from '../../utils/petProfiles'

const chartBars = [
  { label: '5/1', height: 95, today: false },
  { label: '5/2', height: 110, today: false },
  { label: '5/3', height: 95, today: false },
  { label: '5/4', height: 105, today: false },
  { label: '5/5', height: 89, today: false },
  { label: '5/6', height: 110, today: false },
  { label: '오늘', height: 70, today: true },
] as const

const criteriaLeft = ['2일 이상 지속', '식사량 급감'] as const
const criteriaRight = ['활동량 급감', '구토,설사 반복'] as const

function HealthReport() {
  const navigate = useNavigate()
  const pet = readSelectedPetProfile()

  useEffect(() => {
    markHealthReportViewed()
  }, [])

  return (
    <>
      <PageHeader
        title="AI 건강 체크"
        leftContent={<BackButton to="/health/cam" replace />}
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
      <main className="page hr_page">

        {/* ── 카드 1: 펫 상태 총평 ── */}
        <div className="hr_card hr_card_pet">
          <div className="hr_pet">
            <div className="hr_pet_avatar">
              {pet.image ? (
                <img src={pet.image} alt={pet.name} />
              ) : (
                <Dog size={32} color="#505050" />
              )}
            </div>
            <div className="hr_pet_text">
              <p className="hr_pet_name">{pet.name}의 상태는</p>
              <p className="hr_pet_status" style={{ whiteSpace: 'nowrap' }}>
                지켜보면 괜찮을 것 같아요.
                <img src={checkIcon} alt="" aria-hidden="true" className="hr_pet_check_icon" />
              </p>
            </div>
          </div>
        </div>

        {/* ── 카드 2: 최근 7일 활동량 차트 ── */}
        <div className="hr_card hr_card_chart">
          <div className="hr_chart_header">
            <div className="hr_chart_header_left">
              <span className="hr_chart_title">최근 7일 활동량</span>
              <span className="hr_chart_subtitle">평균보다 15% 감소</span>
            </div>
            <span className="hr_badge">정상</span>
          </div>

          <div className="hr_chart_inner">
            {/* Y축 레이블 */}
            <span className="hr_y_label" style={{ top: 0 }}>60분</span>
            <span className="hr_y_label" style={{ top: 40 }}>40분</span>
            <span className="hr_y_label" style={{ top: 80 }}>20분</span>
            <span className="hr_y_label" style={{ top: 120 }}>0분</span>

            {/* 수평 점선 */}
            {([10, 50, 90] as const).map((top) => (
              <div key={top} className="hr_h_line hr_h_line_dashed" style={{ top }} />
            ))}
            <div className="hr_h_line hr_h_line_solid" style={{ top: 130 }} />

            {/* 막대 그룹 */}
            <div className="hr_bars">
              {chartBars.map((bar) => (
                <div key={bar.label} className="hr_bar_group">
                  <div
                    className="hr_bar"
                    style={{
                      height: bar.height,
                      backgroundColor: bar.today ? '#6D59F8' : '#C4B5FD',
                    }}
                  />
                  <span className={`hr_bar_label${bar.today ? ' today' : ''}`}>
                    {bar.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── 카드 3: 식욕 / 배변 상태 ── */}
        <div className="hr_card hr_card_appetite">
          <div className="hr_appetite_col">
            <div className="hr_appetite_icon_wrap">
              <img src={iconMeal} alt="" aria-hidden="true" style={{ objectFit: 'cover' }} />
            </div>
            <div className="hr_appetite_label_row">
              <span className="hr_appetite_label">식욕</span>
              <span className="hr_badge">정상</span>
            </div>
          </div>
          <div className="hr_appetite_divider" aria-hidden="true" />
          <div className="hr_appetite_col">
            <div className="hr_appetite_icon_wrap">
              <img src={iconPoop} alt="" aria-hidden="true" style={{ objectFit: 'contain' }} />
            </div>
            <div className="hr_appetite_label_row">
              <span className="hr_appetite_label">배변</span>
              <span className="hr_badge">정상</span>
            </div>
          </div>
        </div>

        {/* ── 카드 4: 병원 방문 권장 기준 ── */}
        <div className="hr_card hr_card_criteria">
          <div className="hr_criteria_header">
            <div className="hr_criteria_shield_wrap">
              <img src={healthShield} alt="" aria-hidden="true" />
            </div>
            <span className="hr_criteria_title">병원 방문 권장 기준</span>
          </div>
          <div className="hr_criteria_grid">
            <div className="hr_criteria_col">
              {criteriaLeft.map((text) => (
                <div key={text} className="hr_criteria_item">
                  <img src={blueCheckIcon} alt="" aria-hidden="true" className="hr_criteria_check" />
                  <span className="hr_criteria_text">{text}</span>
                </div>
              ))}
            </div>
            <div className="hr_criteria_col">
              {criteriaRight.map((text) => (
                <div key={text} className="hr_criteria_item">
                  <img src={blueCheckIcon} alt="" aria-hidden="true" className="hr_criteria_check" />
                  <span className="hr_criteria_text">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── 카드 5: 병원찾기 / 수의사상담 ── */}
        <div className="hr_actions">
          <button
            type="button"
            className="hr_action_card hr_action_hospital"
            onClick={() => navigate('/health/hospital')}
          >
            <img src={hospitalImage} alt="" aria-hidden="true" className="hr_action_img" />
            <div className="hr_action_text">
              <p className="hr_action_title">병원 찾기</p>
              <p className="hr_action_desc">{'내 주변 병원 검색\n및 정보 확인'}</p>
            </div>
          </button>
          <button
            type="button"
            aria-disabled="true"
            className="hr_action_card hr_action_consult"
          >
            <img src={consultImage} alt="" aria-hidden="true" className="hr_action_img hr_action_img_disabled" />
            <div className="hr_action_text">
              <p className="hr_action_title hr_action_title_disabled">수의사 상담</p>
              <p className="hr_action_desc hr_action_desc_disabled">{'실시간 상담으로\n전문가와 대화'}</p>
            </div>
          </button>
        </div>

      </main>
    </>
  )
}

export default HealthReport
