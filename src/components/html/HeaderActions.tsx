import Button from './Button'

export type HeaderActionItem = {
  label: string
  icon: string
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
          <img src={action.icon} alt="" />
        </Button>
      ))}
    </>
  )
}

export default HeaderActions
