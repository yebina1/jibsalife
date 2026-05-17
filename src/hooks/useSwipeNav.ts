import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'

export function useSwipeNav(leftSwipe?: string, rightSwipe?: string) {
  const navigate = useNavigate()
  const startX = useRef<number | null>(null)
  const startY = useRef<number | null>(null)

  useEffect(() => {
    if (!leftSwipe && !rightSwipe) return

    const onStart = (e: TouchEvent) => {
      startX.current = e.touches[0].clientX
      startY.current = e.touches[0].clientY
    }

    const onEnd = (e: TouchEvent) => {
      if (startX.current === null || startY.current === null) return
      const dx = e.changedTouches[0].clientX - startX.current
      const dy = e.changedTouches[0].clientY - startY.current
      startX.current = null
      startY.current = null

      if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy)) return

      if (dx < 0 && leftSwipe) navigate(leftSwipe)
      else if (dx > 0 && rightSwipe) navigate(rightSwipe)
    }

    document.addEventListener('touchstart', onStart, { passive: true })
    document.addEventListener('touchend', onEnd, { passive: true })
    return () => {
      document.removeEventListener('touchstart', onStart)
      document.removeEventListener('touchend', onEnd)
    }
  }, [navigate, leftSwipe, rightSwipe])
}
