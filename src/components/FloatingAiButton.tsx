import { useNavigate } from 'react-router'
import FloatingButton from './FloatingButton'
import aiChatIcon from '../img/aichat.svg'

type FloatingAiButtonProps = {
  className?: string
}

export default function FloatingAiButton({ className }: FloatingAiButtonProps) {
  const navigate = useNavigate()
  const buttonClassName = ['floating_button_ai_chat', className].filter(Boolean).join(' ')

  return (
    <FloatingButton
      placement="ai"
      className={buttonClassName}
      aria-label="AI assistant"
      onClick={() => navigate('/health/qna')}
    >
      <span className="floating_button_icon_frame" aria-hidden="true">
        <img src={aiChatIcon} alt="AI 챗봇 아이콘" />
      </span>
    </FloatingButton>
  )
}
