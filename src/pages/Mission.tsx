import './Mission.css'
import { useEffect, useMemo, useRef, useState } from 'react'
import PageHeader from '../components/PageHeader'
import BackButton from '../components/html/BackButton'
import NoticeText from '../components/NoticeText'
import DatePicker from '../components/html/DatePicker'

const weekLabels = ['일', '월', '화', '수', '목', '금', '토']
const CALENDAR_YEAR = 2026
const CALENDAR_MONTH = 5

type CalendarDay = {
  id: string
  label: string
  month: number
  year: number
  muted?: boolean
}

function createCalendarDays(year: number, month: number): CalendarDay[] {
  const firstDayIndex = new Date(year, month - 1, 1).getDay()
  const daysInMonth = new Date(year, month, 0).getDate()
  const daysInPrevMonth = new Date(year, month - 1, 0).getDate()
  const calendar: CalendarDay[] = []

  for (let index = firstDayIndex - 1; index >= 0; index -= 1) {
    const date = daysInPrevMonth - index
    calendar.push({
      id: `p-${date}`,
      label: String(date),
      month: month === 1 ? 12 : month - 1,
      year: month === 1 ? year - 1 : year,
      muted: true,
    })
  }

  for (let date = 1; date <= daysInMonth; date += 1) {
    calendar.push({
      id: `c-${date}`,
      label: String(date),
      month,
      year,
    })
  }

  let nextDate = 1
  while (calendar.length < 42) {
    calendar.push({
      id: `n-${nextDate}`,
      label: String(nextDate),
      month: month === 12 ? 1 : month + 1,
      year: month === 12 ? year + 1 : year,
      muted: true,
    })
    nextDate += 1
  }

  return calendar
}

const legends = ['식사', '배변', '활동', '증상']

const historyItems = [
  { id: 1, title: '식사 기록', detail: '사료 60g', time: '08:00' },
  { id: 2, title: '활동 기록', detail: '산책 30분', time: '19:20' },
  { id: 3, title: '증상 기록', detail: '헐떡', time: '18:10' },
]

function Mission() {
  const [calendarYear, setCalendarYear] = useState(CALENDAR_YEAR)
  const [calendarMonth, setCalendarMonth] = useState(CALENDAR_MONTH)
  const [selectedDayId, setSelectedDayId] = useState('c-20')
  const [monthSlideDirection, setMonthSlideDirection] = useState<'prev' | 'next'>('next')
  const [calendarView, setCalendarView] = useState<'월간' | '주간'>('월간')
  const [isViewSortOpen, setIsViewSortOpen] = useState(false)
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const calendarRef = useRef<HTMLElement>(null)
  const calendarDays = useMemo(
    () => createCalendarDays(calendarYear, calendarMonth),
    [calendarMonth, calendarYear]
  )

  useEffect(() => {
    const currentSelected = calendarDays.find((day) => day.id === selectedDayId)
    if (currentSelected) {
      return
    }

    const firstCurrentMonthDay = calendarDays.find((day) => !day.muted)
    if (firstCurrentMonthDay) {
      setSelectedDayId(firstCurrentMonthDay.id)
    }
  }, [calendarDays, selectedDayId])

  const selectedDay = useMemo(
    () => calendarDays.find((day) => day.id === selectedDayId) ?? calendarDays[24],
    [calendarDays, selectedDayId]
  )

  const selectedDate = new Date(selectedDay.year, selectedDay.month - 1, Number(selectedDay.label))
  const selectedDateLabel = `${selectedDay.year}년 ${selectedDay.month}월 ${selectedDay.label}일(${weekLabels[selectedDate.getDay()]})`
  const selectedDayIndex = calendarDays.findIndex((day) => day.id === selectedDayId)
  const selectedWeekStartIndex = Math.max(0, Math.floor(Math.max(selectedDayIndex, 0) / 7) * 7)
  const visibleCalendarDays =
    calendarView === '주간'
      ? calendarDays.slice(selectedWeekStartIndex, selectedWeekStartIndex + 7)
      : calendarDays

  const moveMonth = (direction: 'prev' | 'next') => {
    setMonthSlideDirection(direction)
    setCalendarMonth((prev) => {
      if (direction === 'prev') {
        if (prev === 1) { setCalendarYear((y) => y - 1); return 12 }
        return prev - 1
      }
      if (prev === 12) { setCalendarYear((y) => y + 1); return 1 }
      return prev + 1
    })
  }

  useEffect(() => {
    const el = calendarRef.current
    if (!el) return

    let startX = 0
    let startY = 0

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 5) setCalendarView('주간')
      else if (e.deltaY < -5) setCalendarView('월간')
    }

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX
      startY = e.touches[0].clientY
    }

    const handleTouchEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - startX
      const dy = e.changedTouches[0].clientY - startY
      const absDx = Math.abs(dx)
      const absDy = Math.abs(dy)

      if (absDx > absDy && absDx >= 40) {
        moveMonth(dx < 0 ? 'next' : 'prev')
      } else if (absDy > absDx && absDy >= 30) {
        if (dy > 0) setCalendarView('주간')
        else setCalendarView('월간')
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: true })
    el.addEventListener('touchstart', handleTouchStart, { passive: true })
    el.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      window.removeEventListener('wheel', handleWheel)
      el.removeEventListener('touchstart', handleTouchStart)
      el.removeEventListener('touchend', handleTouchEnd)
    }
  }, [moveMonth])

  return (
    <>
      <PageHeader
        title="건강 히스토리"
        leftContent={<BackButton />}
        rightContent={
          <div className={`mission_view_sort ${isViewSortOpen ? 'open' : ''}`}>
            <button
              type="button"
              className="mission_view_sort_toggle"
              onClick={() => setIsViewSortOpen((prev) => !prev)}
            >
              {calendarView}
            </button>
            {isViewSortOpen ? (
              <div className="mission_view_sort_menu">
                {(['월간', '주간'] as const).map((view) => (
                  <button
                    key={view}
                    type="button"
                    className={
                      view === calendarView
                        ? 'mission_view_sort_option active'
                        : 'mission_view_sort_option'
                    }
                    onClick={() => {
                      setCalendarView(view)
                      setIsViewSortOpen(false)
                    }}
                  >
                    {view}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        }
      />
      <main className="page mission_page">
        <section className="mission_calendar_section" ref={calendarRef}>
        <div className="mission_month_bar">
          <button type="button" aria-label="메뉴">
            <i className="bx bx-menu" />
          </button>
          <strong>{calendarYear}.{String(calendarMonth).padStart(2, '0')}</strong>
          <button
            type="button"
            aria-label="날짜 선택"
            onClick={() => setIsDatePickerOpen(true)}
          >
            <i className={`bx bx-chevron-${calendarView === '주간' ? 'down' : 'up'}`} />
          </button>
        </div>

        <div className="mission_weekdays" aria-hidden="true">
          {weekLabels.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>

        <div className="mission_calendar_viewport">
        <div
          key={`${calendarYear}-${calendarMonth}`}
          className={`mission_calendar_grid slide_${monthSlideDirection}`}
          aria-label={`${calendarYear}년 ${calendarMonth}월 달력`}
        >
          {visibleCalendarDays.map((day) => (
            <button
              key={day.id}
              type="button"
              className={`mission_day ${day.muted ? 'muted' : ''} ${
                day.id === selectedDayId ? 'selected' : ''
              }`}
              aria-pressed={day.id === selectedDayId}
              onClick={() => setSelectedDayId(day.id)}
            >
              {day.label}
            </button>
          ))}
        </div>
        </div>

        <div className="mission_calendar_dock">
          <span />
        </div>

        <div className="mission_legends" aria-label="기록 범례">
          {legends.map((label) => (
            <span key={label}>
              <i aria-hidden="true" />
              {label}
            </span>
          ))}
        </div>
      </section>

      <section className="mission_history_section">
        <h2>{selectedDateLabel}</h2>
        <div className="mission_history_list">
          {historyItems.map((item) => (
            <article key={item.id} className="mission_history_item">
              <span className="mission_history_thumb" aria-hidden="true" />
              <div className="mission_history_body">
                <strong>{item.title}</strong>
                <p>{item.detail}</p>
              </div>
              <time>{item.time}</time>
            </article>
          ))}
        </div>
      </section>

        <NoticeText>
          <p>
            ※ 이 결과는 참고용이며, 정확한 진단은
            <br />
            수의사 상담을 통해 확인해 주세요.
          </p>
        </NoticeText>

        <button type="button" className="mission_fab" aria-label="글쓰기">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </main>

      {isDatePickerOpen && (
        <DatePicker
          year={calendarYear}
          month={calendarMonth}
          day={Number(selectedDay.label)}
          onConfirm={(y, m, d) => {
            setCalendarYear(y)
            setCalendarMonth(m)
            setSelectedDayId(`c-${d}`)
            setIsDatePickerOpen(false)
          }}
          onCancel={() => setIsDatePickerOpen(false)}
        />
      )}
    </>
  )
}

export default Mission
