type InputProps = {
  value: string
  placeholder?: string
  ariaLabel?: string
  type?: 'text' | 'password' | 'email' | 'number'
  onChange: (value: string) => void
}

function Input({ value, placeholder, ariaLabel, type = 'text', onChange }: InputProps) {
  return (
    <input
      aria-label={ariaLabel}
      placeholder={placeholder}
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  )
}

export default Input
