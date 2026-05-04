import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import './health.css'
import './HealthCamera.css'
import Button from '../components/html/Button'
import guideExampleImage from '../img/ex.png'

const GUIDE_DURATION_MS = 5000

type GuideMode = 'photo' | 'audio' | 'video' | 'memo'
type GuideIconType = 'target' | 'light' | 'camera'

const guideConfigs: Record<
  GuideMode,
  {
    label: string
    title: string
    highlight: string
    actionLabel: string
    items: Array<{
      icon: GuideIconType
      title: string
      description: string
    }>
  }
> = {
  photo: {
    label: 'AI 건강 체크 촬영 가이드',
    title: '선명하게 촬영해주세요',
    highlight: '선명하게',
    actionLabel: '사진 촬영',
    items: [
      {
        icon: 'target',
        title: '문제가 있는 부위를 중심으로 촬영해주세요',
        description: '문제가 있는 부위가 잘 보이도록 촬영해주세요.',
      },
      {
        icon: 'light',
        title: '흐리거나 어두운 사진은 피해주세요',
        description: '선명한 사진을 위해 밝고 또렷하게 촬영해주세요.',
      },
      {
        icon: 'camera',
        title: '가능하면 밝은 곳에서 촬영해주세요',
        description: '자연광에서 촬영하면 더 잘 보입니다.',
      },
    ],
  },
  audio: {
    label: 'AI 건강 체크 음성 기록 가이드',
    title: '또렷하게 말씀해주세요',
    highlight: '또렷하게',
    actionLabel: '음성 기록',
    items: [
      {
        icon: 'light',
        title: '조용한 환경에서 녹음해주세요',
        description: '주변 소음이 적을수록 내용을 더 정확하게 확인할 수 있어요.',
      },
      {
        icon: 'target',
        title: '증상이나 변화를 구체적으로 말씀해주세요',
        description: '언제부터 어떤 변화가 있었는지 함께 말해주세요.',
      },
      {
        icon: 'camera',
        title: '짧고 간단하게 말씀해주세요',
        description: '핵심 내용을 또렷하게 남겨주세요.',
      },
    ],
  },
  video: {
    label: 'AI 건강 체크 동영상 촬영 가이드',
    title: '움직임이 잘 보이도록 촬영해주세요',
    highlight: '움직임이',
    actionLabel: '동영상 촬영',
    items: [
      {
        icon: 'target',
        title: '문제가 보이는 순간을 촬영해주세요',
        description: '증상이나 움직임이 드러나는 장면을 중심으로 담아주세요.',
      },
      {
        icon: 'camera',
        title: '카메라는 흔들리지 않게 유지해주세요',
        description: '화면이 흔들리지 않으면 상태를 더 잘 확인할 수 있어요.',
      },
      {
        icon: 'light',
        title: '밝은 환경에서 촬영해주세요',
        description: '어둡지 않은 곳에서 촬영하면 움직임이 더 선명하게 보여요.',
      },
    ],
  },
  memo: {
    label: 'AI 건강 체크 메모 작성 가이드',
    title: '간단하게 기록해주세요',
    highlight: '간단하게',
    actionLabel: '메모 작성',
    items: [
      {
        icon: 'target',
        title: '증상이나 변화를 중심으로 작성해주세요',
        description: '가장 걱정되는 변화부터 적어주세요.',
      },
      {
        icon: 'light',
        title: '시간이나 횟수를 함께 적어주세요',
        description: '언제, 몇 번 있었는지 함께 적으면 좋아요.',
      },
      {
        icon: 'camera',
        title: '짧고 이해하기 쉽게 작성해주세요',
        description: '핵심만 간단히 정리해 주세요.',
      },
    ],
  },
}

function GuideIcon({ type }: { type: GuideIconType }) {
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
  const [showGuide, setShowGuide] = useState(searchParams.get('guide') !== 'false')
  const modeParam = searchParams.get('mode')
  const mode: GuideMode =
    modeParam === 'audio' || modeParam === 'video' || modeParam === 'memo' ? modeParam : 'photo'
  const guideConfig = guideConfigs[mode]
  const isCaptureMode = mode === 'photo' || mode === 'video'
  const actionLabel = guideConfig.actionLabel

  const continueAfterGuide = () => {
    if (mode === 'photo') {
      navigate('/health/register')
      return
    }

    if (isCaptureMode) {
      setShowGuide(false)
      return
    }

    navigate('/health/check-loading')
  }

  useEffect(() => {
    if (!showGuide) {
      return
    }

    const guideTimer = window.setTimeout(continueAfterGuide, GUIDE_DURATION_MS)

    return () => window.clearTimeout(guideTimer)
  }, [showGuide, isCaptureMode, navigate])

  useEffect(() => {
    if (showGuide || !isCaptureMode) {
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
  }, [mode, showGuide, isCaptureMode])

  if (showGuide) {
    return (
      <main className="page health_page health_camera_page health_camera_page_guide">
        <section className="health_camera_guide" aria-label="촬영 안내">
          <div className="health_camera_guide_copy">
            <p>{guideConfig.label}</p>
            <h1>
              <span>{guideConfig.highlight}</span>{' '}
              {guideConfig.title.replace(guideConfig.highlight, '').trim()}
            </h1>
          </div>

          <section className="health_camera_guide_panel" aria-label={`${guideConfig.actionLabel} 안내`}>
            <div className="health_camera_example">
              <span>예시 이미지</span>
              <img src={guideExampleImage} alt="피부 상태 촬영 예시" />
            </div>

            <div className="health_camera_guide_list">
              {guideConfig.items.map((item) => (
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

          <button type="button" className="health_camera_guide_skip" onClick={continueAfterGuide}>
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
