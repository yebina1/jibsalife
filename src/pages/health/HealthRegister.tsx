import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router'
import './HealthRegister.css'
import PageHeader from '../../components/PageHeader'
import HeaderIcon from '../../components/HeaderIcon'
import ChevronIcon from '../../components/ChevronIcon'
import ContentSection from '../../components/ContentSection'
import BackButton from '../../components/html/BackButton'
import Button from '../../components/html/Button'
import Alert from '../../components/Alert'
import AddSheet from '../../components/AddSheet'
import samplePetImage from '../../img/pungpungi.png'
import { type ObservationStatus, writeStoredHealthResultInput } from '../../utils/healthResultPolicy'
import { writeHealthCheckMissionHistoryRecord } from '../../utils/missionHistoryRecords'

const registerSections = [
  { id: 'photo', title: '사진 등록', limit: '최대 3장' },
  { id: 'video', title: '동영상 등록 (최대 60초)', limit: '최대 3개' },
  { id: 'audio', title: '녹음 등록 (최대 60초)', limit: '최대 3개' },
  { id: 'memo', title: '메모 등록', limit: '최대 3줄' },
] as const

const cropPresets = [
  { id: 'free', label: '자유', aspect: null },
  { id: '1:1', label: '1:1', aspect: 1 },
  { id: '3:4', label: '3:4', aspect: 3 / 4 },
  { id: '4:3', label: '4:3', aspect: 4 / 3 },
  { id: '9:16', label: '9:16', aspect: 9 / 16 },
  { id: '16:9', label: '16:9', aspect: 16 / 9 },
] as const

type RegisterSectionId = (typeof registerSections)[number]['id']
type ActionSheetSection = Exclude<RegisterSectionId, 'memo'>
type CropPresetId = (typeof cropPresets)[number]['id']
type CropHandle = 'move' | 'n' | 's' | 'e' | 'w' | 'nw' | 'ne' | 'sw' | 'se'
type CropRect = {
  x: number
  y: number
  width: number
  height: number
}
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
type CropInteraction = {
  pointerId: number
  handle: CropHandle
  startX: number
  startY: number
  startRect: CropRect
}

const REGISTER_LIMIT = 3
const HEALTH_REGISTER_DRAFT_KEY = 'health-register-draft'
const DEFAULT_CROP_RECT: CropRect = {
  x: 0.08,
  y: 0.12,
  width: 0.84,
  height: 0.7,
}

const actionSheetOptions: Record<ActionSheetSection, readonly string[]> = {
  photo: ['사진 촬영', '사진 업로드', '촬영하고 편집 후 추가', '사진 선택하고 편집 후 추가'],
  video: ['동영상 촬영', '동영상 업로드', '촬영하고 편집 후 추가', '동영상 선택하고 편집 후 추가'],
  audio: ['녹음', '녹음 업로드'],
}

const createEmptyEntries = (): RegisteredEntries => ({
  photo: [],
  video: [],
  audio: [],
})

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

const revokeObjectUrl = (value?: string) => {
  if (value?.startsWith('blob:')) {
    URL.revokeObjectURL(value)
  }
}

const loadImageElement = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('image-load-failed'))
    image.src = src
  })

const canvasToObjectUrl = (canvas: HTMLCanvasElement) =>
  new Promise<string>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('canvas-export-failed'))
          return
        }

        resolve(URL.createObjectURL(blob))
      },
      'image/jpeg',
      0.92,
    )
  })

const getCropAspect = (presetId: CropPresetId) =>
  cropPresets.find((preset) => preset.id === presetId)?.aspect ?? null

const severeKeywords = [
  '구토',
  '설사',
  '피',
  '출혈',
  '발작',
  '경련',
  '호흡곤란',
  '숨을',
  '숨이',
  '헐떡',
  '절뚝',
  '무기력',
  '심하게',
  '심한',
  '아파',
  '통증',
]

const mildKeywords = [
  '약간',
  '조금',
  '가끔',
  '살짝',
  '평소보다',
  '줄었',
  '감소',
  '이상',
  '변화',
  '불편',
  '낯설',
]

const stableKeywords = ['정상', '괜찮', '평소와 비슷', '비슷', '활발', '잘 먹', '좋아요']

const stoolKeywords = ['변', '배변', '설사', '대변', '소변', '배설']
const activityKeywords = ['활동', '산책', '뛰', '걷', '움직', '기운', '무기력', '놀']
const mealKeywords = ['식사', '사료', '밥', '물', '간식', '먹', '식욕']
const weightKeywords = ['체중', '몸무게', '살', '마름', '빠졌', '쪘']
const symptomKeywords = ['증상', '상태', '변화', '아파', '기침', '헐떡', '구토', '설사']

const includesAny = (source: string, keywords: string[]) =>
  keywords.some((keyword) => source.includes(keyword))

function inferStatusFromText(source: string, keywords: string[]): ObservationStatus {
  const trimmed = source.trim()

  if (!trimmed || !includesAny(trimmed, keywords)) {
    return 'missing'
  }

  if (includesAny(trimmed, severeKeywords)) {
    return 'warning'
  }

  if (includesAny(trimmed, stableKeywords) && !includesAny(trimmed, mildKeywords)) {
    return 'stable'
  }

  if (includesAny(trimmed, mildKeywords)) {
    return 'minor'
  }

  return 'minor'
}

function inferSymptomStatus(source: string, hasAudio: boolean, hasMemo: boolean): ObservationStatus {
  const trimmed = source.trim()

  if (!trimmed && !hasAudio && !hasMemo) {
    return 'missing'
  }

  if (trimmed && includesAny(trimmed, severeKeywords)) {
    return 'warning'
  }

  if (trimmed && includesAny(trimmed, stableKeywords) && !includesAny(trimmed, mildKeywords)) {
    return 'stable'
  }

  if (trimmed && (includesAny(trimmed, mildKeywords) || includesAny(trimmed, symptomKeywords))) {
    return 'minor'
  }

  if (hasAudio || hasMemo) {
    return 'minor'
  }

  return 'missing'
}

function inferPhotoStatus(photoCount: number, videoCount: number): ObservationStatus {
  const totalCount = photoCount + videoCount

  if (totalCount === 0) {
    return 'missing'
  }

  if ((photoCount > 0 && videoCount > 0) || videoCount >= 1 || photoCount >= 2) {
    return 'stable'
  }

  if (photoCount === 1) {
    return 'minor'
  }

  return 'missing'
}

function createPresetCropRect(aspect: number | null): CropRect {
  if (!aspect) {
    return DEFAULT_CROP_RECT
  }

  const maxWidth = 0.84
  const maxHeight = 0.72
  let width = maxWidth
  let height = width / aspect

  if (height > maxHeight) {
    height = maxHeight
    width = height * aspect
  }

  return {
    x: (1 - width) / 2,
    y: (1 - height) / 2,
    width,
    height,
  }
}

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

function updateCropRect(
  startRect: CropRect,
  handle: CropHandle,
  deltaX: number,
  deltaY: number,
  aspect: number | null,
) {
  const minSize = 0.18
  const startLeft = startRect.x
  const startTop = startRect.y
  const startRight = startRect.x + startRect.width
  const startBottom = startRect.y + startRect.height
  const centerX = startRect.x + startRect.width / 2
  const centerY = startRect.y + startRect.height / 2

  if (handle === 'move') {
    return {
      ...startRect,
      x: clamp(startRect.x + deltaX, 0, 1 - startRect.width),
      y: clamp(startRect.y + deltaY, 0, 1 - startRect.height),
    }
  }

  let left = startLeft
  let top = startTop
  let right = startRight
  let bottom = startBottom

  if (handle.includes('w')) {
    left = clamp(startLeft + deltaX, 0, startRight - minSize)
  }

  if (handle.includes('e')) {
    right = clamp(startRight + deltaX, startLeft + minSize, 1)
  }

  if (handle.includes('n')) {
    top = clamp(startTop + deltaY, 0, startBottom - minSize)
  }

  if (handle.includes('s')) {
    bottom = clamp(startBottom + deltaY, startTop + minSize, 1)
  }

  if (handle === 'n' || handle === 's') {
    left = startLeft
    right = startRight
  }

  if (handle === 'e' || handle === 'w') {
    top = startTop
    bottom = startBottom
  }

  let width = clamp(right - left, minSize, 1)
  let height = clamp(bottom - top, minSize, 1)

  if (!aspect) {
    return {
      x: clamp(left, 0, 1 - width),
      y: clamp(top, 0, 1 - height),
      width,
      height,
    }
  }

  if (handle === 'n' || handle === 's') {
    height = clamp(bottom - top, minSize, 1)
    width = clamp(height * aspect, minSize, 1)
    const nextLeft = clamp(centerX - width / 2, 0, 1 - width)

    return {
      x: nextLeft,
      y: clamp(top, 0, 1 - height),
      width,
      height,
    }
  }

  if (handle === 'e' || handle === 'w') {
    width = clamp(right - left, minSize, 1)
    height = clamp(width / aspect, minSize, 1)
    const nextTop = clamp(centerY - height / 2, 0, 1 - height)

    return {
      x: clamp(left, 0, 1 - width),
      y: nextTop,
      width,
      height,
    }
  }

  const anchorX = handle.includes('w') ? startRight : startLeft
  const anchorY = handle.includes('n') ? startBottom : startTop
  const rawWidth = Math.abs(anchorX - (handle.includes('w') ? left : right))
  const rawHeight = Math.abs(anchorY - (handle.includes('n') ? top : bottom))
  const baseSize = Math.max(rawWidth, rawHeight * aspect, minSize)
  width = clamp(baseSize, minSize, 1)
  height = clamp(width / aspect, minSize, 1)

  const nextX = handle.includes('w') ? anchorX - width : anchorX
  const nextY = handle.includes('n') ? anchorY - height : anchorY

  return {
    x: clamp(nextX, 0, 1 - width),
    y: clamp(nextY, 0, 1 - height),
    width,
    height,
  }
}

async function exportEditedPhoto(
  src: string,
  rotation: number,
  cropRect?: CropRect,
): Promise<string> {
  const image = await loadImageElement(src)
  const normalizedRotation = ((rotation % 360) + 360) % 360
  const quarterTurns = normalizedRotation / 90
  const swapAxis = quarterTurns % 2 !== 0
  const baseWidth = swapAxis ? image.naturalHeight : image.naturalWidth
  const baseHeight = swapAxis ? image.naturalWidth : image.naturalHeight
  const baseCanvas = document.createElement('canvas')
  const baseContext = baseCanvas.getContext('2d')

  if (!baseContext) {
    throw new Error('canvas-context-failed')
  }

  baseCanvas.width = baseWidth
  baseCanvas.height = baseHeight

  baseContext.translate(baseWidth / 2, baseHeight / 2)
  baseContext.rotate((normalizedRotation * Math.PI) / 180)
  baseContext.drawImage(image, -image.naturalWidth / 2, -image.naturalHeight / 2)

  if (!cropRect) {
    return canvasToObjectUrl(baseCanvas)
  }

  const cropCanvas = document.createElement('canvas')
  const cropContext = cropCanvas.getContext('2d')

  if (!cropContext) {
    throw new Error('crop-context-failed')
  }

  const sourceX = Math.round(cropRect.x * baseWidth)
  const sourceY = Math.round(cropRect.y * baseHeight)
  const sourceWidth = Math.max(1, Math.round(cropRect.width * baseWidth))
  const sourceHeight = Math.max(1, Math.round(cropRect.height * baseHeight))

  cropCanvas.width = sourceWidth
  cropCanvas.height = sourceHeight
  cropContext.drawImage(
    baseCanvas,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    0,
    0,
    sourceWidth,
    sourceHeight,
  )

  return canvasToObjectUrl(cropCanvas)
}

function CropIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 4v13.2A1.8 1.8 0 0 0 8.8 19H20" />
      <path d="M4 7h11.2A1.8 1.8 0 0 1 17 8.8V20" />
    </svg>
  )
}

function RotateLeftIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8.2 7.2H4V3" />
      <path d="M4 7.2A8 8 0 1 1 7.5 18" />
      <path d="m10.6 9.1-2.8 2.8 2.8 2.8" />
    </svg>
  )
}

function RotateRightIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M15.8 7.2H20V3" />
      <path d="M20 7.2A8 8 0 1 0 16.5 18" />
      <path d="m13.4 9.1 2.8 2.8-2.8 2.8" />
    </svg>
  )
}

function TipIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3.5a6.8 6.8 0 0 0-4.2 12.2c.8.7 1.2 1.4 1.4 2.3h5.6c.2-.9.6-1.6 1.4-2.3A6.8 6.8 0 0 0 12 3.5Z" />
      <path d="M9.8 20.2h4.4" />
      <path d="M10.4 22h3.2" />
    </svg>
  )
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
  const cropViewportRef = useRef<HTMLDivElement>(null)
  const cropInteractionRef = useRef<CropInteraction | null>(null)
  const [isActionSheetOpen, setIsActionSheetOpen] = useState(false)
  const [currentActionSection, setCurrentActionSection] = useState<ActionSheetSection>('photo')
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)
  const [isEmptyAlertOpen, setIsEmptyAlertOpen] = useState(false)
  const [galleryImages, setGalleryImages] = useState<string[]>([])
  const [selectedGalleryItems, setSelectedGalleryItems] = useState<number[]>([])
  const [editorAsset, setEditorAsset] = useState<EditorAsset | null>(null)
  const [isCropMode, setIsCropMode] = useState(false)
  const [cropPreset, setCropPreset] = useState<CropPresetId>('free')
  const [cropRect, setCropRect] = useState<CropRect>(DEFAULT_CROP_RECT)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const draft = readRegisterDraft()
  const [registeredEntries, setRegisteredEntries] = useState<RegisteredEntries>(draft.entries)
  const [memoEntry, setMemoEntry] = useState(draft.memo)
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
      galleryImages.forEach((image) => revokeObjectUrl(image))
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
      setIsCropMode(false)
      setCropPreset('free')
      setCropRect(DEFAULT_CROP_RECT)
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

  const closeEditor = () => {
    setEditorAsset((current) => {
      if (!current) return current
      return null
    })
    setIsCropMode(false)
    setCropPreset('free')
    setCropRect(DEFAULT_CROP_RECT)
  }

  const removeEntry = (section: ActionSheetSection, entryId: string) => {
    setRegisteredEntries((current) => {
      const nextEntry = current[section].find((entry) => entry.id === entryId)
      revokeObjectUrl(nextEntry?.preview)

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
      navigate('/health/camera/capture?mode=photo')
      return
    }

    if (currentActionSection === 'photo' && action === '촬영하고 편집 후 추가') {
      setIsActionSheetOpen(false)
      navigate('/health/camera/capture?mode=photo&edit=true')
      return
    }

    if (currentActionSection === 'photo' && action === '사진 선택하고 편집 후 추가') {
      setIsActionSheetOpen(false)
      photoEditInputRef.current?.click()
      return
    }

    if (currentActionSection === 'video' && action === '동영상 촬영') {
      setIsActionSheetOpen(false)
      navigate('/health/camera/capture?mode=video')
      return
    }

    if (currentActionSection === 'video' && action === '촬영하고 편집 후 추가') {
      setIsActionSheetOpen(false)
      navigate('/health/camera/capture?mode=video&edit=true')
      return
    }

    if (currentActionSection === 'video' && action === '동영상 선택하고 편집 후 추가') {
      setIsActionSheetOpen(false)
      videoEditInputRef.current?.click()
      return
    }

    if (currentActionSection === 'audio' && action === '녹음') {
      setIsActionSheetOpen(false)
      navigate('/health/camera/capture?mode=audio')
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

    const nextPhotos = Array.from(files)
      .filter((file) => file.type.startsWith('image/'))
      .slice(0, getRemainingSlots('photo'))
      .map((file, index) => ({
        id: `photo-upload-${Date.now()}-${index}`,
        preview: URL.createObjectURL(file),
        label: file.name || `사진 ${index + 1}`,
        mediaType: 'image' as const,
      }))

    appendEntries('photo', nextPhotos)
    setGalleryImages([])
    setSelectedGalleryItems([])
    setIsGalleryOpen(false)
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
    setIsCropMode(false)
    setCropPreset('free')
    setCropRect(DEFAULT_CROP_RECT)
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

  const handleRotate = (direction: 'left' | 'right') => {
    setEditorAsset((current) =>
      current
        ? {
            ...current,
            rotation: current.rotation + (direction === 'left' ? -90 : 90),
          }
        : current,
    )
  }

  const normalizeEditorImage = async () => {
    if (!editorAsset || editorAsset.mediaType !== 'image' || editorAsset.rotation === 0) {
      return editorAsset
    }

    const nextSrc = await exportEditedPhoto(editorAsset.src, editorAsset.rotation)
    revokeObjectUrl(editorAsset.src)

    const nextAsset = {
      ...editorAsset,
      src: nextSrc,
      rotation: 0,
    }

    setEditorAsset(nextAsset)
    return nextAsset
  }

  const openCropEditor = async () => {
    if (!editorAsset || editorAsset.mediaType !== 'image') return

    try {
      const normalizedAsset = await normalizeEditorImage()
      setEditorAsset(normalizedAsset)
      setCropPreset('free')
      setCropRect(DEFAULT_CROP_RECT)
      setIsCropMode(true)
    } catch {
      setIsCropMode(true)
    }
  }

  const applyCropPreset = (presetId: CropPresetId) => {
    setCropPreset(presetId)
    setCropRect(createPresetCropRect(getCropAspect(presetId)))
  }

  const finishCropping = async () => {
    if (!editorAsset || editorAsset.mediaType !== 'image') return

    try {
      const nextSrc = await exportEditedPhoto(editorAsset.src, 0, cropRect)
      revokeObjectUrl(editorAsset.src)
      setEditorAsset({
        ...editorAsset,
        src: nextSrc,
      })
      setIsCropMode(false)
      setCropPreset('free')
      setCropRect(DEFAULT_CROP_RECT)
    } catch {
      setIsCropMode(false)
    }
  }

  const saveEditedAsset = async () => {
    if (!editorAsset) return

    if (editorAsset.section === 'photo') {
      const preview =
        editorAsset.rotation !== 0
          ? await exportEditedPhoto(editorAsset.src, editorAsset.rotation)
          : editorAsset.src

      appendEntries('photo', [
        {
          id: `photo-edit-${Date.now()}`,
          preview,
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

    closeEditor()
  }

  const handleSubmit = () => {
    if (isSubmitting) return

    if (!hasRegisteredContent) {
      setIsEmptyAlertOpen(true)
      return
    }

    setIsSubmitting(true)

    const memoText = memoEntry.trim()
    const audioLabels = registeredEntries.audio.map((entry) => entry.label ?? '').join(' ')
    const combinedText = `${memoText} ${audioLabels}`.trim()

    writeStoredHealthResultInput({
      stoolStatus: inferStatusFromText(combinedText, stoolKeywords),
      activityStatus: inferStatusFromText(combinedText, activityKeywords),
      mealStatus: inferStatusFromText(combinedText, mealKeywords),
      weightStatus: inferStatusFromText(combinedText, weightKeywords),
      symptomStatus: inferSymptomStatus(
        combinedText,
        registeredEntries.audio.length > 0,
        memoText.length > 0,
      ),
      photoStatus: inferPhotoStatus(registeredEntries.photo.length, registeredEntries.video.length),
    })

    writeHealthCheckMissionHistoryRecord('AI 건강 기록')
    window.sessionStorage.removeItem(HEALTH_REGISTER_DRAFT_KEY)

    navigate('/health/check-loading', {
      state: {
        returnTo: `/health/register?section=${preferredSection ?? 'photo'}`,
      },
    })
  }

  const handleBrowseDemo = () => {
    const alreadyAdded = registeredEntries.photo.some((entry) => entry.id.startsWith('photo-demo-'))
    if (!alreadyAdded) {
      appendEntries('photo', [
        {
          id: `photo-demo-${Date.now()}`,
          preview: samplePetImage,
          label: '테스트용 이미지',
          mediaType: 'image',
        },
      ])
    }
    setIsEmptyAlertOpen(false)
  }

  const startCropInteraction = (
    event: React.PointerEvent<HTMLButtonElement | HTMLDivElement>,
    handle: CropHandle,
  ) => {
    if (!cropViewportRef.current) return

    event.preventDefault()
    cropInteractionRef.current = {
      pointerId: event.pointerId,
      handle,
      startX: event.clientX,
      startY: event.clientY,
      startRect: cropRect,
    }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handleCropPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const interaction = cropInteractionRef.current
    const viewport = cropViewportRef.current

    if (!interaction || !viewport || interaction.pointerId !== event.pointerId) return

    const bounds = viewport.getBoundingClientRect()
    const deltaX = (event.clientX - interaction.startX) / bounds.width
    const deltaY = (event.clientY - interaction.startY) / bounds.height
    const nextRect = updateCropRect(
      interaction.startRect,
      interaction.handle,
      deltaX,
      deltaY,
      getCropAspect(cropPreset),
    )

    setCropRect(nextRect)
  }

  const stopCropInteraction = (event: React.PointerEvent<HTMLDivElement>) => {
    if (cropInteractionRef.current?.pointerId === event.pointerId) {
      cropInteractionRef.current = null
    }
  }

  const renderEditorContent = () => {
    if (!editorAsset) return null

    if (editorAsset.mediaType === 'video') {
      return (
        <section className="health_register_editor" aria-label="동영상 편집">
          <header className="health_register_editor_header">
            <h2>편집 후 추가</h2>
            <button type="button" onClick={closeEditor}>
              닫기
            </button>
          </header>
          <div className="health_register_editor_preview">
            <video src={editorAsset.src} controls playsInline />
          </div>
          <Button type="button" className="deactivation_btn" onClick={saveEditedAsset}>
            추가하기
          </Button>
        </section>
      )
    }

    if (isCropMode) {
      return (
        <section className="health_register_editor health_register_crop_editor" aria-label="사진 자르기">
          <header className="health_register_crop_header">
            <button type="button" onClick={() => setIsCropMode(false)}>
              <ChevronIcon direction="left" size="md" />
              자르기
            </button>
          </header>

          <div
            ref={cropViewportRef}
            className="health_register_crop_viewport"
            onPointerMove={handleCropPointerMove}
            onPointerUp={stopCropInteraction}
            onPointerCancel={stopCropInteraction}
          >
            <img src={editorAsset.src} alt="자르기 미리보기" />
            <div
              className="health_register_crop_rect"
              style={{
                left: `${cropRect.x * 100}%`,
                top: `${cropRect.y * 100}%`,
                width: `${cropRect.width * 100}%`,
                height: `${cropRect.height * 100}%`,
              }}
            >
              <div
                className="health_register_crop_drag"
                onPointerDown={(event) => startCropInteraction(event, 'move')}
              />
              <span className="health_register_crop_grid is_vertical_start" />
              <span className="health_register_crop_grid is_vertical_end" />
              <span className="health_register_crop_grid is_horizontal_start" />
              <span className="health_register_crop_grid is_horizontal_end" />
              {(['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'] as CropHandle[]).map((handle) => (
                <button
                  key={handle}
                  type="button"
                  className={`health_register_crop_handle is_${handle}`}
                  onPointerDown={(event) => startCropInteraction(event, handle)}
                />
              ))}
            </div>
          </div>

          <div className="health_register_crop_ratio_bar">
            {cropPresets.map((preset) => (
              <button
                key={preset.id}
                type="button"
                className={cropPreset === preset.id ? 'is_active' : ''}
                onClick={() => applyCropPreset(preset.id)}
              >
                <span className={`health_register_ratio_icon is_${preset.id.replace(':', '_')}`} />
                <strong>{preset.label}</strong>
              </button>
            ))}
          </div>
          <div className="health_register_crop_footer">
            <button type="button" className="health_register_crop_cancel" onClick={() => setIsCropMode(false)}>
              취소
            </button>
            <button type="button" className="health_register_crop_confirm" onClick={finishCropping}>
              완료
            </button>
          </div>
        </section>
      )
    }

    return (
      <section className="health_register_editor health_register_photo_editor" aria-label="사진 편집">
        <header className="health_register_editor_header">
          <h2>편집 후 추가</h2>
          <button type="button" onClick={closeEditor}>
            닫기
          </button>
        </header>

        <div className="health_register_editor_preview is_photo">
          <img
            src={editorAsset.src}
            alt="편집할 사진"
            style={{ transform: `rotate(${editorAsset.rotation}deg)` }}
          />
        </div>

        <div className="health_register_editor_tip">
          <span className="health_register_editor_tip_icon" aria-hidden="true">
            <TipIcon />
          </span>
          <div>
            <strong>사진을 편집해서 더 잘 보이게 만들어보세요.</strong>
            <p>회전하거나 자를 수 있어요.</p>
          </div>
        </div>

        <div className="health_register_editor_tools">
          <button type="button" onClick={() => handleRotate('left')}>
            <span aria-hidden="true">
              <RotateLeftIcon />
            </span>
            <strong>왼쪽 회전</strong>
          </button>
          <button type="button" onClick={openCropEditor}>
            <span aria-hidden="true">
              <CropIcon />
            </span>
            <strong>자르기</strong>
          </button>
          <button type="button" onClick={() => handleRotate('right')}>
            <span aria-hidden="true">
              <RotateRightIcon />
            </span>
            <strong>오른쪽 회전</strong>
          </button>
        </div>

        <Button type="button" className="deactivation_btn" onClick={saveEditedAsset}>
          추가하기
        </Button>
      </section>
    )
  }

  return (
    <>
      <PageHeader
        title="AI 건강 체크"
        leftContent={<BackButton to="/health" />}
        rightContent={
          <>
            <Button type="button" aria-label="캘린더" onClick={() => navigate('/mission')}>
              <HeaderIcon type="calendar" />
            </Button>
            <Button type="button" aria-label="알림">
              <HeaderIcon type="notification" />
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
          onChange={(event) => {
            handleGalleryFiles(event.target.files)
            event.target.value = ''
          }}
        />
        <input
          ref={photoEditInputRef}
          type="file"
          accept="image/*"
          className="health_register_file_input"
          onChange={(event) => {
            handlePhotoEditFiles(event.target.files)
            event.target.value = ''
          }}
        />
        <input
          ref={videoInputRef}
          type="file"
          accept="video/*"
          multiple
          className="health_register_file_input"
          onChange={(event) => {
            handleVideoFiles(event.target.files)
            event.target.value = ''
          }}
        />
        <input
          ref={videoEditInputRef}
          type="file"
          accept="video/*"
          className="health_register_file_input"
          onChange={(event) => {
            handleVideoEditFiles(event.target.files)
            event.target.value = ''
          }}
        />
        <input
          ref={audioUploadInputRef}
          type="file"
          accept="audio/*"
          multiple
          className="health_register_file_input"
          onChange={(event) => {
            handleAudioFiles(event.target.files)
            event.target.value = ''
          }}
        />

        {orderedSections.map((section) => (
          <ContentSection
            className="health_register_section"
            key={section.id}
            title={section.title}
            action={<span className="health_register_section_limit">{section.limit}</span>}
          >

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
                {Array.from({
                  length: Math.min(
                    REGISTER_LIMIT,
                    Math.max(1, registeredEntries[section.id].length + (registeredEntries[section.id].length < REGISTER_LIMIT ? 1 : 0)),
                  ),
                }).map((_, index) => {
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
                              <img src={entry.preview} alt={`${section.title} ${index + 1}`} />
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
                })}
              </div>
            )}
          </ContentSection>
        ))}

        

        <div className="health_register_submit">
          <button type="button" className="health_register_alert_browse" onClick={handleBrowseDemo}>
          테스트용 이미지로 둘러보기
          </button>
          <Button
            type="button"
            className={`purple_btn square_btn ${!hasRegisteredContent ? 'is_disabled' : ''}`}
            aria-disabled={!hasRegisteredContent || isSubmitting}
            disabled={isSubmitting}
            onClick={handleSubmit}
          >
            등록하기
          </Button>
        </div>
      </main>

      {isActionSheetOpen ? (
        <AddSheet onClose={() => setIsActionSheetOpen(false)}>
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
              className="purple_btn"
              style={{ marginTop: '20px', marginBottom: '20px' }}
              onClick={() => setIsActionSheetOpen(false)}
            >
              닫기
            </button>
          </section>
        </AddSheet>
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
            <button type="button" className="health_gallery_upload" onClick={uploadSelectedGalleryItems}>
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
                  <span className="health_gallery_badge">{isSelected ? selectedIndex + 1 : ''}</span>
                </button>
              )
            })}
          </div>
        </section>
      ) : null}

      {isEmptyAlertOpen ? (
        <Alert onClose={() => setIsEmptyAlertOpen(false)}>
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
            </div>
            <Button type="button" className="purple_btn square_btn" onClick={() => setIsEmptyAlertOpen(false)}>
              확인
            </Button>
        </Alert>
      ) : null}

      {editorAsset ? (
        <div className="health_register_editor_layer" role="presentation">
          <button
            type="button"
            className="health_register_editor_dim"
            aria-label="편집 닫기"
            onClick={closeEditor}
          />
          {renderEditorContent()}
        </div>
      ) : null}
    </>
  )
}

export default HealthRegister
