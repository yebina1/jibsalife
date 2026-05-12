import './AddSheet.css'
import HomeIndicator from './HomeIndicator'
import { useState } from 'react'

type Props = {
  onClose: () => void
  children?: React.ReactNode
  onScrollCapture?: React.UIEventHandler<HTMLDivElement>
  onWheelCapture?: React.WheelEventHandler<HTMLDivElement>
  onTouchMoveCapture?: React.TouchEventHandler<HTMLDivElement>
  onMouseDownCapture?: React.MouseEventHandler<HTMLDivElement>
}

function AddSheet({ onClose, children, onScrollCapture, onWheelCapture, onTouchMoveCapture, onMouseDownCapture }: Props) {
  const [isClosing, setIsClosing] = useState(false)

  const requestClose = () => {
    setIsClosing(true)
  }

  return (
    <div
      className={`add_sheet_overlay${isClosing ? ' is_closing' : ''}`}
      onClick={requestClose}
      onScrollCapture={onScrollCapture}
      onWheelCapture={onWheelCapture}
      onTouchMoveCapture={onTouchMoveCapture}
      onMouseDownCapture={onMouseDownCapture}
    >
      <div
        className="add_sheet"
        onClick={(e) => e.stopPropagation()}
        onAnimationEnd={(event) => {
          if (event.animationName === 'add-sheet-slide-down') {
            onClose()
          }
        }}
      >
        <div className="add_sheet_handle" />
        {children}
        <HomeIndicator />
      </div>
    </div>
  )
}

export default AddSheet
