import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router'
import './HealthRegister.css'
import PageHeader from '../components/PageHeader'
import BackButton from '../components/html/BackButton'
import Button from '../components/html/Button'
import samplePetImage from '../img/my pet image.jpg'
import calendarIcon from '../svg/calendar.svg'
import notificationIcon from '../svg/notification.svg'
import { writeStoredHealthResultInput } from '../utils/healthResultPolicy'

const registerSections = [
  { id: 'photo', title: '사진 등록', limit: '최대 3장' },
  { id: 'video', title: '동영상 등록 (최대 60초)', limit: '최대 3개' },
  { id: 'audio', title: '녹음 등록 (최대 60초)', limit: '최대 3개' },
  { id: 'memo', title: '메모 등록', limit: '최대 3줄' },
] as const

type RegisterSectionId = (typeof registerSections)[number]['id']
type ActionSheetSection = Exclude<RegisterSectionId, 'memo'>
type RegisteredEntry = {
  id: string
  preview?: string
  label?: string
  mediaType?: 'image' | 'video' | 'audio'
}
type RegisteredEntries = Record<ActionSheetSection, RegisteredEntry[]>
type EditorAsset = {
  section: 'photo' | 'video'
  src: string
  rotation: number
  mediaType: 'image' | 'video'
  label: string
}
type RegisterLocationState = {
  capturedEntry?: {
    section: ActionSheetSection
    entry: RegisteredEntry
  }
  pendingEdit?: {
    section: 'photo' | 'video'
    src: string
    mediaType: 'image' | 'video'
    label: string
  }
}

const REGISTER_LIMIT = 3
const HEALTH_REGISTER_DRAFT_KEY = 'health-register-draft'

const createEmptyEntries = (): RegisteredEntries => ({
  photo: [],
  video: [],
  audio: [],
})

const readRegisterDraft = () => {
  if (typeof window === 'undefined') {
    return { entries: createEmptyEntries(), memo: '' }
  }

  try {
    const raw = window.sessionStorage.getItem(HEALTH_REGISTER_DRAFT_KEY)

    if (!raw) {
      return { entries: createEmptyEntries(), memo: '' }
    }

    const parsed = JSON.parse(raw) as {
      entries?: Partial<RegisteredEntries>
      memo?: string
    }

    return {
      entries: {
        photo: parsed.entries?.photo ?? [],
        video: parsed.entries?.video ?? [],
        audio: parsed.entries?.audio ?? [],
      },
      memo: parsed.memo ?? '',
    }
  } catch {
    return { entries: createEmptyEntries(), memo: '' }
  }
}

const actionSheetOptions: Record<ActionSheetSection, readonly string[]> = {
  photo: ['사진 촬영', '사진 업로드', '촬영하고 편집 후 추가', '사진 선택하고 편집 후 추가'],
  video: ['동영상 촬영', '동영상 업로드', '촬영하고 편집 후 추가', '동영상 선택하고 편집 후 추가'],
  audio: ['녹음', '녹음 업로드'],
}

function HealthRegister() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const photoInputRef = useRef<HTMLInputElement>(null)
  const photoEditInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)
  const videoEditInputRef = useRef<HTMLInputElement>(null)
  const audioUploadInputRef = useRef<HTMLInputElement>(null)
  const [isActionSheetOpen, setIsActionSheetOpen] = useState(false)
  const [currentActionSection, setCurrentActionSection] = useState<ActionSheetSection>('photo')
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)
  const [isEmptyAlertOpen, setIsEmptyAlertOpen] = useState(false)
  const [galleryImages, setGalleryImages] = useState<string[]>([])
  const [selectedGalleryItems, setSelectedGalleryItems] = useState<number[]>([])
  const draft = readRegisterDraft()
  const [registeredEntries, setRegisteredEntries] = useState<RegisteredEntries>(draft.entries)
  const [memoEntry, setMemoEntry] = useState(draft.memo)
  const [editorAsset, setEditorAsset] = useState<EditorAsset | null>(null)
  const preferredSection = searchParams.get('section')
  const locationState = location.state as RegisterLocationState | null
  const orderedSections =
    preferredSection && registerSections.some((section) => section.id === preferredSection)
      ? [
          ...registerSections.filter((section) => section.id === preferredSection),
          ...registerSections.filter((section) => section.id !== preferredSection),
        ]
      : registerSections
  const hasRegisteredContent =
    registeredEntries.photo.length > 0 ||
    registeredEntries.video.length > 0 ||
    registeredEntries.audio.length > 0 ||
    memoEntry.trim().length > 0

  useEffect(() => {
    return () => {
      galleryImages.forEach((image) => URL.revokeObjectURL(image))
    }
  }, [galleryImages])

  useEffect(() => {
    window.sessionStorage.setItem(
      HEALTH_REGISTER_DRAFT_KEY,
      JSON.stringify({
        entries: registeredEntries,
        memo: memoEntry,
      }),
    )
  }, [memoEntry, registeredEntries])

  useEffect(() => {
    if (!locationState?.capturedEntry && !locationState?.pendingEdit) {
      return
    }

    if (locationState.capturedEntry) {
      const { section, entry } = locationState.capturedEntry

      setRegisteredEntries((current) => {
        if (current[section].some((existingEntry) => existingEntry.id === entry.id)) {
          return current
        }

        if (current[section].length >= REGISTER_LIMIT) {
          return current
        }

        return {
          ...current,
          [section]: [...current[section], entry],
        }
      })
    }

    if (locationState.pendingEdit) {
      setEditorAsset({
        ...locationState.pendingEdit,
        rotation: 0,
      })
    }

    navigate(`/health/register?section=${preferredSection ?? 'photo'}`, { replace: true, state: null })
  }, [locationState, navigate, preferredSection])

  const getRemainingSlots = (section: ActionSheetSection) =>
    Math.max(0, REGISTER_LIMIT - registeredEntries[section].length)

  const appendEntries = (section: ActionSheetSection, entries: RegisteredEntry[]) => {
    setRegisteredEntries((current) => ({
      ...current,
      [section]: [...current[section], ...entries].slice(0, REGISTER_LIMIT),
    }))
  }

  const removeEntry = (section: ActionSheetSection, entryId: string) => {
    setRegisteredEntries((current) => {
      const nextEntry = current[section].find((entry) => entry.id === entryId)

      if (nextEntry?.preview?.startsWith('blob:')) {
        URL.revokeObjectURL(nextEntry.preview)
      }

      return {
        ...current,
        [section]: current[section].filter((entry) => entry.id !== entryId),
      }
    })
  }

  const handleMemoChange = (value: string) => {
    const nextValue = value.split('\n').slice(0, 3).join('\n')
    setMemoEntry(nextValue)
  }

  const handleActionClick = (action: string) => {
    if (currentActionSection === 'photo' && action === '사진 촬영') {
      setIsActionSheetOpen(false)
      navigate('/health/camera?mode=photo&guide=false')
      return
    }

    if (currentActionSection === 'photo' && action === '촬영하고 편집 후 추가') {
      setIsActionSheetOpen(false)
      navigate('/health/camera?mode=photo&guide=false&edit=true')
      return
    }

    if (currentActionSection === 'photo' && action === '사진 선택하고 편집 후 추가') {
      setIsActionSheetOpen(false)
      photoEditInputRef.current?.click()
      return
    }

    if (currentActionSection === 'video' && action === '동영상 촬영') {
      setIsActionSheetOpen(false)
      navigate('/health/camera?mode=video&guide=false')
      return
    }

    if (currentActionSection === 'video' && action === '촬영하고 편집 후 추가') {
      setIsActionSheetOpen(false)
      navigate('/health/camera?mode=video&guide=false&edit=true')
      return
    }

    if (currentActionSection === 'video' && action === '동영상 선택하고 편집 후 추가') {
      setIsActionSheetOpen(false)
      videoEditInputRef.current?.click()
      return
    }

    if (currentActionSection === 'audio' && action === '녹음') {
      setIsActionSheetOpen(false)
      navigate('/health/camera?mode=audio&guide=false')
      return
    }

    if (currentActionSection === 'audio' && action === '녹음 업로드') {
      setIsActionSheetOpen(false)
      audioUploadInputRef.current?.click()
      return
    }

    if (currentActionSection === 'photo' && action === '사진 업로드') {
      setIsActionSheetOpen(false)
      photoInputRef.current?.click()
      return
    }

    if (currentActionSection === 'video' && action === '동영상 업로드') {
      setIsActionSheetOpen(false)
      videoInputRef.current?.click()
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
    const remainingSlots = getRemainingSlots('photo')

    setSelectedGalleryItems((current) =>
      current.includes(index)
        ? current.filter((item) => item !== index)
        : current.length < remainingSlots
          ? [...current, index]
          : current,
    )
  }

  const uploadSelectedGalleryItems = () => {
    const nextPhotos = selectedGalleryItems
      .map((index) => galleryImages[index])
      .filter(Boolean)
      .slice(0, getRemainingSlots('photo'))
      .map((preview, index) => ({
        id: `photo-upload-${Date.now()}-${index}`,
        preview,
        label: '사진 업로드',
        mediaType: 'image' as const,
      }))

    appendEntries('photo', nextPhotos)
    setIsGalleryOpen(false)
  }

  const handleVideoFiles = (files: FileList | null) => {
    if (!files?.length) return

    const nextEntries = Array.from(files)
      .filter((file) => file.type.startsWith('video/'))
      .slice(0, getRemainingSlots('video'))
      .map((file, index) => ({
        id: `video-upload-${Date.now()}-${index}`,
        preview: URL.createObjectURL(file),
        label: file.name || `동영상 ${index + 1}`,
        mediaType: 'video' as const,
      }))

    appendEntries('video', nextEntries)
  }

  const handleAudioFiles = (files: FileList | null) => {
    if (!files?.length) return

    const nextEntries = Array.from(files)
      .filter((file) => file.type.startsWith('audio/'))
      .slice(0, getRemainingSlots('audio'))
      .map((file, index) => ({
        id: `audio-upload-${Date.now()}-${index}`,
        label: file.name || `녹음 ${index + 1}`,
        mediaType: 'audio' as const,
      }))

    appendEntries('audio', nextEntries)
  }

  const handlePhotoEditFiles = (files: FileList | null) => {
    const file = files?.[0]

    if (!file || !file.type.startsWith('image/')) return

    setEditorAsset({
      section: 'photo',
      src: URL.createObjectURL(file),
      rotation: 0,
      mediaType: 'image',
      label: file.name || '사진 편집본',
    })
  }

  const handleVideoEditFiles = (files: FileList | null) => {
    const file = files?.[0]

    if (!file || !file.type.startsWith('video/')) return

    setEditorAsset({
      section: 'video',
      src: URL.createObjectURL(file),
      rotation: 0,
      mediaType: 'video',
      label: file.name || '동영상 편집본',
    })
  }

  const saveEditedAsset = () => {
    if (!editorAsset) return

    if (editorAsset.section === 'photo') {
      appendEntries('photo', [
        {
          id: `photo-edit-${Date.now()}`,
          preview: editorAsset.src,
          label: editorAsset.label,
          mediaType: 'image',
        },
      ])
    }

    if (editorAsset.section === 'video') {
      appendEntries('video', [
        {
          id: `video-edit-${Date.now()}`,
          preview: editorAsset.src,
          label: editorAsset.label,
          mediaType: 'video',
        },
      ])
    }

    setEditorAsset(null)
  }

  const handleSubmit = () => {
    if (!hasRegisteredContent) {
      setIsEmptyAlertOpen(true)
      return
    }

    writeStoredHealthResultInput({
      stoolStatus: 'missing',
      activityStatus: 'missing',
      mealStatus: 'missing',
      weightStatus: 'missing',
      symptomStatus:
        memoEntry.trim().length > 0 || registeredEntries.audio.length > 0 ? 'minor' : 'missing',
      photoStatus:
        registeredEntries.photo.length > 0 || registeredEntries.video.length > 0
          ? 'stable'
          : 'missing',
    })

    navigate('/health/check-loading')
  }

  const handleBrowseDemo = () => {
    appendEntries('photo', [
      {
        id: `photo-demo-${Date.now()}`,
        preview: samplePetImage,
        label: '테스트 사진',
        mediaType: 'image',
      },
    ])
    setIsEmptyAlertOpen(false)
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
          ref={photoInputRef}
          type="file"
          accept="image/*"
          multiple
          className="health_register_file_input"
          onChange={(event) => handleGalleryFiles(event.target.files)}
        />
        <input
          ref={photoEditInputRef}
          type="file"
          accept="image/*"
          className="health_register_file_input"
          onChange={(event) => handlePhotoEditFiles(event.target.files)}
        />
        <input
          ref={videoInputRef}
          type="file"
          accept="video/*"
          multiple
          className="health_register_file_input"
          onChange={(event) => handleVideoFiles(event.target.files)}
        />
        <input
          ref={videoEditInputRef}
          type="file"
          accept="video/*"
          className="health_register_file_input"
          onChange={(event) => handleVideoEditFiles(event.target.files)}
        />
        <input
          ref={audioUploadInputRef}
          type="file"
          accept="audio/*"
          multiple
          className="health_register_file_input"
          onChange={(event) => handleAudioFiles(event.target.files)}
        />

        {orderedSections.map((section) => (
          <section className="health_register_section" key={section.id}>
            <div className="health_register_section_header">
              <h2>{section.title}</h2>
              <span>{section.limit}</span>
            </div>

            {section.id === 'memo' ? (
              <div className="health_register_memo_slot">
                <textarea
                  value={memoEntry}
                  rows={3}
                  placeholder="메모를 입력해주세요"
                  aria-label="메모 작성"
                  onChange={(event) => handleMemoChange(event.target.value)}
                />
              </div>
            ) : (
              <div className="health_register_slots">
                {Array.from({ length: 3 }).map((_, index) => (
                  (() => {
                    const entry = registeredEntries[section.id][index]

                    return (
                      <button
                        key={`${section.id}-${index}`}
                        type="button"
                        className={`health_register_slot ${entry ? 'is_filled' : ''}`}
                        aria-label={`${section.title} ${index + 1}번째 추가`}
                        onClick={() => {
                          setCurrentActionSection(section.id)
                          setIsActionSheetOpen(true)
                        }}
                      >
                        {entry ? (
                          <>
                            {entry.preview ? (
                              entry.mediaType === 'video' ? (
                                <video src={entry.preview} muted playsInline />
                              ) : (
                                <img src={entry.preview} alt={`등록된 ${section.title} ${index + 1}`} />
                              )
                            ) : (
                              <strong>{entry.label ?? `${section.title} ${index + 1}`}</strong>
                            )}
                            <button
                              type="button"
                              className="health_register_slot_delete"
                              aria-label={`${section.title} ${index + 1}번째 삭제`}
                              onClick={(event) => {
                                event.stopPropagation()
                                removeEntry(section.id, entry.id)
                              }}
                            >
                              <i className="bx bx-x" aria-hidden="true" />
                            </button>
                          </>
                        ) : (
                          <span aria-hidden="true" />
                        )}
                      </button>
                    )
                  })()
                ))}
              </div>
            )}
          </section>
        ))}

        <div className="health_register_submit">
          <Button
            type="button"
            className={`health_register_submit_button ${!hasRegisteredContent ? 'is_disabled' : ''}`}
            aria-disabled={!hasRegisteredContent}
            onClick={handleSubmit}
          >
            등록하기
          </Button>
        </div>
      </main>

      {isActionSheetOpen ? (
        <div className="health_register_sheet_layer" role="presentation">
          <button
            type="button"
            className="health_register_sheet_dim"
            aria-label="등록 메뉴 닫기"
            onClick={() => setIsActionSheetOpen(false)}
          />
          <section className="health_register_sheet" aria-label="등록 방법">
            <div className="health_register_sheet_group">
              {actionSheetOptions[currentActionSection].map((action) => (
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
                  aria-label={`${index + 1}번째 사진 선택`}
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

      {editorAsset ? (
        <div className="health_register_editor_layer" role="presentation">
          <button
            type="button"
            className="health_register_editor_dim"
            aria-label="편집 닫기"
            onClick={() => setEditorAsset(null)}
          />
          <section className="health_register_editor" aria-label="미디어 편집">
            <header className="health_register_editor_header">
              <h2>편집 후 추가</h2>
              <button type="button" onClick={() => setEditorAsset(null)}>
                닫기
              </button>
            </header>
            <div className="health_register_editor_preview">
              {editorAsset.mediaType === 'video' ? (
                <video src={editorAsset.src} controls playsInline />
              ) : (
                <img
                  src={editorAsset.src}
                  alt="편집할 사진"
                  style={{ transform: `rotate(${editorAsset.rotation}deg)` }}
                />
              )}
            </div>
            {editorAsset.mediaType === 'image' ? (
              <div className="health_register_editor_actions">
                <button
                  type="button"
                  onClick={() =>
                    setEditorAsset((current) =>
                      current ? { ...current, rotation: current.rotation - 90 } : current,
                    )
                  }
                >
                  왼쪽 회전
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setEditorAsset((current) =>
                      current ? { ...current, rotation: current.rotation + 90 } : current,
                    )
                  }
                >
                  오른쪽 회전
                </button>
              </div>
            ) : null}
            <Button type="button" className="health_register_submit_button" onClick={saveEditedAsset}>
              추가하기
            </Button>
          </section>
        </div>
      ) : null}

      {isEmptyAlertOpen ? (
        <div className="health_register_alert_layer" role="presentation">
          <button
            type="button"
            className="health_register_alert_dim"
            aria-label="알림 닫기"
            onClick={() => setIsEmptyAlertOpen(false)}
          />
          <section
            className="health_register_alert"
            role="alertdialog"
            aria-modal="true"
            aria-label="등록 안내"
          >
            <div className="health_register_alert_copy">
              <span className="health_register_alert_icon" aria-hidden="true">
                <svg viewBox="0 0 48 48">
                  <path d="M24 9 38 33.5a2.8 2.8 0 0 1-2.4 4.2H12.4A2.8 2.8 0 0 1 10 33.5L24 9Z" />
                  <path d="M24 18v9" />
                  <circle cx="24" cy="31.5" r="1.9" fill="#ffffff" stroke="none" />
                </svg>
              </span>
              <strong>등록된 기록이 없어요</strong>
              <p>사진, 동영상, 음성, 메모 중 하나를 추가해주세요.</p>
              <button
                type="button"
                className="health_register_alert_browse"
                onClick={handleBrowseDemo}
              >
                테스트용 이미지 넣기
              </button>
            </div>
            <div className="health_register_alert_action">
              <button type="button" onClick={() => setIsEmptyAlertOpen(false)}>
                확인
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </>
  )
}

export default HealthRegister
