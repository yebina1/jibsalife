import { useEffect, useState, type ButtonHTMLAttributes } from 'react'
import FloatingButton from './FloatingButton'

type FloatingWriteButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>

function FloatingWriteButton({
  'aria-label': ariaLabel = '글쓰기',
  className,
  ...props
}: FloatingWriteButtonProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  useEffect(() => {
    let lastScrollY = window.scrollY
    const collapseTimer = window.setTimeout(() => {
      setIsExpanded(false)
    }, 3000)

    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY > lastScrollY) {
        setIsExpanded(false)
      }

      lastScrollY = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.clearTimeout(collapseTimer)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const resolvedClassName = ['floating_write_button', isExpanded ? 'is_expanded' : null, className]
    .filter(Boolean)
    .join(' ')

  return (
    <FloatingButton placement="community" aria-label={ariaLabel} className={resolvedClassName} {...props}>
      <span className="floating_button_icon_frame" aria-hidden="true">
        <i className="bx bx-edit-alt" />
      </span>
      <span className="floating_write_button_label">글쓰기</span>
    </FloatingButton>
  )
}

export default FloatingWriteButton
