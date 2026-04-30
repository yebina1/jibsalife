import { useNavigate } from 'react-router'
import Button from './Button'

export default function BackButton() {
  const navigate = useNavigate()

  return (
    <Button type="button" className="back_btn" onClick={() => navigate(-1)}>
      <i className="bx bx-chevron-left"></i>
    </Button>
  )
}
