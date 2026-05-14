import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { ChevronRight, Dog } from 'lucide-react'
import './Health.css'
import pungpungiImage from '../../img/pungpungi.png'
import leeyoriImage from '../../img/leeyori.png'
import galleryIcon from '../../img/gallery-icon.svg'
import cameraFlipIcon from '../../img/camera-flip-icon.svg'
import AddSheet from '../../components/AddSheet'
import ChevronIcon from '../../components/ChevronIcon'
import BackButton from '../../components/html/BackButton'
import MissionRecordSheet from '../../components/MissionRecordSheet'
import StateBar from '../../components/StateBar'
import {
  readPetProfiles,
  readSelectedPetProfileId,
  writeSelectedPetProfileId,
  PET_PROFILES_CHANGE_EVENT,
  type PetProfileSummary,
} from '../../utils/petProfiles'
import {
  readMissionHistoryRecordsWithDefaults,
  writeStoredMissionHistoryRecords,
  MISSION_HISTORY_RECORDS_CHANGE_EVENT,
  type MissionHistoryRecord,
} from '../../utils/missionHistoryRecords'

const today = new Date()

type CategoryOption = {
  id: string
  label: string
  color: string
}

const categoryOptions: CategoryOption[] = [
  { id: 'meal', label: '식사 기록', color: '#ffd1a8' },
  { id: 'poop', label: '배변 기록', color: '#527ca3' },
  { id: 'activity', label: '활동 기록', color: '#428fe6' },
  { id: 'symptom', label: '증상', color: '#b9dfe3' },
]

const quickMessages = [
  '사료 30g',
  '사료 60g',
  '사료 90g',
  '사료 120g',
  '사료 150g',
]

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

function getDateKey(year: number, month: number, day: number) {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function getPetAge(birthDate: string): string {
  const parts = birthDate.split('.')
  if (parts.length < 3) return ''
  const birth = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]))
  const now = new Date()
  let age = now.getFullYear() - birth.getFullYear()
  if (
    now.getMonth() < birth.getMonth() ||
    (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate())
  ) {
    age--
  }
  return age <= 0 ? '1살 미만' : `${age}살`
}

function Health() {
  const navigate = useNavigate()
  const videoRef = useRef<HTMLVideoElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const recordingChunksRef = useRef<Blob[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [capturedVideo, setCapturedVideo] = useState<string | null>(null)
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment')
  const [isCameraAvailable, setIsCameraAvailable] = useState(true)
  const [cameraMode, setCameraMode] = useState<'photo' | 'video'>('photo')
  const [activeTab, setActiveTab] = useState<'camera' | 'memo'>('camera')
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [showPetModal, setShowPetModal] = useState(false)
  const [showCalendarPetSwitch, setShowCalendarPetSwitch] = useState(false)
  const [pets, setPets] = useState<PetProfileSummary[]>(readPetProfiles)
  const [selectedPetId, setSelectedPetId] = useState<number | null>(null)

  // 메모 바텀시트 state
  const [showMemoSheet, setShowMemoSheet] = useState(false)
  const [showCalendarMemoSheet, setShowCalendarMemoSheet] = useState(false)
  const [selectedCategoryId, setSelectedCategoryId] = useState(categoryOptions[0].id)
  const [memoText, setMemoText] = useState('')
  const [selectedAmount, setSelectedAmount] = useState('')
  const [feedAmount, setFeedAmount] = useState(30)

  useEffect(() => {
    const sync = () => {
      setPets(readPetProfiles())
    }
    window.addEventListener(PET_PROFILES_CHANGE_EVENT, sync)
    return () => window.removeEventListener(PET_PROFILES_CHANGE_EVENT, sync)
  }, [])

  useEffect(() => {
    let stream: MediaStream

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode } })
      .then((s) => {
        stream = s
        if (videoRef.current) {
          videoRef.current.srcObject = s
          videoRef.current.play()
        }
        setIsCameraAvailable(true)
      })
      .catch((err) => {
        console.error('카메라 접근 실패:', err)
        setIsCameraAvailable(false)
      })

    return () => {
      stream?.getTracks().forEach((t) => t.stop())
    }
  }, [facingMode])

  const handleFlip = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'))
  }

  const handleCapture = () => {
    if (!isMobile) {
      setCapturedImage(pungpungiImage)
      return
    }

    if (cameraMode === 'photo') {
      const video = videoRef.current
      if (!video || video.videoWidth === 0 || video.videoHeight === 0) {
        console.error('비디오 스트림 준비 안됨')
        setCapturedImage(pungpungiImage)
        return
      }
      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      canvas.getContext('2d')!.drawImage(video, 0, 0)
      setCapturedImage(canvas.toDataURL('image/jpeg'))
      video.pause()
      return
    }

    // VIDEO 모드
    if (isRecording) {
      mediaRecorderRef.current?.stop()
      return
    }

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        const recorder = new MediaRecorder(stream)
        mediaRecorderRef.current = recorder
        recordingChunksRef.current = []

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) recordingChunksRef.current.push(e.data)
        }

        recorder.onstop = () => {
          const blob = new Blob(recordingChunksRef.current, { type: 'video/webm' })
          setCapturedVideo(URL.createObjectURL(blob))
          stream.getTracks().forEach((t) => t.stop())
          setIsRecording(false)
        }

        recorder.start()
        setIsRecording(true)
      })
      .catch((err) => {
        console.error('카메라/마이크 접근 실패:', err)
        alert('카메라 또는 마이크 권한이 필요합니다.')
      })
  }

  const handleGalleryClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setCapturedImage(URL.createObjectURL(file))
    e.target.value = ''
  }

  const handleRetake = () => {
    if (capturedImage?.startsWith('blob:')) URL.revokeObjectURL(capturedImage)
    if (capturedVideo) URL.revokeObjectURL(capturedVideo)
    setCapturedImage(null)
    setCapturedVideo(null)
    videoRef.current?.play()
  }

  const handleUpload = () => {
    // TODO: API 연결 예정 — capturedImage를 서버에 업로드 후 분석 요청
    navigate('/health/check')
  }

  const handleSelectPet = (pet: PetProfileSummary) => {
    writeSelectedPetProfileId(pet.id)
    setSelectedPetId(pet.id)
    setShowPetModal(false)
    setShowCalendarPetSwitch(false)
  }

  // 메모 저장 로직
  const selectedCategory = categoryOptions.find((c) => c.id === selectedCategoryId) ?? categoryOptions[0]
  const isActive = memoText.trim() !== '' || selectedAmount !== '' || (selectedCategory.id === 'meal' && feedAmount > 0)

  const handleMemoSave = () => {
    const primaryDetail = selectedCategory.id === 'meal' && feedAmount > 0
      ? `사료 ${feedAmount}g`
      : selectedAmount
    const title = [primaryDetail, memoText.trim()].filter(Boolean).join('\n').trim()
    if (!title) return

    const now = new Date()
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    const recordTitle = selectedCategory.label === '증상' ? '증상 기록' : selectedCategory.label
    const recordDate = getDateKey(today.getFullYear(), today.getMonth() + 1, today.getDate())

    const newItem: MissionHistoryRecord = {
      id: Date.now(),
      title: recordTitle,
      detail: title,
      time,
      color: selectedCategory.color,
      date: recordDate,
    }
    const existing = readMissionHistoryRecordsWithDefaults()
    writeStoredMissionHistoryRecords([newItem, ...existing])
    window.dispatchEvent(new CustomEvent(MISSION_HISTORY_RECORDS_CHANGE_EVENT, { detail: newItem }))
    setMemoText('')
    setSelectedAmount('')
    setFeedAmount(30)
  }

  const handleMemoSaveOnly = () => {
    handleMemoSave()
    setShowMemoSheet(false)
    setShowCalendarMemoSheet(false)
  }

  const handleMemoUpload = () => {
    handleMemoSave()
    navigate('/health/check')
  }

  const handleCategoryClick = () => {
    const idx = categoryOptions.findIndex((c) => c.id === selectedCategoryId)
    setSelectedCategoryId(categoryOptions[(idx + 1) % categoryOptions.length].id)
  }

  const selectedPetName = pets.find((p) => p.id === selectedPetId)?.name || ''

  return (
    <main className="health_cam_ui">
      <StateBar />
      <section className="health_cam_view" aria-label="카메라 뷰">
        {capturedVideo ? (
          <video className="health_cam_img" src={capturedVideo} controls playsInline />
        ) : capturedImage ? (
          <img className="health_cam_img" src={capturedImage} alt="촬영된 사진" />
        ) : isCameraAvailable ? (
          <video ref={videoRef} className="health_cam_video" autoPlay muted playsInline />
        ) : (
          <img className="health_cam_img health_cam_img_fallback" src={leeyoriImage} alt="" aria-hidden="true" />
        )}
        <div className="health_cam_overlay" aria-hidden="true" />
        <BackButton
          bgColor="#505050"
          iconColor="#fff"
          size={36}
          className="health_cam_close_btn"
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          }
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            zIndex: 2,
            borderRadius: '50%',
            padding: 0,
            border: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label="닫기"
        />
      </section>

      <div className="health_cam_ctrl">
        <button
          type="button"
          className="health_cam_pet_link"
          onClick={() => setShowCalendarPetSwitch(true)}
        >
          {selectedPetName ? (
            <>
              <span>
                현재 반려동물 · <span className="health_cam_pet_name">{selectedPetName}</span>
              </span>
              <span className="health_cam_pet_legacy_label" aria-hidden="true">
              현재 반려동물 · <span style={{ fontWeight: 700 }}>{selectedPetName}</span>
              </span>
            </>
          ) : (
            <span>반려동물 변경하기</span>
          )}
          <ChevronRight size={16} color="#505050" aria-hidden="true" />
        </button>

        <div className="health_cam_zoom" aria-hidden="true">
          <span className="health_cam_zoom_btn">.5</span>
          <span className="health_cam_zoom_btn health_cam_zoom_lg health_cam_zoom_on">
            <span>1</span><span>x</span>
          </span>
          <span className="health_cam_zoom_btn">3</span>
        </div>

        <div className="health_cam_modes" role="tablist" aria-label="촬영 모드">
          <button
            type="button"
            className={`health_cam_mode${cameraMode === 'video' ? ' is_active' : ''}`}
            onClick={() => setCameraMode('video')}
          >
            VIDEO
          </button>
          <button
            type="button"
            className={`health_cam_mode${cameraMode === 'photo' ? ' is_active' : ''}`}
            onClick={() => setCameraMode('photo')}
          >
            PHOTO
          </button>
        </div>

        <div className="health_cam_shutter_row">
          <button type="button" className="health_cam_side" aria-label="갤러리" onClick={handleGalleryClick}>
            <img src={galleryIcon} width={24} height={24} aria-hidden="true" alt="" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <button type="button" className="health_cam_shutter" aria-label="촬영" onClick={handleCapture}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', border: '3px solid black', padding: 3, backgroundColor: 'white' }}>
              <div style={{ width: '100%', height: '100%', borderRadius: '50%', backgroundColor: 'black' }} />
            </div>
          </button>
          <button type="button" className="health_cam_side" aria-label="카메라 전환" onClick={handleFlip}>
            <img src={cameraFlipIcon} width={24} height={24} aria-hidden="true" alt="" />
          </button>
        </div>
      </div>

      {(capturedImage || capturedVideo) ? (
        <div className="health_cam_result_ctrl">
          <button type="button" className="health_cam_retake" onClick={handleRetake}>
            재촬영 하기
          </button>
          <button type="button" className="health_cam_upload" onClick={handleUpload}>
            업로드 하기
          </button>
        </div>
      ) : (
        <div className="health_cam_tabs_wrapper">
          <div className="health_cam_tabs" role="tablist" aria-label="건강 체크 탭">
            <button
              type="button"
              className={`health_cam_tab${activeTab === 'camera' ? ' is_active' : ''}`}
              onClick={() => setActiveTab('camera')}
            >
              카메라
            </button>
            <button
              type="button"
              className={`health_cam_tab${activeTab === 'memo' ? ' is_active' : ''}`}
              onClick={() => { setActiveTab('memo'); setShowCalendarMemoSheet(true) }}
            >
              메모
            </button>
          </div>
        </div>
      )}

      <div style={{ backgroundColor: 'white', height: '34px', position: 'relative', width: '100%' }} aria-hidden="true">
        <div style={{
          position: 'absolute',
          bottom: '8px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'black',
          height: '5px',
          width: '134px',
          borderRadius: '100px',
        }} />
      </div>

      {/* 반려동물 변경 모달 */}
      {showCalendarPetSwitch && (
        <AddSheet onClose={() => setShowCalendarPetSwitch(false)}>
          <div className="mission_pet_switch_sheet">
            <div className="mission_pet_switch_list">
              {pets.map((pet) => (
                <button
                  key={pet.id}
                  type="button"
                  className={`mission_pet_switch_option${pet.id === selectedPetId ? ' is_selected' : ''}`}
                  onClick={() => handleSelectPet(pet)}
                >
                  {pet.image ? (
                    <img src={pet.image} alt="" aria-hidden="true" />
                  ) : (
                    <span className="mission_pet_switch_avatar_fallback" aria-hidden="true">
                      <Dog size={24} color="#505050" />
                    </span>
                  )}
                  <span className="mission_pet_switch_copy">
                    <strong>{pet.name}</strong>
                    <span className="mission_pet_switch_meta">
                      <span>나이: <b>{getPetAge(pet.birthDate)}</b></span>
                      <span className="mission_pet_switch_dot" aria-hidden="true">·</span>
                      <span>몸무게: <b>{pet.weight ? `${pet.weight}kg` : '-'}</b></span>
                      <span className="mission_pet_switch_dot" aria-hidden="true">·</span>
                      <span>성별: <b>{pet.sex || '-'}</b></span>
                    </span>
                  </span>
                </button>
              ))}
            </div>
            <button
              type="button"
              className="purple_btn mission_pet_switch_close"
              onClick={() => setShowCalendarPetSwitch(false)}
            >
              닫기
            </button>
          </div>
        </AddSheet>
      )}

      {showPetModal && (
        <div className="health_pet_modal">
          <div
            className="health_pet_modal_overlay"
            onClick={() => setShowPetModal(false)}
            aria-hidden="true"
          />
          <div className="health_pet_modal_sheet" role="dialog" aria-label="반려동물 선택">
            <div className="health_pet_modal_handle" aria-hidden="true" />
            <ul className="health_pet_modal_list">
              {pets.map((pet) => {
                const age = getPetAge(pet.birthDate)
                const sexLabel = pet.sex === '남' ? '남아' : pet.sex === '여' ? '여아' : pet.sex
                const isSelected = pet.id === selectedPetId
                return (
                  <li key={pet.id}>
                    <button
                      type="button"
                      className={`health_pet_modal_item${isSelected ? ' is_selected' : ''}`}
                      onClick={() => handleSelectPet(pet)}
                    >
                      <div className="health_pet_modal_avatar">
                        {pet.image ? (
                          <img src={pet.image} alt={pet.name} />
                        ) : (
                          <Dog size={24} color="#505050" />
                        )}
                      </div>
                      <div className="health_pet_modal_info">
                        <span className="health_pet_modal_name">{pet.name}</span>
                        <div className="health_pet_modal_detail">
                          <span className="health_pet_modal_detail_label">나이: </span>
                          <span className="health_pet_modal_detail_value">{age}</span>
                          <div className="health_pet_modal_dot" aria-hidden="true" />
                          <span className="health_pet_modal_detail_label">몸무게: </span>
                          <span className="health_pet_modal_detail_value">{pet.weight}kg</span>
                          <div className="health_pet_modal_dot" aria-hidden="true" />
                          <span className="health_pet_modal_detail_label">성별: </span>
                          <span className="health_pet_modal_detail_value">{sexLabel}</span>
                        </div>
                      </div>
                    </button>
                  </li>
                )
              })}
            </ul>
            <button
              type="button"
              className="health_pet_modal_close_btn"
              onClick={() => setShowPetModal(false)}
            >
              닫기
            </button>
          </div>
        </div>
      )}

      {/* 메모 바텀시트 */}
      {showCalendarMemoSheet && (
        <AddSheet onClose={() => setShowCalendarMemoSheet(false)}>
          <MissionRecordSheet
            addDate={{ month: today.getMonth() + 1, day: today.getDate() }}
            selectedCategory={selectedCategory}
            repeatLabel="매일"
            addTitle={memoText}
            feedAmount={feedAmount}
            canSave={isActive}
            isEditing={false}
            quickMessageOptions={quickMessages}
            selectedQuickMessage={selectedAmount}
            onOpenPeriodPicker={() => {}}
            onOpenRepeatPicker={() => {}}
            onOpenCategoryPicker={handleCategoryClick}
            onQuickMessageSelect={(message) => {
              setSelectedAmount(message)
              setMemoText('')
            }}
            onTitleChange={(title) => {
              setMemoText(title)
              setSelectedAmount('')
            }}
            onFeedAmountChange={setFeedAmount}
            onDelete={() => {}}
            onSave={handleMemoSaveOnly}
          />
        </AddSheet>
      )}

      {showMemoSheet && (
        <>
          <div
            className="health_memo_overlay"
            onClick={() => setShowMemoSheet(false)}
            aria-hidden="true"
          />
          <div className="health_memo_sheet" role="dialog" aria-label="건강 메모 입력">
            <div className="health_memo_handle" aria-hidden="true" />

            <div className="health_memo_rows">
              <div className="health_memo_row">
                <span className="health_memo_row_label">기간</span>
                <button type="button" className="health_memo_row_value">
                  {today.getMonth() + 1}월 {today.getDate()}일
                  <ChevronIcon direction="right" size="md" />
                </button>
              </div>
              <div className="health_memo_row">
                <span className="health_memo_row_label">
                  자동 등록
                  <span className="health_memo_info" aria-hidden="true">i</span>
                </span>
                <button type="button" className="health_memo_row_value">
                  매일
                  <ChevronIcon direction="right" size="md" />
                </button>
              </div>
              <div className="health_memo_row health_memo_row_category">
                <span className="health_memo_row_label">카테고리</span>
                <button type="button" className="health_memo_row_value" onClick={handleCategoryClick}>
                  <span
                    className="health_memo_category_dot"
                    style={{ backgroundColor: selectedCategory.color }}
                    aria-hidden="true"
                  />
                  {selectedCategory.label}
                  <ChevronIcon direction="right" size="md" />
                </button>
              </div>
            </div>

            <section className="health_memo_content">
              <h2>내용입력</h2>
              <div className="health_memo_quick_messages" aria-label="빠른 입력">
                {quickMessages.map((msg) => (
                  <button
                    key={msg}
                    type="button"
                    className={`health_memo_quick_message${selectedAmount === msg ? ' is_selected' : ''}`}
                    onClick={() => { setSelectedAmount(msg); setMemoText('') }}
                  >
                    {msg}
                  </button>
                ))}
              </div>
              <textarea
                className="health_memo_textarea"
                placeholder="기타 입력사항을 자유롭게 작성해 주세요."
                rows={4}
                value={memoText}
                onChange={(e) => { setMemoText(e.target.value); setSelectedAmount('') }}
              />
            </section>

            <div className="health_memo_actions">
              <button
                type="button"
                className="health_memo_save_btn"
                disabled={!isActive}
                onClick={handleMemoSaveOnly}
              >
                저장하기
              </button>
              <button
                type="button"
                className="health_memo_upload_btn"
                disabled={!isActive}
                style={{
                  background: isActive ? '#6d59f8' : '#e5e5ec',
                  color: isActive ? 'white' : '#aaaaaa',
                  cursor: isActive ? 'pointer' : 'not-allowed',
                }}
                onClick={handleMemoUpload}
              >
                업로드 하기
              </button>
            </div>
          </div>
        </>
      )}
    </main>
  )
}

export default Health
