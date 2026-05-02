import { useNavigate } from 'react-router'
import Button from './Button'

type BackButtonProps = {
  to?: number | string
}

export default function BackButton({ to = -1 }: BackButtonProps) {
  const navigate = useNavigate()

  return (
    <Button type="button" className="back_btn" onClick={() => navigate(to)}>
      <i className="bx bx-chevron-left"></i>
    </Button>
  )
}
