import HealthCheckItem from './HealthCheckItem'

export type HealthCheckOption = {
  id: string
  icon: string
  label: string
  onClick?: () => void
}

type HealthCheckProps = {
  options: HealthCheckOption[]
}

function HealthCheck({ options }: HealthCheckProps) {
  return (
    <ul className="health_check">
      {options.map((option) => (
        <HealthCheckItem
          key={option.id}
          icon={option.icon}
          label={option.label}
          onClick={option.onClick}
        />
      ))}
    </ul>
  )
}

export default HealthCheck
