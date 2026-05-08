import type { ReactNode } from 'react'
import Title from './Title'
import './AppSection.css'

type AppSectionProps = {
  title: ReactNode
  subtitle?: ReactNode
  meta?: ReactNode
  footer?: ReactNode
  children?: ReactNode
  className?: string
}

function AppSection({
  title,
  subtitle,
  meta,
  footer,
  children,
  className,
}: AppSectionProps) {
  const sectionClassName = className ? `app_section ${className}` : 'app_section'

  return (
    <section className={sectionClassName}>
      <div className="app_section_header">
        <Title as="h4" className="app_section_title" title={title}>
          {subtitle ? <p>{subtitle}</p> : null}
        </Title>
        {meta ? (
          <p className="caption_medium app_section_meta">{meta}</p>
        ) : null}
      </div>
      <div className="app_section_content">
        {children}
        {footer ? <div className="app_section_footer">{footer}</div> : null}
      </div>
    </section>
  )
}

export default AppSection
