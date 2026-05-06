type InputProps = {
  value: string
  placeholder?: string
  ariaLabel?: string
  type?: 'text' | 'password' | 'email' | 'number'
  onChange: (value: string) => void
  onFocus?: () => void
  onBlur?: () => void
}

function Input({ value, placeholder, ariaLabel, type = 'text', onChange, onFocus, onBlur }: InputProps) {
  return (
    <input
      aria-label={ariaLabel}
      placeholder={placeholder}
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  )
}

export default Input
