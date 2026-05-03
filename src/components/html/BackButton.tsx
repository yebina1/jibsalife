import { useNavigate } from 'react-router'
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
<<<<<<< HEAD
    <Button type="button" className="back_btn" onClick={handleClick}>
=======
    <Button
      type="button"
      className="back_btn"
      onClick={() => {
        if (typeof to === 'number') {
          navigate(to)
          return
        }

        navigate(to)
      }}
    >
>>>>>>> 5150d2f3044d8ca6247b153219a63f50e35c0d74
      <i className="bx bx-chevron-left"></i>
    </Button>
  )
}
