import type { ReactNode } from 'react'
import './Header.css'

type HeaderProps = {
  title: string
  leftContent?: ReactNode
  rightContent?: ReactNode
}

function Header({ title, leftContent, rightContent }: HeaderProps) {
  return (
    <header className="header">
      <div className="header_left">
        {leftContent}
        <h1 className="header_title">{title}</h1>
      </div>

      {rightContent && <div className="header_right">{rightContent}</div>}
    </header>
  )
}

export default Header
