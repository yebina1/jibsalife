import type { ReactNode } from 'react'
import { useNavigate } from 'react-router'
import './Header.css'

export type HeaderProps = {
  title: string
  leftContent?: ReactNode
  rightContent?: ReactNode
}

function Header({ title, leftContent, rightContent }: HeaderProps) {
  const navigate = useNavigate()
  const isHomeTitle = title === '집사인생'

  return (
    <header className="header">
      <div className="header_left">
        {leftContent}
        {isHomeTitle ? (
          <button type="button" className="header_title header_title_button" onClick={() => navigate('/home')}>
            {title}
          </button>
        ) : (
          <h1 className="header_title">{title}</h1>
        )}
      </div>

      {rightContent && <div className="header_right">{rightContent}</div>}
    </header>
  )
}

export default Header
