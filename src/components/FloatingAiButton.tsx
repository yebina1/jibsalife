import { useNavigate } from 'react-router'
import FloatingButton from './FloatingButton'
import aiChatIcon from '../img/aichat.svg'

export default function FloatingAiButton() {
  const navigate = useNavigate()

  return (
    <FloatingButton
      placement="ai"
      className="floating_button_ai_chat"
      aria-label="AI assistant"
      onClick={() => navigate('/health/qna')}
    >
      <span className="floating_button_icon_frame" aria-hidden="true">
        <img src={aiChatIcon} alt="" />
      </span>
    </FloatingButton>
  )
}
