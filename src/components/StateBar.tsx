import batteryIcon from '../svg/Battery.svg'
import cellularIcon from '../svg/Combined Shape.svg'
import wifiIcon from '../svg/Wi-Fi.svg'
import './StateBar.css'
import Time from './Time'

function StateBar() {
  return (
    <div className="state_bar" aria-label="status bar">
      <Time />
      <div className="state_bar_icons" aria-hidden="true">
        <img className="state_bar_cellular" src={cellularIcon} alt="" />
        <img className="state_bar_wifi" src={wifiIcon} alt="" />
        <img className="state_bar_battery" src={batteryIcon} alt="" />
      </div>
    </div>
  )
}

export default StateBar
