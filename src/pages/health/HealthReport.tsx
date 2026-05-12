import { useNavigate } from 'react-router'
import { CheckCircle2, Dog } from 'lucide-react'
import './HealthReport.css'
import PageHeader from '../../components/PageHeader'
import HeaderIcon from '../../components/HeaderIcon'
import BackButton from '../../components/html/BackButton'
import Button from '../../components/html/Button'
import hospitalImage from '../../img/hospital_3d.png'
import consultImage from '../../img/consult_3d.png'
import { readSelectedPetProfile } from '../../utils/petProfiles'

const sections = [
  {
    tag: '경미한 변화 감지',
    tagColor: '#DC2626',
    title: '활동량이 15% 감소했어요.',
    content: '활동 시간 : 평소 42분 → 오늘 36분\n식욕, 배변 등은 정상 범위예요.',
  },
  {
    tag: '스트레스 가능성 있음',
    tagColor: '#6D59F8',
    title: '스트레스 가능성이 있어요.',
    content: '최근 환경 변화가 있었나요?\n산책 시간이나 놀이 시간이 줄었나요?',
  },
  {
    tag: '소화 불량 가능성',
    tagColor: '#0E2C68',
    title: '구토나 설사는 없었나요?',
    content: '식사 후 헛구역질을 한 적이 있었나요?\n변 상태가 묽거나 무르지 않았나요?',
  },
  {
    tag: '지켜보고 필요 시 방문',
    tagColor: '#D65702',
    title: '아래 증상 시 병원 방문을 권장드립니다.',
    content:
      '증상이 2일 이상 지속될 경우, 식사나 활동량이 급격히 줄어든 경우나 구토, 설사 등이 반복되는 경우',
  },
] as const

function HealthReport() {
  const navigate = useNavigate()
  const pet = readSelectedPetProfile()

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
      <main className="page health_report_page">
        {/* 메인 리포트 카드 */}
        <div className="health_report_card">
          {/* 펫 정보 */}
          <div className="health_report_pet">
            <div className="health_report_pet_avatar">
              {pet.image ? (
                <img src={pet.image} alt={pet.name} />
              ) : (
                <Dog size={32} color="#505050" />
              )}
            </div>
            <div className="health_report_pet_text">
              <p className="health_report_pet_name">{pet.name}의 상태는</p>
              <p className="health_report_pet_status">
                지켜보면 괜찮을 것 같아요.
                <CheckCircle2 size={18} color="#22C55E" aria-hidden="true" />
              </p>
            </div>
          </div>

          <hr className="health_report_divider" />

          {/* 분석 섹션 4개 */}
          <div className="health_report_sections">
            {sections.map((section) => (
              <div key={section.tag} className="health_report_section">
                <div
                  className="health_report_section_tag"
                  style={{ color: section.tagColor, borderColor: section.tagColor }}
                >
                  {section.tag}
                </div>
                <p className="health_report_section_title">{section.title}</p>
                <p className="health_report_section_content">{section.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 하단 액션 카드 2개 */}
        <div className="health_report_actions">
          <button
            type="button"
            className="health_report_action_card health_report_action_hospital"
            onClick={() => navigate('/health/hospital')}
          >
            <img
              src={hospitalImage}
              width={100}
              height={100}
              style={{ objectFit: 'contain' }}
              alt=""
              aria-hidden="true"
            />
            <div className="health_report_action_text">
              <span className="health_report_action_title">병원 찾기</span>
              <span className="health_report_action_desc">내 주변 병원 검색{'\n'}및 정보 확인</span>
            </div>
          </button>
          <button
            type="button"
            className="health_report_action_card health_report_action_consult"
            onClick={() => navigate('/health/vet-chat')}
          >
            <img
              src={consultImage}
              width={100}
              height={100}
              style={{ objectFit: 'contain' }}
              alt=""
              aria-hidden="true"
            />
            <div className="health_report_action_text">
              <span className="health_report_action_title">수의사 상담</span>
              <span className="health_report_action_desc">실시간 상담으로{'\n'}전문가와 대화</span>
            </div>
          </button>
        </div>
      </main>
    </>
  )
}

export default HealthReport
