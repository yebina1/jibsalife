import type { ButtonHTMLAttributes } from 'react'
import FloatingButton from './FloatingButton'

type FloatingWriteButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>

function FloatingWriteButton({ 'aria-label': ariaLabel = '글쓰기', ...props }: FloatingWriteButtonProps) {
  return (
    <FloatingButton placement="community" aria-label={ariaLabel} {...props}>
      <span className="floating_button_icon_frame" aria-hidden="true">
        <i className="bx bx-edit-alt" />
      </span>
    </FloatingButton>
  )
}

export default FloatingWriteButton
