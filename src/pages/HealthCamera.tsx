import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import './health.css'
import './HealthCamera.css'
import Button from '../components/html/Button'

function HealthCamera() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [cameraError, setCameraError] = useState('')
  const mode = searchParams.get('mode') === 'video' ? 'video' : 'photo'
  const actionLabel = mode === 'video' ? '영상 촬영' : '사진 촬영'

  useEffect(() => {
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
  }, [mode])

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
