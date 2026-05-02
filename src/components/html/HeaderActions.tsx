import Button from './Button'

export type HeaderActionItem = {
  label: string
  icon?: string
  iconAlt?: string
  className?: string
  onClick?: () => void
}

type HeaderActionsProps = {
  actions: HeaderActionItem[]
}

function HeaderActions({ actions }: HeaderActionsProps) {
  return (
    <>
      {actions.map((action) => (
        <Button
          key={action.label}
          type="button"
          aria-label={action.label}
          className={action.className}
          onClick={action.onClick}
        >
          {action.icon ? <img src={action.icon} alt={action.iconAlt ?? action.label} /> : action.label}
        </Button>
      ))}
    </>
  )
}

export default HeaderActions
