type HealthCheckItemProps = {
  icon: string
  label: string
  onClick?: () => void
}

function HealthCheckItem({ icon, label, onClick }: HealthCheckItemProps) {
  return (
    <li className="health_check_item">
      <button type="button" onClick={onClick}>
        <i className={icon}></i>
        <span>{label}</span>
      </button>
    </li>
  )
}

export default HealthCheckItem
