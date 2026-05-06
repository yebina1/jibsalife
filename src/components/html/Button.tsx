import './Button.css'

type Buttonprops = React.ComponentPropsWithRef<'button'> & {
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  buttonVariant?: 'default' | 'icon' | 'challenge'
}

export default function Button(props: Buttonprops){
  const {
    children,
    className,
    icon,
    iconPosition = 'left',
    buttonVariant = 'default',
    ...rest
  } = props;
  const classNames = [
    className,
    buttonVariant === 'icon' ? 'button_icon' : null,
    buttonVariant === 'challenge' ? 'button_challenge' : null,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button {...rest} className={classNames}>
      {icon && iconPosition === 'left' ? <span className="button_icon_asset" aria-hidden="true">{icon}</span> : null}
      <span className="button_label">{children}</span>
      {icon && iconPosition === 'right' ? <span className="button_icon_asset" aria-hidden="true">{icon}</span> : null}
    </button>
  )
}
