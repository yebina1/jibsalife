import { useEffect, useState, type ButtonHTMLAttributes } from 'react'
import { useNavigate } from 'react-router'
import Button from './html/Button'
import FloatingButton from './FloatingButton'

type FloatingWriteButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'onClick'> & {
  showMenu?: boolean
  onClick?: React.MouseEventHandler<HTMLButtonElement>
}

function FloatingWriteButton({
  'aria-label': ariaLabel = '글쓰기',
  className,
  showMenu = false,
  onClick,
  ...props
}: FloatingWriteButtonProps) {
  const navigate = useNavigate()
  const [isExpanded, setIsExpanded] = useState(true)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    let lastScrollY = window.scrollY
    const collapseTimer = window.setTimeout(() => {
      setIsExpanded(false)
    }, 3000)

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY > lastScrollY) {
        setIsExpanded(false)
        if (showMenu) setIsMenuOpen(false)
      }
      lastScrollY = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.clearTimeout(collapseTimer)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [showMenu])

  const resolvedClassName = ['floating_write_button', isExpanded ? 'is_expanded' : null, className]
    .filter(Boolean)
    .join(' ')

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (showMenu) {
      setIsMenuOpen((prev) => !prev)
    } else {
      onClick?.(e)
    }
  }

  return (
    <>
      {showMenu && isMenuOpen && (
        <div className="floating_write_backdrop" onClick={() => setIsMenuOpen(false)} />
      )}
      {showMenu && (
        <div className={`floating_write_menu${isMenuOpen ? ' is_open' : ''}`}>
          <Button
            type="button"
            className="light_purple_radius_btn"
            onClick={() => { setIsMenuOpen(false); navigate('/community/vote/write') }}
          >
            투표 올리기
          </Button>
          <Button
            type="button"
            className="light_purple_radius_btn"
            onClick={() => { setIsMenuOpen(false); navigate('/community/petstory/write') }}
          >
            일상 공유하기
          </Button>
        </div>
      )}
      <FloatingButton
        placement="community"
        aria-label={ariaLabel}
        className={resolvedClassName}
        onClick={handleClick}
        {...props}
      >
        <span className="floating_button_icon_frame" aria-hidden="true">
          <i className="bx bx-edit-alt" />
        </span>
        <span className="floating_write_button_label">글쓰기</span>
      </FloatingButton>
    </>
  )
}

export default FloatingWriteButton
