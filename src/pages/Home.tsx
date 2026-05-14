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
import Alert from '../components/Alert'
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
import {
  defaultPetProfiles,
  readPetProfiles,
  writePetProfiles,
  writeSelectedPetProfileId,
  type PetProfileSummary,
} from '../utils/petProfiles'
import { voteDetails } from './community/CommunityVoteData'
import knowledge1 from '../img/knowledge1.png'
import knowledge2 from '../img/knowledge2.png'
import knowledge3 from '../img/knowledge3.png'
import knowledge4 from '../img/knowledge4.png'
import animalCardImage from '../img/animal_card.png'
import bannerIcon2Image from '../img/banner_icon2.png'
import weeklyRankFirstImage from '../img/vote/vote_result/voting1.png'
import weeklyRankSecondImage from '../img/vote/pose_vote/pose_vote2.png'
import weeklyRankThirdImage from '../img/vote1/vote_bbung.jpg'

type PetIdCardForm = {
  name: string
  birthDate: string
  breed: string
  weight: string
  registrationNumber: string
  sex: string
  neutered: string
}

const emptyPetIdForm: PetIdCardForm = {
  name: '',
  birthDate: '',
  breed: '',
  weight: '',
  registrationNumber: '',
  sex: '',
  neutered: '',
}

const bestPoseVoteItems = voteDetails.find((voteDetail) => voteDetail.id === 'best-pose')?.candidates ?? []
const bestPoseVoteDetailPath = '/community/vote/detail?voteId=best-pose'

const weeklyRankingItems = [
  {
    id: 3,
    rank: 3,
    image: weeklyRankThirdImage,
    alt: '3위 반려동물 사진',
    objectPosition: 'center center',
  },
  {
    id: 1,
    rank: 1,
    image: weeklyRankFirstImage,
    alt: '1위 반려동물 사진',
    objectPosition: 'center center',
  },
  {
    id: 2,
    rank: 2,
    image: weeklyRankSecondImage,
    alt: '2위 반려동물 사진',
    objectPosition: 'center center',
  },
] as const

const contentItems = [
  {
    id: 1,
    title: '강아지 산책 안 하면\n생기는 문제점',
    image: knowledge1,
    objectPosition: '61% center',
    path: '/community/petstory/knowledge/walk-problems',
  },
  {
    id: 2,
    title: '고양이 점프의 숨겨진 비밀',
    image: knowledge2,
    objectPosition: '64% center',
    path: '/community/petstory/knowledge/walk-problems',
  },
  {
    id: 3,
    title: '강아지에게 절대 주면\n안되는 음식 7가지',
    image: knowledge3,
    objectPosition: '43% center',
    path: '/community/petstory/knowledge/walk-problems',
  },
  {
    id: 4,
    title: '봄청 강아지\n알레르기 증상과 관리법',
    image: knowledge4,
    objectPosition: '48% center',
    path: '/community/petstory/knowledge/walk-problems',
  },
] as const

type SummaryStat = {
  label: string
  value: string
}

type ProfileSummarySlide = PetProfileSummary

type AddSummarySlide = {
  id: number
  type: 'add'
}

function getInitialSummarySlideIndex() {
  return 0
}

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

function formatBirthDate(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 8)
  const year = digits.slice(0, 4)
  const month = digits.slice(4, 6)
  const day = digits.slice(6, 8)

  return [year, month, day].filter(Boolean).join('.')
}

function formatWeightValue(value: string) {
  const normalized = value.replace(/[^\d.]/g, '')
  const [integerPart, ...decimalParts] = normalized.split('.')
  const decimalPart = decimalParts.join('').slice(0, 2)

  return decimalParts.length > 0 ? `${integerPart}.${decimalPart}` : integerPart
}

function calculateAgeFromBirthDate(birthDate: string) {
  const match = birthDate.match(/^(\d{4})\.(\d{2})\.(\d{2})$/)

  if (!match) return ''

  const birthYear = Number(match[1])
  const birthMonth = Number(match[2])
  const birthDay = Number(match[3])
  const today = new Date()
  let age = today.getFullYear() - birthYear
  const hasBirthdayPassed =
    today.getMonth() + 1 > birthMonth ||
    (today.getMonth() + 1 === birthMonth && today.getDate() >= birthDay)

  if (!hasBirthdayPassed) {
    age -= 1
  }

  return `${Math.max(age, 0)}살`
}

function createProfileDetails(profile: ProfileSummarySlide) {
  const age = calculateAgeFromBirthDate(profile.birthDate)
  const sexLabel = profile.sex
  const weightLabel = profile.weight ? `${profile.weight} kg` : '-'

  return `나이: ${age || '-'} · 몸무게: ${weightLabel} · 성별: ${sexLabel || '-'}`
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
  const [profileSlides, setProfileSlides] = useState<ProfileSummarySlide[]>(readPetProfiles)
  const [summarySlideIndex, setSummarySlideIndex] = useState(getInitialSummarySlideIndex)
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [likedBestPoseIds, setLikedBestPoseIds] = useState<number[]>([])
  const [isPetIdModalOpen, setIsPetIdModalOpen] = useState(false)
  const [editingProfileId, setEditingProfileId] = useState<number | null>(null)
  const [petIdPhoto, setPetIdPhoto] = useState<string | null>(null)
  const [petIdForm, setPetIdForm] = useState<PetIdCardForm>(emptyPetIdForm)
  const [calendarRecords, setCalendarRecords] = useState<MissionHistoryRecord[]>(readCalendarRecords)
  const dragStateRef = useRef({ startX: 0 })
  const summarySlides = [
    ...profileSlides,
    {
      id: 3,
      type: 'add',
    },
  ] satisfies (ProfileSummarySlide | AddSummarySlide)[]

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

  useEffect(() => {
    writePetProfiles(profileSlides)

    const selectedProfile = profileSlides[summarySlideIndex]
    if (selectedProfile) {
      writeSelectedPetProfileId(selectedProfile.id)
    }
  }, [profileSlides, summarySlideIndex])

  useEffect(() => {
    if (!isPetIdModalOpen) return

    const scrollY = window.scrollY
    const previousOverflow = document.body.style.overflow
    const previousHtmlOverflow = document.documentElement.style.overflow
    const previousPosition = document.body.style.position
    const previousTop = document.body.style.top
    const previousWidth = document.body.style.width

    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.width = '100%'

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow
      document.body.style.overflow = previousOverflow
      document.body.style.position = previousPosition
      document.body.style.top = previousTop
      document.body.style.width = previousWidth
      window.scrollTo(0, scrollY)
    }
  }, [isPetIdModalOpen])

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
      [field]:
        field === 'birthDate'
          ? formatBirthDate(value)
          : field === 'weight'
            ? formatWeightValue(value)
            : field === 'registrationNumber'
              ? value.replace(/\D/g, '').slice(0, 15)
            : value,
    }))
  }

  const handlePetIdPhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPetIdPhoto(reader.result)
      }
    }
    reader.readAsDataURL(file)
  }

  const openPetIdModal = (profile?: ProfileSummarySlide) => {
    setEditingProfileId(profile?.id ?? null)
    setPetIdForm({
      ...emptyPetIdForm,
      name: profile?.name ?? '',
      breed: profile?.breed ?? '',
      birthDate: profile?.birthDate ?? '',
      weight: formatWeightValue(profile?.weight ?? ''),
      sex: profile?.sex ?? '',
    })
    setPetIdPhoto((prev) => {
      if (prev?.startsWith('blob:')) {
        URL.revokeObjectURL(prev)
      }
      return profile?.image ?? null
    })
    setIsPetIdModalOpen(true)
  }

  const closePetIdModal = () => {
    setIsPetIdModalOpen(false)
    setEditingProfileId(null)
  }

  const submitPetIdModal = () => {
    if (editingProfileId !== null) {
      setProfileSlides((current) =>
        current.map((profile) =>
          profile.id === editingProfileId
            ? {
                ...profile,
                name: petIdForm.name || profile.name,
                breed: petIdForm.breed || profile.breed,
                birthDate: petIdForm.birthDate,
                weight: petIdForm.weight,
                sex: petIdForm.sex,
                image: petIdPhoto || profile.image,
              }
            : profile,
        ),
      )
    } else {
      const nextProfile: ProfileSummarySlide = {
        id: Date.now(),
        type: 'profile',
        name: petIdForm.name || '이름',
        breed: petIdForm.breed || '품종',
        image: petIdPhoto || defaultPetProfiles[1].image,
        birthDate: petIdForm.birthDate,
        weight: petIdForm.weight,
        sex: petIdForm.sex,
      }

      setProfileSlides((current) => {
        const nextProfiles = [...current, nextProfile]
        setSummarySlideIndex(nextProfiles.length - 1)
        return nextProfiles
      })
    }

    closePetIdModal()
  }

  const deletePetIdProfile = () => {
    if (editingProfileId === null) {
      closePetIdModal()
      return
    }

    setProfileSlides((current) => {
      const deletedProfileIndex = current.findIndex((profile) => profile.id === editingProfileId)
      const nextProfiles = current.filter((profile) => profile.id !== editingProfileId)
      const nextProfileIndex =
        nextProfiles.length > 0 ? Math.min(Math.max(deletedProfileIndex, 0), nextProfiles.length - 1) : 0

      setSummarySlideIndex(nextProfileIndex)
      return nextProfiles
    })
    closePetIdModal()
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
                    details={createProfileDetails(slide)}
                    stats={todaySummaryStats}
                    onEdit={() => openPetIdModal(slide)}
                    onStatEdit={() => navigate('/mission')}
                    onCareGuideClick={() => navigate('/health/report')}
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

        <ContentSection
          className="home_section home_weekly_ranking_section"
          title="이번주 주인공은 나야 나!"
          subtitle="지난주 가장 많은 사랑을 받은 아이들을 만나보세요."
        >
          <div className="home_weekly_ranking_body">
            <div className="home_weekly_ranking_gallery" aria-label="주간 인기 반려동물 랭킹">
              {weeklyRankingItems.map((item) => (
                <article
                  key={item.id}
                  className={`home_weekly_ranking_card rank_${item.rank}`}
                  aria-label={`${item.rank}위`}
                >
                  <img src={item.image} alt={item.alt} style={{ objectPosition: item.objectPosition }} />
                  <strong>{item.rank}</strong>
                </article>
              ))}
            </div>

            <Button
              type="button"
              className="white_radius_btn home_weekly_ranking_button"
              onClick={() => navigate('/community/vote/result')}
            >
              랭킹 보기
            </Button>
          </div>
        </ContentSection>

        <ContentSection
          className="home_section"
          title="사진찍냥? BEST 포즈 투표하개!"
          subtitle="투표 기간에는 결과는 비공개 처리돼요. "
        >
          <div className="best_pose_vote_strip" aria-label="오늘의 베스트 포즈 투표 목록">
            {bestPoseVoteItems.map((item) => {
              const isLiked = likedBestPoseIds.includes(item.id)

              return (
                <article key={item.id} className="best_pose_vote_card">
                  <div className="best_pose_vote_card_media">
                    <img
                      src={item.image}
                      alt={`${item.name} 포즈 사진`}
                      style={{ objectPosition: item.objectPosition }}
                    />
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
            onClick={() => navigate(bestPoseVoteDetailPath)}
          >
           투표하기
          </Button>
        </ContentSection>

        <HomeSummaryBanner
          text={`궁금한 점이 있다면\n수의사와 상담해 보세요.`}
          imageSrc={bannerIcon2Image}
          backgroundColor="#EDE9FE"
          ariaLabel="수의사 상담 배너"
          rotateImage={false}
          imageWidth={112}
          imageHeight={105}
          imageTop={-20}
        />

        <ContentSection className="home_section home_content_section" title="반려상식">
          <div className="content_grid">
            {contentItems.map((item) => (
              <article key={item.id} className="content_card">
                <img src={item.image} alt={item.title} style={{ objectPosition: item.objectPosition }} />
                <div className="content_overlay">
                  <p className="p_semibold">{item.title}</p>
                </div>
              </article>
            ))}
          </div>

          <Button
            type="button"
            className="white_radius_btn more_button"
            onClick={() => navigate('/community/petstory/knowledge')}
          >
            더보기
            <ChevronIcon direction="right" size="md" />
          </Button>
        </ContentSection>

        {isPetIdModalOpen ? (
          <Alert onClose={closePetIdModal}>
            <div
              className="pet_id_modal_alert_content"
              role="document"
              aria-label={editingProfileId !== null ? '반려동물 프로필 수정하기' : '반려동물 프로필 등록하기'}
            >
              <div className="pet_id_modal_header">
                <h2>{editingProfileId !== null ? '반려동물 프로필 수정하기' : '반려동물 프로필 등록하기'}</h2>
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
                  <label
                    className={`pet_id_card_photo_upload${petIdPhoto ? ' has_photo' : ''}`}
                    htmlFor="pet-id-photo-upload"
                  >
                    {petIdPhoto ? (
                      <img
                        className="pet_id_card_photo"
                        src={petIdPhoto}
                        alt={petIdForm.name || '업로드한 반려동물 사진'}
                      />
                    ) : (
                      <span className="pet_id_card_photo_placeholder">
                        <strong>사진 업로드</strong>
                        <span>
                          클릭해서
                          <br />
                          이미지를
                          <br />
                          추가하세요
                        </span>
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
                    <div className="pet_id_card_field_row">
                      <div className="pet_id_card_field">
                        <span>생년월일 :</span>
                        <input
                          value={petIdForm.birthDate}
                          onChange={(event) => handlePetIdInputChange('birthDate', event.target.value)}
                          placeholder="0000.00.00"
                          inputMode="numeric"
                          maxLength={10}
                        />
                      </div>
                      <div className="pet_id_card_field pet_id_card_weight_field">
                        <span>몸무게 :</span>
                        <div className={`pet_id_card_weight_input${petIdForm.weight ? '' : ' is_empty'}`}>
                          <input
                            value={petIdForm.weight}
                            onChange={(event) => handlePetIdInputChange('weight', event.target.value)}
                            placeholder="0"
                            inputMode="decimal"
                            style={{ width: `${Math.max(petIdForm.weight.length || 1, 1)}ch` }}
                          />
                          <span>kg</span>
                        </div>
                      </div>
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
                        inputMode="numeric"
                        maxLength={15}
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
                    submitPetIdModal()
                  }}
                >
                  <div className="pet_id_form_actions">
                    <Button
                      type="button"
                      className="white_btn pet_id_form_cancel"
                      onClick={editingProfileId !== null ? deletePetIdProfile : closePetIdModal}
                    >
                      {editingProfileId !== null ? '삭제하기' : '이전'}
                    </Button>
                    <Button type="submit" className="purple_btn pet_id_form_submit">
                      확인
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </Alert>
        ) : null}
      </main>
    </>
  )
}

export default Home
