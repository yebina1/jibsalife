import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { useRef } from 'react'
import './MyPage.css'
import PageHeader from '../../components/PageHeader'
import HeaderIcon from '../../components/HeaderIcon'
import ChevronIcon from '../../components/ChevronIcon'
import ContentSection from '../../components/ContentSection'
import SummaryProfileCard from '../../components/SummaryProfileCard'
import BackButton from '../../components/html/BackButton'
import Button from '../../components/html/Button'
import contents2 from '../../img/contents2.png'
import leeyoriImage from '../../img/leeyori.png'
import pungpungiImage from '../../img/pungpungi.png'

const activityItems = [
  { label: '활동 내역', icon: 'activity' },
  { label: '저장한 장소', icon: 'pin' },
  { label: '저장한 게시글', icon: 'bookmark' },
  { label: '미션 수행 내역', icon: 'paw' },
  { label: '뱃지 획득 내역', icon: 'badge' },
  { label: '구독 관리', icon: 'diamond' },
] as const

const supportItems = [
  { label: '공지사항', icon: 'megaphone' },
  { label: '고객센터', icon: 'headset' },
  { label: '자주 묻는 질문(FAQ)', icon: 'help' },
  { label: '앱 설정', icon: 'gear' },
] as const

const myProfileStats = [
  { label: '게시글', value: '12' },
  { label: '댓글', value: '23' },
  { label: '뱃지', value: '8' },
  { label: '쿠폰', value: '1장' },
] as const

const myPetSlides = [
  {
    id: 1,
    image: leeyoriImage,
    name: '이요리',
    breed: '코리안 쇼트 헤어',
    details: '나이: 5살 · 몸무게: 3kg · 성별: 남아',
  },
  {
    id: 2,
    image: pungpungiImage,
    name: '뿡뿡이',
    breed: '포메라니안',
    details: '나이: 2살 · 몸무게: 5kg · 성별: 남아',
  },
] as const

const LOCATION_STORAGE_KEY = 'mypage-location'
const DEFAULT_LOCATION_MESSAGE = '위치 정보를 등록하고\n맞춤 서비스를 받아 보세요.'

type SavedLocation = {
  latitude: number
  longitude: number
  savedAt: string
  address?: string
}

function formatCoordinateLocation(latitude: number, longitude: number) {
  return `현재 위치 ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`
}

function formatAddressLocation(address: string) {
  return `현재 위치 ${address}`
}

function pickAddressPart(...values: Array<string | undefined>) {
  return values.find((value) => typeof value === 'string' && value.trim().length > 0)?.trim()
}

async function reverseGeocodeLocation(latitude: number, longitude: number) {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&accept-language=ko`,
    {
      headers: {
        Accept: 'application/json',
      },
    },
  )

  if (!response.ok) {
    throw new Error('Failed to reverse geocode location')
  }

  const data = (await response.json()) as {
    address?: {
      city?: string
      province?: string
      state?: string
      borough?: string
      suburb?: string
      town?: string
      village?: string
      county?: string
      city_district?: string
      quarter?: string
      neighbourhood?: string
    }
  }

  const city = pickAddressPart(
    data.address?.city,
    data.address?.town,
    data.address?.village,
    data.address?.county,
    data.address?.state,
    data.address?.province,
  )
  const district = pickAddressPart(data.address?.borough, data.address?.city_district, data.address?.suburb)
  const dong = pickAddressPart(data.address?.quarter, data.address?.neighbourhood)
  const formattedAddress = [city, district, dong].filter(Boolean).join(' ')

  return formattedAddress || null
}

function MyPageIcon({ type }: { type: string }) {
  if (type === 'activity') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 12h4l2-6 4 12 2-6h6" />
      </svg>
    )
  }

  if (type === 'pin') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 21s7-6.2 7-12A7 7 0 1 0 5 9c0 5.8 7 12 7 12Z" />
        <circle cx="12" cy="9" r="2.5" />
      </svg>
    )
  }

  if (type === 'bookmark') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 4h12v17l-6-4-6 4Z" />
      </svg>
    )
  }

  if (type === 'paw') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="6.8" cy="8.2" r="1.8" />
        <circle cx="11.2" cy="6.2" r="1.8" />
        <circle cx="15.8" cy="8.2" r="1.8" />
        <circle cx="18.4" cy="12.2" r="1.8" />
        <path d="M7.8 15.3c.8-2.5 2.4-4 4.3-4s3.4 1.5 4.2 4c.5 1.7-.8 3.1-2.4 2.5-.8-.3-1.2-.7-1.8-.7s-1 .4-1.8.7c-1.6.6-3-.8-2.5-2.5Z" />
      </svg>
    )
  }

  if (type === 'badge') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="9" r="5.5" />
        <path d="M8.5 14 7 21l5-2.5L17 21l-1.5-7" />
      </svg>
    )
  }

  if (type === 'diamond') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 3h12l4 6-10 12L2 9Z" />
        <path d="M2 9h20M6 3l6 15M18 3l-6 15M9 3l3 6 3-6" />
      </svg>
    )
  }

  if (type === 'megaphone') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 13h4l9 4V7l-9 4H4Z" />
        <path d="M8 13v5M19 10a4 4 0 0 1 0 4" />
      </svg>
    )
  }

  if (type === 'headset') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 13a8 8 0 0 1 16 0v4a3 3 0 0 1-3 3h-3" />
        <path d="M6 13h3v5H6a2 2 0 0 1-2-2v-1a2 2 0 0 1 2-2ZM18 13h-3v5h3a2 2 0 0 0 2-2v-1a2 2 0 0 0-2-2Z" />
      </svg>
    )
  }

  if (type === 'help') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="8" />
        <path d="M9.8 9.4a2.3 2.3 0 0 1 4.4 1c0 1.8-2.2 2-2.2 3.6M12 17h.1" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z" />
      <path d="m19.4 13 .1-1-.1-1 2-1.6-2-3.4-2.4 1a7.8 7.8 0 0 0-1.7-1l-.4-2.6h-4l-.4 2.6a7.8 7.8 0 0 0-1.7 1l-2.4-1-2 3.4 2 1.6-.1 1 .1 1-2 1.6 2 3.4 2.4-1a7.8 7.8 0 0 0 1.7 1l.4 2.6h4l.4-2.6a7.8 7.8 0 0 0 1.7-1l2.4 1 2-3.4Z" />
    </svg>
  )
}

function MyPage() {
  const navigate = useNavigate()
  const [savedLocation, setSavedLocation] = useState<SavedLocation | null>(null)
  const [locationMessage, setLocationMessage] = useState(DEFAULT_LOCATION_MESSAGE)
  const [isLocating, setIsLocating] = useState(false)
  const [petSlideIndex, setPetSlideIndex] = useState(0)
  const [petDragOffset, setPetDragOffset] = useState(0)
  const [isPetDragging, setIsPetDragging] = useState(false)
  const petDragStateRef = useRef({ startX: 0 })

  useEffect(() => {
    const savedValue = window.localStorage.getItem(LOCATION_STORAGE_KEY)

    if (!savedValue) return

    try {
      const parsedValue = JSON.parse(savedValue) as SavedLocation
      setSavedLocation(parsedValue)
      setLocationMessage(
        parsedValue.address
          ? formatAddressLocation(parsedValue.address)
          : formatCoordinateLocation(parsedValue.latitude, parsedValue.longitude),
      )
    } catch {
      window.localStorage.removeItem(LOCATION_STORAGE_KEY)
    }
  }, [])

  const handleLocationSetting = () => {
    if (!navigator.geolocation) {
      setLocationMessage('이 브라우저에서는 위치 기능을 지원하지 않아요.')
      return
    }

    setIsLocating(true)
    setLocationMessage('GPS로 현재 위치를 확인하고 있어요...')

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const nextLocation: SavedLocation = {
          latitude: coords.latitude,
          longitude: coords.longitude,
          savedAt: new Date().toISOString(),
        }

        reverseGeocodeLocation(nextLocation.latitude, nextLocation.longitude)
          .then((address) => {
            const nextSavedLocation = address ? { ...nextLocation, address } : nextLocation

            window.localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(nextSavedLocation))
            setSavedLocation(nextSavedLocation)
            setLocationMessage(
              address
                ? formatAddressLocation(address)
                : formatCoordinateLocation(nextLocation.latitude, nextLocation.longitude),
            )
          })
          .catch(() => {
            window.localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(nextLocation))
            setSavedLocation(nextLocation)
            setLocationMessage(formatCoordinateLocation(nextLocation.latitude, nextLocation.longitude))
          })
          .finally(() => {
            setIsLocating(false)
          })
      },
      (error) => {
        setLocationMessage(
          error.code === error.PERMISSION_DENIED
            ? '위치 권한이 거부됐어요. 브라우저 권한을 확인해 주세요.'
            : '위치를 가져오지 못했어요. 잠시 후 다시 시도해 주세요.',
        )
        setIsLocating(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    )
  }

  const handlePetDragStart = (clientX: number) => {
    petDragStateRef.current.startX = clientX
    setIsPetDragging(true)
    setPetDragOffset(0)
  }

  const handlePetDragMove = (clientX: number) => {
    if (!isPetDragging) return
    setPetDragOffset(clientX - petDragStateRef.current.startX)
  }

  const handlePetDragEnd = () => {
    if (!isPetDragging) return

    const threshold = 48

    if (petDragOffset <= -threshold && petSlideIndex < myPetSlides.length - 1) {
      setPetSlideIndex((current) => current + 1)
    } else if (petDragOffset >= threshold && petSlideIndex > 0) {
      setPetSlideIndex((current) => current - 1)
    }

    setIsPetDragging(false)
    setPetDragOffset(0)
  }

  return (
    <>
      <PageHeader
        title="마이페이지"
        leftContent={<BackButton to="/home" />}
        rightContent={
          <>
            <Button type="button" aria-label="캘린더" onClick={() => navigate('/mission')}>
              <HeaderIcon type="calendar" />
            </Button>
            <Button type="button" aria-label="알림" className="mypage_notification">
              <HeaderIcon type="notification" />
            </Button>
            <Button type="button" aria-label="설정" className="mypage_header_gear">
              <HeaderIcon type="settings" />
            </Button>
          </>
        }
      />

      <main className="page mypage_page">
        <section className="mypage_location_card">
          <p>
            {locationMessage.split('\n').map((line) => (
              <span key={line}>{line}</span>
            ))}
            {savedLocation ? <small>위치 저장 완료</small> : null}
          </p>
          <button className='white_radius_btn' type="button" onClick={handleLocationSetting} disabled={isLocating}>
            {isLocating ? '확인 중...' : '위치설정'}
            <MyPageIcon type="pin" />
          </button>
        </section>

        <section className="mypage_profile_section">
          <div className="mypage_profile_heading">
            <h3>내 프로필</h3>
            <span>구독중</span>
          </div>

          <div className="mypage_profile_card_wrap">
            <SummaryProfileCard
              image={contents2}
              imageAlt="프로필 이미지"
              name="뿌직뿌직"
              breed=""
              details="포인트: 1,200"
              careGuideLabel="보유 뱃지  🏅  🐾  🐾"
              stats={myProfileStats}
              className="mypage_profile_card"
            />
          </div>
        </section>

        <section className="mypage_pet_area" aria-labelledby="mypage_pet_title">
          <h2 id="mypage_pet_title">내 반려동물</h2>
          <div
            className="mypage_pet_slider"
            aria-label="내 반려동물 슬라이드"
            onPointerDown={(event) => {
              handlePetDragStart(event.clientX)
              event.currentTarget.setPointerCapture(event.pointerId)
            }}
            onPointerMove={(event) => handlePetDragMove(event.clientX)}
            onPointerUp={(event) => {
              if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                event.currentTarget.releasePointerCapture(event.pointerId)
              }
              handlePetDragEnd()
            }}
            onPointerCancel={(event) => {
              if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                event.currentTarget.releasePointerCapture(event.pointerId)
              }
              handlePetDragEnd()
            }}
          >
            <ul
              className={isPetDragging ? 'dragging' : undefined}
              style={{
                marginLeft: `calc(-${petSlideIndex * 88}% - ${petSlideIndex * 12}px + ${petDragOffset}px)`,
              }}
            >
              {myPetSlides.map((pet) => (
                <li key={pet.id}>
                  <SummaryProfileCard
                    image={pet.image}
                    imageAlt="반려동물 프로필"
                    name={pet.name}
                    breed={pet.breed}
                    details={pet.details}
                    careGuideLabel="케어 가이드"
                    stats={[]}
                    className="mypage_pet_summary_card"
                  />
                </li>
              ))}
            </ul>
          </div>
          <div className="mypage_pet_dots" aria-label="반려동물 슬라이드 페이지">
            {myPetSlides.map((pet, index) => (
              <button
                key={pet.id}
                type="button"
                className={index === petSlideIndex ? 'active' : ''}
                aria-label={`${index + 1}번 반려동물 보기`}
                aria-pressed={index === petSlideIndex}
                onClick={() => setPetSlideIndex(index)}
              />
            ))}
          </div>
        </section>

        <ContentSection className="mypage_menu_section" title="내 활동">
          <ul>
            {activityItems.map((item) => (
              <li key={item.label}>
                <button
                  type="button"
                  className="mypage_menu_button"
                  disabled={item.label !== '구독 관리'}
                  onClick={item.label === '구독 관리' ? () => navigate('/mypage/subscription') : undefined}
                >
                  <span className="mypage_menu_left">
                    {item.label}
                  </span>
                  <ChevronIcon direction="right" size="md" />
                </button>
              </li>
            ))}
          </ul>
        </ContentSection>

        <ContentSection className="mypage_menu_section" title="고객 지원">
          <ul>
            {supportItems.map((item) => (
              <li key={item.label}>
                <button type="button" className="mypage_menu_button" disabled>
                  <span className="mypage_menu_left">
                    {item.label}
                  </span>
                  <ChevronIcon direction="right" size="md" />
                </button>
              </li>
            ))}
          </ul>
        </ContentSection>
      </main>
    </>
  )
}

export default MyPage
