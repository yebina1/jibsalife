import './ActionOption.css'
import Button from './html/Button'

type ActionOptionProps = {
  title: string
  description?: string
  onClick?: () => void
}

function ActionOption({ title, description, onClick }: ActionOptionProps) {
  return (
    <Button className="action_option" type="button" onClick={onClick}>
      <span className="action_option_mark" aria-hidden="true"></span>
      <div className="action_option_text">
        <strong>{title}</strong>
        <p>{description}</p>
      </div>
      <i className="bx bx-chevron-right" aria-hidden="true"></i>
    </Button>
  )
}

export default ActionOption
