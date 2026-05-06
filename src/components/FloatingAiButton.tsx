import { useNavigate } from 'react-router'
import FloatingButton from './FloatingButton'

export default function FloatingAiButton() {
  const navigate = useNavigate()
  const aiIcon = `${import.meta.env.BASE_URL}ai.svg`

  return (
    <FloatingButton
      placement="ai"
      aria-label="AI assistant"
      onClick={() => navigate('/health/qna')}
    >
      <span className="floating_button_icon_frame" aria-hidden="true">
        <img src={aiIcon} alt="" />
      </span>
    </FloatingButton>
  )
}
