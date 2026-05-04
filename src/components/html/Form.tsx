import type { ReactNode } from 'react'
import Input from './Input'
import './Form.css'

type FormProps = {
  value: string
  placeholder: string
  inputAriaLabel: string
  className?: string
  submitLabel?: string
  onChange: (value: string) => void
  onSubmit?: () => void
  icon?: ReactNode
}

function Form({
  value,
  placeholder,
  inputAriaLabel,
  className,
  submitLabel,
  onChange,
  onSubmit,
  icon,
}: FormProps) {
  return (
    <form className={className} onSubmit={(event) => { event.preventDefault(); onSubmit?.() }}>
      <Input
        ariaLabel={inputAriaLabel}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      {icon && (
        <button type="submit" aria-label={submitLabel}>
          {icon}
        </button>
      )}
    </form>
  )
}

export default Form
