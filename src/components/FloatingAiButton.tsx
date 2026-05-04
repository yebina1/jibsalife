import { useNavigate } from 'react-router'
import './FloatingAiButton.css'

export default function FloatingAiButton() {
  const navigate = useNavigate()
  const aiIcon = `${import.meta.env.BASE_URL}ai.svg`

  return (
    <button
      type="button"
      className="floating_ai_button"
      aria-label="AI assistant"
      onClick={() => navigate('/health/qna')}
    >
      <img src={aiIcon} alt="" aria-hidden="true" />
    </button>
  )
}
