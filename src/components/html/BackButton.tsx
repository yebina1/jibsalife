import { useNavigate } from 'react-router'
import Button from './Button'

type BackButtonProps = {
<<<<<<< HEAD
  to?: number | string
}

export default function BackButton({ to = -1 }: BackButtonProps) {
  const navigate = useNavigate()

  return (
    <Button type="button" className="back_btn" onClick={() => navigate(to)}>
=======
  step?: number
}

export default function BackButton({ step = -1 }: BackButtonProps) {
  const navigate = useNavigate()

  return (
    <Button type="button" className="back_btn" onClick={() => navigate(step)}>
>>>>>>> 6b0461ffb5aa96f7afc69c1a3640d2e871a05265
      <i className="bx bx-chevron-left"></i>
    </Button>
  )
}
