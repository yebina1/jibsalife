import './AddSheet.css'
import HomeIndicator from './HomeIndicator'

type Props = {
  onClose: () => void
  children?: React.ReactNode
  onScrollCapture?: React.UIEventHandler<HTMLDivElement>
  onWheelCapture?: React.WheelEventHandler<HTMLDivElement>
  onTouchMoveCapture?: React.TouchEventHandler<HTMLDivElement>
  onMouseDownCapture?: React.MouseEventHandler<HTMLDivElement>
}

function AddSheet({ onClose, children, onScrollCapture, onWheelCapture, onTouchMoveCapture, onMouseDownCapture }: Props) {
  return (
    <div
      className="add_sheet_overlay"
      onClick={onClose}
      onScrollCapture={onScrollCapture}
      onWheelCapture={onWheelCapture}
      onTouchMoveCapture={onTouchMoveCapture}
      onMouseDownCapture={onMouseDownCapture}
    >
      <div className="add_sheet" onClick={(e) => e.stopPropagation()}>
        <div className="add_sheet_handle" />
        {children}
        <HomeIndicator />
      </div>
    </div>
  )
}

export default AddSheet
