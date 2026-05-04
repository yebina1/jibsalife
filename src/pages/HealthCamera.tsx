import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import './health.css'
import './HealthCamera.css'
import Button from '../components/html/Button'
import guideExampleImage from '../img/ex.png'

const GUIDE_DURATION_MS = 5000

const guideItems = [
  {
    icon: 'target',
    title: '문제가 있는 부위를 중심으로 촬영해주세요',
    description: '문제가 있는 부위가 잘 보이도록 촬영해주세요.',
  },
  {
    icon: 'light',
    title: '흐리거나 어두운 사진은 피해 주세요',
    description: '선명한 사진을 위해 밝고 또렷하게 촬영해주세요.',
  },
  {
    icon: 'camera',
    title: '가능하면 밝은 곳에서 촬영해주세요',
    description: '자연광에서 촬영하면 더 잘 보입니다.',
  },
] as const

function GuideIcon({ type }: { type: (typeof guideItems)[number]['icon'] }) {
  if (type === 'target') {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="24" cy="24" r="18" />
        <circle cx="24" cy="24" r="6" />
        <path d="M24 8v7M24 33v7M8 24h7M33 24h7M20 24h8M24 20v8" />
      </svg>
    )
  }

  if (type === 'light') {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="24" cy="24" r="9" />
        <path d="M24 6v6M24 36v6M6 24h6M36 24h6M11.3 11.3l4.2 4.2M32.5 32.5l4.2 4.2M36.7 11.3l-4.2 4.2M15.5 32.5l-4.2 4.2" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path d="M15 17h5l2-4h8l2 4h5a4 4 0 0 1 4 4v13a4 4 0 0 1-4 4H11a4 4 0 0 1-4-4V21a4 4 0 0 1 4-4h4Z" />
      <circle cx="24" cy="28" r="7" />
    </svg>
  )
}

function HealthCamera() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [cameraError, setCameraError] = useState('')
  const [showGuide, setShowGuide] = useState(true)
  const mode = searchParams.get('mode') === 'video' ? 'video' : 'photo'
  const actionLabel = mode === 'video' ? '동영상 촬영' : '사진 촬영'

  const openCamera = () => {
    setShowGuide(false)
  }

  useEffect(() => {
    if (!showGuide) {
      return
    }

    const guideTimer = window.setTimeout(openCamera, GUIDE_DURATION_MS)

    return () => window.clearTimeout(guideTimer)
  }, [showGuide])

  useEffect(() => {
    if (showGuide) {
      return
    }

    let mounted = true

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: mode === 'video',
        })

        if (!mounted) {
          stream.getTracks().forEach((track) => track.stop())
          return
        }

        streamRef.current = stream

        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      } catch {
        if (mounted) {
          setCameraError('카메라 권한을 허용해 주세요.')
        }
      }
    }

    startCamera()

    return () => {
      mounted = false
      streamRef.current?.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
  }, [mode, showGuide])

  if (showGuide) {
    return (
      <main className="page health_page health_camera_page health_camera_page_guide">
        <section className="health_camera_guide" aria-label="촬영 안내">
          <div className="health_camera_guide_copy">
            <p>AI 건강 체크 촬영 가이드</p>
            <h1>
              <span>선명하게</span> 촬영해주세요
            </h1>
          </div>

          <section className="health_camera_guide_panel" aria-label="촬영 예시와 안내">
            <div className="health_camera_example">
              <span>예시 이미지</span>
              <img src={guideExampleImage} alt="피부 상태 촬영 예시" />
            </div>

            <div className="health_camera_guide_list">
              {guideItems.map((item) => (
                <article className="health_camera_guide_item" key={item.title}>
                  <span className="health_camera_guide_card_icon">
                    <GuideIcon type={item.icon} />
                  </span>
                  <div>
                    <h2>{item.title}</h2>
                    <p>{item.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <button type="button" className="health_camera_guide_skip" onClick={openCamera}>
            건너뛰기
          </button>
        </section>
      </main>
    )
  }

  return (
    <main className="page health_page health_camera_page">
      <button
        type="button"
        className="health_camera_back"
        aria-label="뒤로가기"
        onClick={() => navigate(-1)}
      >
        <i className="bx bx-chevron-left" aria-hidden="true"></i>
      </button>

      <section className="health_camera_view" aria-label={actionLabel}>
        {cameraError ? (
          <div className="health_camera_error">{cameraError}</div>
        ) : (
          <video ref={videoRef} autoPlay muted playsInline />
        )}
      </section>

      <div className="health_camera_actions">
        <Button
          type="button"
          className="health_camera_shutter"
          aria-label={actionLabel}
          onClick={() => navigate('/health/check-loading')}
        >
          <span />
        </Button>
      </div>
    </main>
  )
}

export default HealthCamera
