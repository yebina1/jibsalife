import { useEffect, useMemo } from 'react'
import { Dog } from 'lucide-react'
import { useNavigate } from 'react-router'
import './HealthReport.css'
import { markHealthReportViewed } from '../../utils/challengeStatus'
import PageHeader from '../../components/PageHeader'
import HeaderIcon from '../../components/HeaderIcon'
import ChevronIcon from '../../components/ChevronIcon'
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

const chartHeights = [95, 110, 95, 105, 89, 110, 70] as const

const criteriaLeft = ['2일 이상 지속', '식사량 급감'] as const
const criteriaRight = ['활동량 급감', '구토, 설사 반복'] as const

function HealthReport() {
  const navigate = useNavigate()
  const pet = readSelectedPetProfile()

  const chartBars = useMemo(() => {
    const today = new Date()

    return chartHeights.map((height, index) => {
      const date = new Date(today)
      const dayOffset = chartHeights.length - 1 - index
      date.setDate(today.getDate() - dayOffset)

      return {
        label: dayOffset === 0 ? '오늘' : `${date.getMonth() + 1}/${date.getDate()}`,
        height,
        today: dayOffset === 0,
      }
    })
  }, [])

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

        <div className="hr_card hr_card_chart">
          <div className="hr_chart_header">
            <div className="hr_chart_header_left">
              <span className="hr_chart_title">최근 7일 활동량</span>
              <span className="hr_chart_subtitle">평균보다 15% 감소</span>
            </div>
            <span className="hr_badge">정상</span>
          </div>

          <div className="hr_chart_inner">
            <span className="hr_y_label" style={{ top: 0 }}>60분</span>
            <span className="hr_y_label" style={{ top: 40 }}>40분</span>
            <span className="hr_y_label" style={{ top: 80 }}>20분</span>
            <span className="hr_y_label" style={{ top: 120 }}>0분</span>

            {([10, 50, 90] as const).map((top) => (
              <div key={top} className="hr_h_line hr_h_line_dashed" style={{ top }} />
            ))}
            <div className="hr_h_line hr_h_line_solid" style={{ top: 130 }} />

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

        <div className="hr_actions">
          <button
            type="button"
            className="hr_action_card hr_action_hospital"
            onClick={() => navigate('/health/hospital')}
          >
            <img src={hospitalImage} alt="" aria-hidden="true" className="hr_action_img" />
            <div className="hr_action_text">
              <span className="hr_action_title_row">
                <p className="hr_action_title">병원 찾기</p>
                <span className="hr_action_arrow" aria-hidden="true">
                  <ChevronIcon direction="right" size="md" />
                </span>
              </span>
              <p className="hr_action_desc">{'내 주변 병원 검색\n및 정보 확인'}</p>
            </div>
          </button>
          <button
            type="button"
            aria-disabled="true"
            className="hr_action_card hr_action_consult"
          >
            <img
              src={consultImage}
              alt=""
              aria-hidden="true"
              className="hr_action_img hr_action_img_disabled"
            />
            <div className="hr_action_text">
              <span className="hr_action_title_row">
                <p className="hr_action_title hr_action_title_disabled">수의사 상담</p>
                <span className="hr_action_arrow hr_action_arrow_disabled" aria-hidden="true">
                  <ChevronIcon direction="right" size="md" />
                </span>
              </span>
              <p className="hr_action_desc hr_action_desc_disabled">{'실시간 상담으로\n전문가와 대화'}</p>
            </div>
          </button>
        </div>
      </main>
    </>
  )
}

export default HealthReport
