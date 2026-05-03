type HealthCheckItemProps = {
  icon: string
  label: string
  onClick?: () => void
}

function HealthCheckItem({ icon, label, onClick }: HealthCheckItemProps) {
  return (
    <li className="health_check_item">
      <button type="button" onClick={onClick}>
        <img src={icon} alt={`${label} 아이콘`} />
        <span>{label}</span>
      </button>
    </li>
  )
}

export default HealthCheckItem
