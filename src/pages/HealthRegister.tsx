import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import './HealthRegister.css'
import PageHeader from '../components/PageHeader'
import BackButton from '../components/html/BackButton'
import Button from '../components/html/Button'
import calendarIcon from '../svg/calendar.svg'
import notificationIcon from '../svg/notification.svg'

const registerSections = [
  { id: 'photo', title: '사진 등록', limit: '최대 3장' },
  { id: 'video', title: '동영상 등록 (최대 60초)', limit: '최대 3장' },
  { id: 'audio', title: '녹음 등록 (최대 60초)', limit: '최대 3개' },
  { id: 'memo', title: '메모 등록', limit: '최대 3개' },
] as const

const photoActions = [
  '사진 촬영',
  '갤러리 업로드',
  '촬영하고 편집 후 추가',
  '사진 선택하고 편집 후 추가',
] as const

function HealthRegister() {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isActionSheetOpen, setIsActionSheetOpen] = useState(false)
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)
  const [galleryImages, setGalleryImages] = useState<string[]>([])
  const [registeredPhotos, setRegisteredPhotos] = useState<string[]>([])
  const [selectedGalleryItems, setSelectedGalleryItems] = useState<number[]>([])

  useEffect(() => {
    return () => {
      galleryImages.forEach((image) => URL.revokeObjectURL(image))
    }
  }, [galleryImages])

  const handleActionClick = (action: (typeof photoActions)[number]) => {
    if (action === '사진 촬영') {
      navigate('/health/camera?mode=photo&guide=false')
      return
    }

    if (action === '갤러리 업로드') {
      setIsActionSheetOpen(false)
      fileInputRef.current?.click()
      return
    }

    setIsActionSheetOpen(false)
  }

  const handleGalleryFiles = (files: FileList | null) => {
    if (!files?.length) return

    galleryImages.forEach((image) => URL.revokeObjectURL(image))

    const nextImages = Array.from(files)
      .filter((file) => file.type.startsWith('image/'))
      .slice(0, 12)
      .map((file) => URL.createObjectURL(file))

    setGalleryImages(nextImages)
    setSelectedGalleryItems([])
    setIsGalleryOpen(Boolean(nextImages.length))
  }

  const toggleGalleryItem = (index: number) => {
    if (!galleryImages[index]) return

    setSelectedGalleryItems((current) =>
      current.includes(index)
        ? current.filter((item) => item !== index)
        : current.length < 3
          ? [...current, index]
          : current,
    )
  }

  const uploadSelectedGalleryItems = () => {
    const nextPhotos = selectedGalleryItems
      .map((index) => galleryImages[index])
      .filter(Boolean)
      .slice(0, 3)

    setRegisteredPhotos(nextPhotos)
    setIsGalleryOpen(false)
  }

  return (
    <>
      <PageHeader
        title="AI 건강 체크"
        leftContent={<BackButton to="/health" />}
        rightContent={
          <>
            <Button type="button" aria-label="캘린더" onClick={() => navigate('/mission')}>
              <img src={calendarIcon} alt="" />
            </Button>
            <Button type="button" aria-label="알림" className="health_register_notification">
              <img src={notificationIcon} alt="" />
            </Button>
          </>
        }
      />

      <main className="page health_register_page">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="health_register_file_input"
          onChange={(event) => handleGalleryFiles(event.target.files)}
        />

        {registerSections.map((section) => (
          <section className="health_register_section" key={section.id}>
            <div className="health_register_section_header">
              <h2>{section.title}</h2>
              <span>{section.limit}</span>
            </div>

            <div className="health_register_slots">
              {Array.from({ length: 3 }).map((_, index) => (
                <button
                  key={`${section.id}-${index}`}
                  type="button"
                  className="health_register_slot"
                  aria-label={`${section.title} ${index + 1}번째 추가`}
                  onClick={() => setIsActionSheetOpen(true)}
                >
                  {section.id === 'photo' && registeredPhotos[index] ? (
                    <img src={registeredPhotos[index]} alt={`등록된 사진 ${index + 1}`} />
                  ) : (
                    <span aria-hidden="true" />
                  )}
                </button>
              ))}
            </div>
          </section>
        ))}
      </main>

      {isActionSheetOpen ? (
        <div className="health_register_sheet_layer" role="presentation">
          <button
            type="button"
            className="health_register_sheet_dim"
            aria-label="등록 메뉴 닫기"
            onClick={() => setIsActionSheetOpen(false)}
          />
          <section className="health_register_sheet" aria-label="사진 등록 방법">
            <div className="health_register_sheet_group">
              {photoActions.map((action) => (
                <button key={action} type="button" onClick={() => handleActionClick(action)}>
                  {action}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="health_register_sheet_close"
              onClick={() => setIsActionSheetOpen(false)}
            >
              닫기
            </button>
          </section>
        </div>
      ) : null}

      {isGalleryOpen ? (
        <section className="health_gallery_layer" aria-label="사진 업로드">
          <div className="health_gallery_handle" aria-hidden="true" />
          <header className="health_gallery_header">
            <button
              type="button"
              className="health_gallery_close"
              aria-label="닫기"
              onClick={() => setIsGalleryOpen(false)}
            >
              <i className="bx bx-x" aria-hidden="true" />
            </button>
            <h2>사진</h2>
            <button
              type="button"
              className="health_gallery_upload"
              onClick={uploadSelectedGalleryItems}
            >
              업로드
            </button>
          </header>

          <div className="health_gallery_grid">
            {Array.from({ length: 12 }).map((_, index) => {
              const selectedIndex = selectedGalleryItems.indexOf(index)
              const isSelected = selectedIndex >= 0
              const image = galleryImages[index]

              return (
                <button
                  key={index}
                  type="button"
                  className={`health_gallery_item ${isSelected ? 'selected' : ''}`}
                  aria-label={`${index + 1}번 사진 선택`}
                  aria-pressed={isSelected}
                  onClick={() => toggleGalleryItem(index)}
                  disabled={!image}
                >
                  {image ? <img src={image} alt={`앨범 사진 ${index + 1}`} /> : null}
                  <span className="health_gallery_badge">
                    {isSelected ? selectedIndex + 1 : ''}
                  </span>
                </button>
              )
            })}
          </div>
        </section>
      ) : null}
    </>
  )
}

export default HealthRegister
