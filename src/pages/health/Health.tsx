import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { ChevronRight, Dog } from 'lucide-react'
import './Health.css'
import pungpungiImage from '../../img/pungpungi.png'
import galleryIcon from '../../img/gallery-icon.svg'
import cameraFlipIcon from '../../img/camera-flip-icon.svg'
import {
  readPetProfiles,
  readSelectedPetProfileId,
  writeSelectedPetProfileId,
  PET_PROFILES_CHANGE_EVENT,
  type PetProfileSummary,
} from '../../utils/petProfiles'

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
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment')
  const [isCameraAvailable, setIsCameraAvailable] = useState(true)
  const [cameraMode, setCameraMode] = useState<'photo' | 'video'>('photo')
  const [activeTab, setActiveTab] = useState<'camera' | 'memo'>('camera')
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [showPetModal, setShowPetModal] = useState(false)
  const [pets, setPets] = useState<PetProfileSummary[]>(readPetProfiles)
  const [selectedPetId, setSelectedPetId] = useState<number>(readSelectedPetProfileId)

  useEffect(() => {
    const sync = () => {
      setPets(readPetProfiles())
      setSelectedPetId(readSelectedPetProfileId())
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
    console.log('캡처 시도')
    if (!isCameraAvailable || !videoRef.current) {
      setCapturedImage(pungpungiImage)
      return
    }
    const video = videoRef.current
    if (video.videoWidth === 0 || video.videoHeight === 0) {
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
  }

  const handleRetake = () => {
    setCapturedImage(null)
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
  }

  return (
    <main className="health_cam_ui">
      <section className="health_cam_view" aria-label="카메라 뷰">
        {capturedImage ? (
          <img className="health_cam_img" src={capturedImage} alt="촬영된 사진" />
        ) : isCameraAvailable ? (
          <video ref={videoRef} className="health_cam_video" autoPlay muted playsInline />
        ) : (
          <img className="health_cam_img" src={pungpungiImage} alt="" aria-hidden="true" />
        )}
        <div className="health_cam_overlay" aria-hidden="true" />
      </section>

      <div className="health_cam_ctrl">
        <button
          type="button"
          className="health_cam_pet_link"
          onClick={() => setShowPetModal(true)}
        >
          <span>반려동물 변경하기</span>
          <ChevronRight size={16} color="#505050" aria-hidden="true" />
        </button>

        <div className="health_cam_zoom" aria-hidden="true">
          <span className="health_cam_zoom_btn">.5</span>
          <span className="health_cam_zoom_btn health_cam_zoom_lg health_cam_zoom_on">1x</span>
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
          <button type="button" className="health_cam_side" aria-label="갤러리">
            <img src={galleryIcon} width={24} height={24} aria-hidden="true" alt="" />
          </button>
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

      {capturedImage ? (
        <div className="health_cam_result_ctrl">
          <button type="button" className="health_cam_retake" onClick={handleRetake}>
            재촬영 하기
          </button>
          <button type="button" className="health_cam_upload" onClick={handleUpload}>
            업로드 하기
          </button>
        </div>
      ) : (
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
            onClick={() => setActiveTab('memo')}
          >
            메모
          </button>
        </div>
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
    </main>
  )
}

export default Health
