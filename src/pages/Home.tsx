import './Home.css'
import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router'
import ChevronIcon from '../components/ChevronIcon'
import PageHeader from '../components/PageHeader'
import HeaderIcon from '../components/HeaderIcon'
import ContentSection from '../components/ContentSection'
import HomeSummaryBanner from '../components/HomeSummaryBanner'
import SummaryProfileCard, { SummaryProfileAddCard } from '../components/SummaryProfileCard'
import Button from '../components/html/Button'
import {
  MISSION_ACTIVITY_RECORDS_CHANGE_EVENT,
  readMissionActivityRecords,
} from '../utils/missionActivityRecords'
import {
  MISSION_HISTORY_RECORDS_CHANGE_EVENT,
  readMissionHistoryRecordsWithDefaults,
  toMissionHistoryRecord,
  type MissionHistoryRecord,
} from '../utils/missionHistoryRecords'
import pungpungiImage from '../img/pungpungi.png'
import leeyoriImage from '../img/leeyori.png'
import contents1 from '../img/contents1.png'
import contents2 from '../img/contents2.png'
import contents3 from '../img/contents3.png'
import contents4 from '../img/contents4.png'
import animalCardImage from '../img/animal_card.png'
import bannerIconImage from '../img/banner_icon.png'
import bannerIcon2Image from '../img/banner_icon2.png'
import voteBbungImage from '../img/vote/vote_bbung.jpg'
import voteBongImage from '../img/vote/vote_bong.jpg'
import voteDoraImage from '../img/vote/vote_dora.jpg'
import voteGongsimImage from '../img/vote/vote_gongsim.jpg'
import voteHumninImage from '../img/vote/vote_humnin.jpg'
import voteKongyiImage from '../img/vote/vote_kongyi.png'
import voteLoyiImage from '../img/vote/vote_loyi.jpg'
import voteMongImage from '../img/vote/vote_mong.jpg'
import voteSeoljiImage from '../img/vote/vote_seolji.jpg'
import voteSyusyuImage from '../img/vote/vote_syusyu.jpg'

type PetIdCardForm = {
  name: string
  birthDate: string
  breed: string
  registrationNumber: string
  sex: string
  neutered: string
}

const emptyPetIdForm: PetIdCardForm = {
  name: '',
  birthDate: '',
  breed: '',
  registrationNumber: '',
  sex: '',
  neutered: '',
}

const bestPoseVoteItems = [
  { id: 1, name: '콩이', image: voteKongyiImage },
  { id: 2, name: '공심이', image: voteGongsimImage },
  { id: 3, name: '뿡뿡이', image: voteBbungImage },
  { id: 4, name: '도라', image: voteDoraImage },
  { id: 5, name: '준하', image: voteHumninImage },
  { id: 6, name: '재석', image: voteLoyiImage },
  { id: 7, name: '망수', image: voteBongImage },
  { id: 8, name: '하하', image: voteSyusyuImage },
  { id: 9, name: '형돈', image: voteMongImage },
  { id: 10, name: '공냥이', image: voteSeoljiImage },
] as const

const contentItems = [
  { id: 1, title: '활동량이 줄어든\n아이를 위한 추천 장난감', image: contents1 },
  { id: 2, title: '우리 아이 상태별 추천 혜택', image: contents2 },
  { id: 3, title: '우리 아이 상태별 추천 혜택', image: contents3 },
  { id: 4, title: '반려견을 위한\n케어 아이템 3종', image: contents4 },
]

type SummaryStat = {
  label: string
  value: string
}

type ProfileSummarySlide = {
  id: number
  type: 'profile'
  name: string
  breed: string
  image: string
  details: string
}

type AddSummarySlide = {
  id: number
  type: 'add'
}

const summarySlides = [
  {
    id: 1,
    type: 'profile',
    name: '이요리',
    breed: '코리안 쇼트 헤어',
    image: leeyoriImage,
    details: '나이: 5살 · 몸무게: 3 kg · 성별: 남아',
  },
  {
    id: 2,
    type: 'profile',
    name: '뿡뿡이',
    breed: '포메라니안',
    image: pungpungiImage,
    details: '나이: 2살 · 몸무게: 5 kg · 성별: 남아',
  },
  {
    id: 3,
    type: 'add',
  },
] satisfies (ProfileSummarySlide | AddSummarySlide)[]

function getTodayDateKey() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function readCalendarRecords() {
  return [
    ...readMissionActivityRecords().map(toMissionHistoryRecord),
    ...readMissionHistoryRecordsWithDefaults(),
  ]
}

function isMealRecord(record: MissionHistoryRecord) {
  return record.title.includes('식사') || record.color.toLowerCase() === '#ffd1a8'
}

function isPoopRecord(record: MissionHistoryRecord) {
  return record.title.includes('배변') || record.color.toLowerCase() === '#527ca3'
}

function parseWalkMinutes(detail: string) {
  const normalizedDetail = detail.replace(/\s+/g, ' ').trim()
  if (!normalizedDetail.includes('산책')) return 0

  const hourMinuteMatch = normalizedDetail.match(/(\d+)\s*시간\s*(\d+)?\s*분?/)
  if (hourMinuteMatch) {
    return Number(hourMinuteMatch[1]) * 60 + (hourMinuteMatch[2] ? Number(hourMinuteMatch[2]) : 0)
  }

  const minuteMatch = normalizedDetail.match(/(\d+)\s*분/)
  if (minuteMatch) {
    return Number(minuteMatch[1])
  }

  return 0
}

function createSummaryStats(records: MissionHistoryRecord[]): SummaryStat[] {
  const todayDateKey = getTodayDateKey()
  const todayRecords = records.filter((record) => record.date === todayDateKey)
  const mealCount = todayRecords.filter(isMealRecord).length
  const poopCount = todayRecords.filter(isPoopRecord).length
  const walkMinutes = todayRecords.reduce((sum, record) => sum + parseWalkMinutes(record.detail), 0)

  return [
    { label: '식사', value: `${mealCount}회` },
    { label: '배변', value: `${poopCount}회` },
    { label: '산책', value: `${walkMinutes}분` },
  ]
}

function formatTodaySummaryDate() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')

  return `${year}년 ${month}월 ${day}일`
}

function VoteHeartIcon({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={active ? 'best_pose_vote_card_heart is_active' : 'best_pose_vote_card_heart'}
    >
      <path d="M12 20.25 4.875 13.125A4.545 4.545 0 0 1 11.303 6.7L12 7.398l.697-.697a4.545 4.545 0 1 1 6.428 6.428Z" />
    </svg>
  )
}

function Home() {
  const navigate = useNavigate()
  const [summarySlideIndex, setSummarySlideIndex] = useState(1)
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [likedBestPoseIds, setLikedBestPoseIds] = useState<number[]>([])
  const [isPetIdModalOpen, setIsPetIdModalOpen] = useState(false)
  const [petIdPhoto, setPetIdPhoto] = useState<string | null>(null)
  const [petIdForm, setPetIdForm] = useState<PetIdCardForm>(emptyPetIdForm)
  const [calendarRecords, setCalendarRecords] = useState<MissionHistoryRecord[]>(readCalendarRecords)
  const dragStateRef = useRef({ startX: 0 })

  const todaySummaryDate = formatTodaySummaryDate()
  const todaySummaryStats = createSummaryStats(calendarRecords)

  useEffect(() => {
    return () => {
      if (petIdPhoto?.startsWith('blob:')) {
        URL.revokeObjectURL(petIdPhoto)
      }
    }
  }, [petIdPhoto])

  useEffect(() => {
    const syncCalendarRecords = () => {
      setCalendarRecords(readCalendarRecords())
    }

    window.addEventListener(MISSION_ACTIVITY_RECORDS_CHANGE_EVENT, syncCalendarRecords)
    window.addEventListener(MISSION_HISTORY_RECORDS_CHANGE_EVENT, syncCalendarRecords)
    window.addEventListener('storage', syncCalendarRecords)

    return () => {
      window.removeEventListener(MISSION_ACTIVITY_RECORDS_CHANGE_EVENT, syncCalendarRecords)
      window.removeEventListener(MISSION_HISTORY_RECORDS_CHANGE_EVENT, syncCalendarRecords)
      window.removeEventListener('storage', syncCalendarRecords)
    }
  }, [])

  const handleDragStart = (clientX: number) => {
    dragStateRef.current.startX = clientX
    setIsDragging(true)
    setDragOffset(0)
  }

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return
    setDragOffset(clientX - dragStateRef.current.startX)
  }

  const handleDragEnd = () => {
    if (!isDragging) return

    const threshold = 56

    if (dragOffset <= -threshold && summarySlideIndex < summarySlides.length - 1) {
      setSummarySlideIndex((current) => current + 1)
    } else if (dragOffset >= threshold && summarySlideIndex > 0) {
      setSummarySlideIndex((current) => current - 1)
    }

    setIsDragging(false)
    setDragOffset(0)
  }

  const handlePetIdInputChange = (field: keyof PetIdCardForm, value: string) => {
    setPetIdForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handlePetIdPhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setPetIdPhoto((prev) => {
      if (prev?.startsWith('blob:')) {
        URL.revokeObjectURL(prev)
      }
      return URL.createObjectURL(file)
    })
  }

  const openPetIdModal = () => {
    setPetIdForm(emptyPetIdForm)
    setPetIdPhoto((prev) => {
      if (prev?.startsWith('blob:')) {
        URL.revokeObjectURL(prev)
      }
      return null
    })
    setIsPetIdModalOpen(true)
  }

  const closePetIdModal = () => {
    setIsPetIdModalOpen(false)
  }

  const toggleBestPoseLike = (id: number) => {
    setLikedBestPoseIds((current) =>
      current.includes(id) ? current.filter((itemId) => itemId !== id) : [...current, id],
    )
  }

  return (
    <>
      <PageHeader
        title="집사인생"
        rightContent={
          <>
            <Button type="button" aria-label="캘린더" onClick={() => navigate('/mission')}>
              <HeaderIcon type="calendar" />
            </Button>
            <Button
              type="button"
              aria-label="알림"
              onClick={() => navigate('/mission')}
            >
              <HeaderIcon type="notification" />
            </Button>
          </>
        }
      />

      <main className="page home_page">
        <ContentSection
          className="home_section home_summary_section"
          headerClassName="home_summary_header"
          title="오늘의 요약"
          subtitle={todaySummaryDate}
        >
          <div
            className="summary_slider"
            aria-label="오늘의 요약 슬라이드"
            onPointerDown={(event) => {
              handleDragStart(event.clientX)
              event.currentTarget.setPointerCapture(event.pointerId)
            }}
            onPointerMove={(event) => handleDragMove(event.clientX)}
            onPointerUp={(event) => {
              if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                event.currentTarget.releasePointerCapture(event.pointerId)
              }
              handleDragEnd()
            }}
            onPointerCancel={(event) => {
              if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                event.currentTarget.releasePointerCapture(event.pointerId)
              }
              handleDragEnd()
            }}
          >
            <div
              className={`summary_slider_track ${isDragging ? 'dragging' : ''}`}
              style={{
                transform: `translateX(calc(-${summarySlideIndex * 100}% - ${summarySlideIndex * 8}px + ${dragOffset}px))`,
              }}
            >
              {summarySlides.map((slide) =>
                slide.type === 'add' ? (
                  <SummaryProfileAddCard key={slide.id} onClick={openPetIdModal} />
                ) : (
                  <SummaryProfileCard
                    key={slide.id}
                    image={slide.image}
                    name={slide.name}
                    breed={slide.breed}
                    details={slide.details}
                    stats={todaySummaryStats}
                    onStatEdit={() => navigate('/mission')}
                  />
                ),
              )}
            </div>

            <div className="summary_slider_dots" aria-label="요약 슬라이드 페이지">
              {summarySlides.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  className={index === summarySlideIndex ? 'active' : ''}
                  aria-label={`${index + 1}번 요약 보기`}
                  aria-pressed={index === summarySlideIndex}
                  onClick={() => setSummarySlideIndex(index)}
                />
              ))}
            </div>
          </div>

        </ContentSection>

        <HomeSummaryBanner
          text={`AI로 우리 아이\n건강 상태를 확인해 보세요.`}
          imageSrc={bannerIconImage}
          backgroundColor="#43779E"
          ariaLabel="AI 건강 배너"
        />

        <ContentSection
          className="home_section"
          title="오늘의 BEST 포즈는?!"
          subtitle="투표 기간에는 결과는 비공개 처리돼요. "
        >
          <div className="best_pose_vote_strip" aria-label="오늘의 베스트 포즈 투표 목록">
            {bestPoseVoteItems.map((item) => {
              const isLiked = likedBestPoseIds.includes(item.id)

              return (
                <article key={item.id} className="best_pose_vote_card">
                  <div className="best_pose_vote_card_media">
                    <img src={item.image} alt={`${item.name} 포즈 사진`} />
                    <button
                      type="button"
                      className={`best_pose_vote_card_like${isLiked ? ' is_active' : ''}`}
                      aria-label={isLiked ? `${item.name} 좋아요 취소` : `${item.name} 좋아요`}
                      aria-pressed={isLiked}
                      onClick={() => toggleBestPoseLike(item.id)}
                    >
                      <VoteHeartIcon active={isLiked} />
                    </button>
                  </div>
                  <p className="p_semibold">{item.name}</p>
                </article>
              )
            })}
          </div>

          <Button
            type="button"
            className="white_radius_btn more_button"
            onClick={() => navigate('/community/vote')}
          >
           투표하기
          </Button>
        </ContentSection>

        <HomeSummaryBanner
          text={`궁금한 점이 있다면\n수의사와 상담해 보세요.`}
          imageSrc={bannerIcon2Image}
          backgroundColor="#599C64"
          ariaLabel="수의사 상담 배너"
          rotateImage={false}
          imageWidth={95.49}
          imageHeight={89.5}
          imageTop={-16}
        />

        <ContentSection className="home_section home_content_section" title="추천 콘텐츠">
          <div className="content_grid">
            {contentItems.map((item) => (
              <article key={item.id} className="content_card">
                <img src={item.image} alt={item.title} />
                <div className="content_overlay">
                  <p className="p_semibold">{item.title}</p>
                </div>
              </article>
            ))}
          </div>

          <Button
            type="button"
            className="white_radius_btn more_button"
            onClick={() => navigate('/community/petstory?tab=knowledge')}
          >
            더보기
            <ChevronIcon direction="right" size="md" />
          </Button>
        </ContentSection>

        {isPetIdModalOpen ? (
          <section className="pet_id_modal" role="dialog" aria-modal="true" aria-label="동물등록증 등록하기">
            <div className="pet_id_modal_backdrop" onClick={closePetIdModal} />
            <div className="pet_id_modal_sheet">
              <div className="pet_id_modal_header">
                <h2>동물등록증 등록하기</h2>
                <button type="button" aria-label="닫기" onClick={closePetIdModal}>
                  ×
                </button>
              </div>

              <div className="pet_id_modal_body">
                <div
                  className="pet_id_card_preview"
                  style={{ backgroundImage: `url(${animalCardImage})` }}
                >
                  <div className="pet_id_card_title">동물등록증</div>
                  <input
                    id="pet-id-photo-upload"
                    className="pet_id_card_photo_input"
                    type="file"
                    accept="image/*"
                    onChange={handlePetIdPhotoChange}
                  />
                  <label className="pet_id_card_photo_upload" htmlFor="pet-id-photo-upload">
                    {petIdPhoto ? (
                      <img
                        className="pet_id_card_photo"
                        src={petIdPhoto}
                        alt={petIdForm.name || '업로드한 반려동물 사진'}
                      />
                    ) : (
                      <span className="pet_id_card_photo_placeholder">
                        <strong>사진 업로드</strong>
                        <span>클릭해서 이미지를 추가하세요</span>
                      </span>
                    )}
                  </label>
                  <div className="pet_id_card_copy">
                    <div className="pet_id_card_field">
                      <span>이름 :</span>
                      <input
                        value={petIdForm.name}
                        onChange={(event) => handlePetIdInputChange('name', event.target.value)}
                        placeholder="이름"
                      />
                    </div>
                    <div className="pet_id_card_field">
                      <span>생년월일 :</span>
                      <input
                        value={petIdForm.birthDate}
                        onChange={(event) => handlePetIdInputChange('birthDate', event.target.value)}
                        placeholder="YYYY.MM.DD"
                      />
                    </div>
                    <div className="pet_id_card_field">
                      <span>품종 :</span>
                      <input
                        value={petIdForm.breed}
                        onChange={(event) => handlePetIdInputChange('breed', event.target.value)}
                        placeholder="품종"
                      />
                    </div>
                    <div className="pet_id_card_field">
                      <span>등록번호 :</span>
                      <input
                        value={petIdForm.registrationNumber}
                        onChange={(event) =>
                          handlePetIdInputChange('registrationNumber', event.target.value)
                        }
                        placeholder="등록번호"
                      />
                    </div>
                    <div className="pet_id_card_field">
                      <span>성별 :</span>
                      <div className="pet_id_card_radio_group" role="radiogroup" aria-label="성별">
                        {['남', '여'].map((option) => (
                          <label key={option} className="pet_id_card_radio">
                            <input
                              type="radio"
                              name="pet-id-sex"
                              value={option}
                              checked={petIdForm.sex === option}
                              onChange={(event) => handlePetIdInputChange('sex', event.target.value)}
                            />
                            <span>{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="pet_id_card_field">
                      <span>중성화 여부 :</span>
                      <div className="pet_id_card_radio_group" role="radiogroup" aria-label="중성화 여부">
                        {['O', 'X'].map((option) => (
                          <label key={option} className="pet_id_card_radio">
                            <input
                              type="radio"
                              name="pet-id-neutered"
                              value={option}
                              checked={petIdForm.neutered === option}
                              onChange={(event) => handlePetIdInputChange('neutered', event.target.value)}
                            />
                            <span>{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <form
                  className="pet_id_form"
                  onSubmit={(event) => {
                    event.preventDefault()
                    closePetIdModal()
                  }}
                >
                  <div className="pet_id_form_actions">
                    <Button type="button" className="pet_id_form_cancel" onClick={closePetIdModal}>
                      이전
                    </Button>
                    <Button type="submit" className="purple_btn pet_id_form_submit">
                      확인
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </section>
        ) : null}
      </main>
    </>
  )
}

export default Home
