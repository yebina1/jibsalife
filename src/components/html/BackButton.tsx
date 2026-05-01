import { useNavigate } from 'react-router'
import Button from './Button'

type BackButtonProps = {
  step?: number
}

export default function BackButton({ step = -1 }: BackButtonProps) {
  const navigate = useNavigate()

  return (
    <Button type="button" className="back_btn" onClick={() => navigate(step)}>
      <i className="bx bx-chevron-left"></i>
    </Button>
  )
}
