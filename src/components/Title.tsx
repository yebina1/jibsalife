import type { ReactNode } from 'react'
import './Title.css'

type TitleProps = {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5'
  title: ReactNode
  beforeTitle?: ReactNode
  children?: ReactNode
  className?: string
}

function Title({ as: Heading = 'h1', title, beforeTitle, children, className }: TitleProps) {
  return (
    <div className={className ? `title ${className}` : 'title'}>
      {beforeTitle}
      <Heading>{title}</Heading>
      {children}
    </div>
  )
}

export default Title
