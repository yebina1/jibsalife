import HealthCheckItem from './HealthCheckItem'

const healthCheckOptions = [
  {
    id: 'photo',
    icon: 'bx bx-camera',
    label: '사진 촬영',
  },
  {
    id: 'audio',
    icon: 'bx bx-volume-full',
    label: '녹음 촬영',
  },
  {
    id: 'video',
    icon: 'bx bx-video',
    label: '영상 촬영',
  },
  {
    id: 'memo',
    icon: 'bx bx-notepad',
    label: '메모 작성',
  },
]

function HealthCheck() {
  return (
    <ul className="health_check">
      {healthCheckOptions.map((option) => (
        <HealthCheckItem key={option.id} icon={option.icon} label={option.label} />
      ))}
    </ul>
  )
}

export default HealthCheck
