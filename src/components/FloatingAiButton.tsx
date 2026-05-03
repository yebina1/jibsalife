import { useNavigate } from 'react-router'
import './FloatingAiButton.css'

export default function FloatingAiButton() {
  const navigate = useNavigate()

  return (
    <button
      type="button"
      className="floating_ai_button"
      aria-label="AI assistant"
      onClick={() => navigate('/health/qna')}
    >
      <span>AI</span>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3a7 7 0 0 0-7 7v3.1A2.5 2.5 0 0 0 6.5 18H8l2.2 2.2a1 1 0 0 0 1.7-.7V18h1a7 7 0 0 0 7-7 8 8 0 0 0-8-8Zm-2.8 8.2a1.1 1.1 0 1 1 0-2.2 1.1 1.1 0 0 1 0 2.2Zm5.6 0a1.1 1.1 0 1 1 0-2.2 1.1 1.1 0 0 1 0 2.2ZM12 16c-1.9 0-3.5-1-4.3-2.4h8.6C15.5 15 13.9 16 12 16Z" />
      </svg>
    </button>
  )
}
