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
    disabled,
    ...rest
  } = props;
  const classNames = [
    className,
    disabled && buttonVariant !== 'icon' ? 'is_disabled' : null,
    buttonVariant === 'icon' ? 'button_icon' : null,
    buttonVariant === 'challenge' ? 'button_challenge' : null,
  ]
    .filter(Boolean)
    .join(' ')
  const needsSmallRadiusLabel = classNames.split(' ').includes('s_white_radius_btn')
  const content = needsSmallRadiusLabel ? (
    <span className="s_white_radius_btn_label">{children}</span>
  ) : (
    children
  )

  return (
    <button {...rest} disabled={disabled} className={classNames}>
      {icon && iconPosition === 'left' ? <span className="button_icon_asset" aria-hidden="true">{icon}</span> : null}
      {content}
      {icon && iconPosition === 'right' ? <span className="button_icon_asset" aria-hidden="true">{icon}</span> : null}
    </button>
  )
}
