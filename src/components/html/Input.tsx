type InputProps = {
  value: string
  placeholder?: string
  ariaLabel?: string
  onChange: (value: string) => void
}

function Input({ value, placeholder, ariaLabel, onChange }: InputProps) {
  return (
    <input
      aria-label={ariaLabel}
      placeholder={placeholder}
      type="text"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  )
}

export default Input
