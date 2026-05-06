import { useNavigate } from 'react-router'
import ChevronIcon from '../ChevronIcon'
import Button from './Button'

type BackButtonProps = {
  to?: number | string
}

export default function BackButton({ to = -1 }: BackButtonProps) {
  const navigate = useNavigate()

  const handleClick = () => {
    if (typeof to === 'number') {
      navigate(to)
      return
    }

    navigate(to)
  }

  return (
    <Button type="button" className="back_btn" onClick={handleClick}>
      <ChevronIcon direction="left" size="lg" />
    </Button>
  )
}
