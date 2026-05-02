import type { ReactNode } from 'react'
import './SectionHeader.css'
import Button from './html/Button'

type SectionHeaderProps = {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5'
  title: string
  actionText?: string
  actionIcon?: ReactNode
  onActionClick?: () => void
}

function SectionHeader({
  as: Heading = 'h2',
  title,
  actionText,
  actionIcon,
  onActionClick,
}: SectionHeaderProps) {
  return (
    <div className="section_header">
      <Heading>{title}</Heading>
      {actionText && (
        <Button type="button" onClick={onActionClick}>
          {actionText}
          {actionIcon}
        </Button>
      )}
    </div>
  )
}

export default SectionHeader
