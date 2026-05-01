import type { ReactNode } from 'react'
import './Title.css'

type TitleProps = {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5'
  title: ReactNode
  children?: ReactNode
}

function Title({ as: Heading = 'h1', title, children }: TitleProps) {
  return (
    <div className="title">
      <Heading>{title}</Heading>
      {children}
    </div>
  )
}

export default Title
