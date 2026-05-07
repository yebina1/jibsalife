import './Mission.css'
import { useEffect, useMemo, useRef, useState } from 'react'
import PageHeader from '../components/PageHeader'
import ChevronIcon from '../components/ChevronIcon'
import FloatingWriteButton from '../components/FloatingWriteButton'
import BackButton from '../components/html/BackButton'
import DatePicker from '../components/html/DatePicker'
import Button from '../components/html/Button'
import AddSheet from '../components/AddSheet'
import {
  MISSION_ACTIVITY_RECORDS_CHANGE_EVENT,
  readMissionActivityRecords,
} from '../utils/missionActivityRecords'

const weekLabels = ['일', '월', '화', '수', '목', '금', '토']
const today = new Date()
const CALENDAR_YEAR = today.getFullYear()
const CALENDAR_MONTH = today.getMonth() + 1
const CALENDAR_DAY = today.getDate()

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

function getDateKey(year: number, month: number, day: number) {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

const initialHistoryItems = [
  { id: 101, title: '식사 기록', detail: '간식 2개', time: '10:30', color: '#ffd1a8', date: '2026-05-01' },
  { id: 102, title: '활동 기록', detail: '산책 20분', time: '18:40', color: '#428fe6', date: '2026-05-02' },
  { id: 106, title: '식사 기록', detail: '사료 55g', time: '08:20', color: '#ffd1a8', date: '2026-05-02' },
  { id: 103, title: '배변 기록', detail: '배변 실수', time: '09:15', color: '#527ca3', date: '2026-05-03' },
  { id: 107, title: '증상 기록', detail: '재채기', time: '14:10', color: '#b9dfe3', date: '2026-05-03' },
  { id: 104, title: '증상 기록', detail: '가려움', time: '21:05', color: '#b9dfe3', date: '2026-05-04' },
  { id: 105, title: '식사 기록', detail: '밥 80g', time: '07:50', color: '#ffd1a8', date: '2026-05-05' },
  { id: 1, title: '식사 기록', detail: '사료 60g', time: '08:00', color: '#ffd1a8', date: '2026-05-06' },
  { id: 2, title: '활동 기록', detail: '산책 30분', time: '19:20', color: '#428fe6', date: '2026-05-06' },
  { id: 3, title: '증상 기록', detail: '헐떡', time: '18:10', color: '#b9dfe3', date: '2026-05-06' },
]

type CategoryOption = {
  id: string
  label: string
  color: string
}

const initialCategoryOptions: CategoryOption[] = [
  { id: 'meal', label: '식사 기록', color: '#ffd1a8' },
  { id: 'poop', label: '배변 기록', color: '#527ca3' },
  { id: 'activity', label: '활동 기록', color: '#428fe6' },
  { id: 'symptom', label: '증상', color: '#b9dfe3' },
]

const categoryColorOptions = [
  '#16233d',
  '#527ca3',
  '#428fe6',
  '#b9dfe3',
  '#6d9460',
  '#f4ddb2',
  '#ffa51e',
  '#d43c48',
]

function Mission() {
  const [calendarYear, setCalendarYear] = useState(CALENDAR_YEAR)
  const [calendarMonth, setCalendarMonth] = useState(CALENDAR_MONTH)
  const [selectedDayId, setSelectedDayId] = useState(`c-${CALENDAR_DAY}`)
  const [monthSlideDirection, setMonthSlideDirection] = useState<'prev' | 'next'>('next')
  const [calendarView, setCalendarView] = useState<'월간' | '주간'>('월간')
  const [isViewSortOpen, setIsViewSortOpen] = useState(false)
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const [pickerTop, setPickerTop] = useState(0)
  const [isFabOpen, setIsFabOpen] = useState(false)
  const [isCategoryPickerOpen, setIsCategoryPickerOpen] = useState(false)
  const [isCategoryAddOpen, setIsCategoryAddOpen] = useState(false)
  const [isCategoryEditOpen, setIsCategoryEditOpen] = useState(false)
  const [isPeriodPickerOpen, setIsPeriodPickerOpen] = useState(false)
  const [isPeriodDatePickerOpen, setIsPeriodDatePickerOpen] = useState(false)
  const [addTitle, setAddTitle] = useState('')
  const [editingHistoryId, setEditingHistoryId] = useState<number | null>(null)
  const [historyItems, setHistoryItems] = useState(() => [
    ...readMissionActivityRecords(),
    ...initialHistoryItems,
  ])
  const [categories, setCategories] = useState<CategoryOption[]>(initialCategoryOptions)
  const [selectedCategoryId, setSelectedCategoryId] = useState(initialCategoryOptions[0].id)
  const [draftCategoryId, setDraftCategoryId] = useState(initialCategoryOptions[0].id)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newCategoryColor, setNewCategoryColor] = useState('')
  const [editCategoryName, setEditCategoryName] = useState('')
  const [editCategoryColor, setEditCategoryColor] = useState('')
  const [addDate, setAddDate] = useState({
    year: CALENDAR_YEAR,
    month: CALENDAR_MONTH,
    day: CALENDAR_DAY,
  })
  const [draftAddDate, setDraftAddDate] = useState(addDate)
  const calendarRef = useRef<HTMLElement>(null)
  const dockRef = useRef<HTMLDivElement>(null)
  const monthBarRef = useRef<HTMLDivElement>(null)
  const weekdaysRef = useRef<HTMLDivElement>(null)
  const calendarViewRef = useRef(calendarView)
  useEffect(() => { calendarViewRef.current = calendarView }, [calendarView])
  const calendarDays = useMemo(
    () => createCalendarDays(calendarYear, calendarMonth),
    [calendarMonth, calendarYear]
  )
  const recordedDateKeys = useMemo(
    () => new Set(historyItems.map((item) => item.date).filter(Boolean)),
    [historyItems]
  )
  const recordedDateColors = useMemo(() => {
    const colorsByDate = new Map<string, string[]>()

    historyItems.forEach((item) => {
      if (!item.date) return

      const colors = colorsByDate.get(item.date) ?? []
      if (!colors.includes(item.color)) {
        colorsByDate.set(item.date, [...colors, item.color])
      }
    })

    return colorsByDate
  }, [historyItems])

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

  useEffect(() => {
    const syncMissionActivityRecords = () => {
      setHistoryItems([
        ...readMissionActivityRecords(),
        ...initialHistoryItems,
      ])
    }

    window.addEventListener(MISSION_ACTIVITY_RECORDS_CHANGE_EVENT, syncMissionActivityRecords)
    window.addEventListener('storage', syncMissionActivityRecords)

    return () => {
      window.removeEventListener(MISSION_ACTIVITY_RECORDS_CHANGE_EVENT, syncMissionActivityRecords)
      window.removeEventListener('storage', syncMissionActivityRecords)
    }
  }, [])

  const selectedDay = useMemo(
    () => calendarDays.find((day) => day.id === selectedDayId) ?? calendarDays[24],
    [calendarDays, selectedDayId]
  )

  const selectedDate = new Date(selectedDay.year, selectedDay.month - 1, Number(selectedDay.label))
  const selectedDateKey = getDateKey(selectedDay.year, selectedDay.month, Number(selectedDay.label))
  const selectedDateLabel = `${selectedDay.year}년 ${selectedDay.month}월 ${selectedDay.label}일(${weekLabels[selectedDate.getDay()]})`
  const selectedHistoryItems = useMemo(
    () => historyItems.filter((item) => item.date === selectedDateKey),
    [historyItems, selectedDateKey]
  )
  const usedCategoryColors = useMemo(
    () => new Set(categories.map((category) => category.color.toLowerCase())),
    [categories]
  )
  const firstAvailableCategoryColor = categoryColorOptions.find(
    (color) => !usedCategoryColors.has(color.toLowerCase())
  ) ?? ''
  const selectedCategory =
    categories.find((category) => category.id === selectedCategoryId) ?? categories[0]
  const draftCategory =
    categories.find((category) => category.id === draftCategoryId) ?? selectedCategory
  const getHistoryColor = (title: string, color?: string) => {
    if (color) return color

    return (
      categories.find((category) => title.includes(category.label) || category.label.includes(title.replace(/\s*기록$/, '')))?.color ??
      '#A08DFF'
    )
  }
  const canSaveMission = addTitle.trim().length > 0
  const isEditingHistory = editingHistoryId !== null
  const canAddCategory =
    newCategoryName.trim().length > 0 &&
    newCategoryColor !== '' &&
    !usedCategoryColors.has(newCategoryColor.toLowerCase())
  const canEditCategory =
    editCategoryName.trim().length > 0 &&
    editCategoryColor !== '' &&
    !categories.some(
      (category) =>
        category.id !== draftCategoryId &&
        category.color.toLowerCase() === editCategoryColor.toLowerCase()
    )
  const selectedDayIndex = calendarDays.findIndex((day) => day.id === selectedDayId)
  const selectedWeekStartIndex = Math.max(0, Math.floor(Math.max(selectedDayIndex, 0) / 7) * 7)
  const visibleCalendarDays =
    calendarView === '주간'
      ? calendarDays.slice(selectedWeekStartIndex, selectedWeekStartIndex + 7)
      : calendarDays
  const addCalendarDays = useMemo(
    () => createCalendarDays(draftAddDate.year, draftAddDate.month),
    [draftAddDate.month, draftAddDate.year]
  )
  const openDatePicker = () => {
    if (isDatePickerOpen) {
      setIsDatePickerOpen(false)
      return
    }
    const rect = weekdaysRef.current?.getBoundingClientRect()
    setPickerTop(rect ? rect.top : 0)
    setIsDatePickerOpen(true)
  }

  const togglePeriodDatePicker = () => {
    setIsPeriodDatePickerOpen((prev) => !prev)
  }

  const closeMissionSheet = () => {
    setIsFabOpen(false)
    setIsCategoryPickerOpen(false)
    setIsCategoryAddOpen(false)
    setIsCategoryEditOpen(false)
    setIsPeriodPickerOpen(false)
    setIsPeriodDatePickerOpen(false)
    setAddTitle('')
    setEditingHistoryId(null)
  }

  useEffect(() => {
    if (!isDatePickerOpen && !isPeriodDatePickerOpen) return

    const closePickerOnPageMove = (event: Event) => {
      const target = event.target
      if (target instanceof HTMLElement && target.closest('.date_picker')) return

      setIsDatePickerOpen(false)
      setIsPeriodDatePickerOpen(false)
    }

    window.addEventListener('scroll', closePickerOnPageMove, true)
    window.addEventListener('wheel', closePickerOnPageMove, true)
    window.addEventListener('touchmove', closePickerOnPageMove, true)
    document.addEventListener('mousedown', closePickerOnPageMove, true)

    return () => {
      window.removeEventListener('scroll', closePickerOnPageMove, true)
      window.removeEventListener('wheel', closePickerOnPageMove, true)
      window.removeEventListener('touchmove', closePickerOnPageMove, true)
      document.removeEventListener('mousedown', closePickerOnPageMove, true)
    }
  }, [isDatePickerOpen, isPeriodDatePickerOpen])

  const saveMission = () => {
    const title = addTitle.trim()
    if (!title) return

    const now = new Date()
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    const recordTitle = selectedCategory.label === '증상' ? '증상 기록' : selectedCategory.label
    const recordDate = getDateKey(addDate.year, addDate.month, addDate.day)

    if (editingHistoryId !== null) {
      setHistoryItems((prev) =>
        prev.map((item) =>
          item.id === editingHistoryId
            ? {
                ...item,
                title: recordTitle,
                detail: title,
                color: selectedCategory.color,
                date: recordDate,
              }
            : item
        )
      )
      closeMissionSheet()
      return
    }

    setHistoryItems((prev) => [
      {
        id: Date.now(),
        title: recordTitle,
        detail: title,
        time,
        color: selectedCategory.color,
        date: recordDate,
      },
      ...prev,
    ])
    closeMissionSheet()
  }

  const openHistoryEdit = (item: typeof initialHistoryItems[number]) => {
    const [year, month, day] = item.date.split('-').map(Number)
    const nextDate = {
      year: Number.isFinite(year) ? year : selectedDay.year,
      month: Number.isFinite(month) ? month : selectedDay.month,
      day: Number.isFinite(day) ? day : Number(selectedDay.label),
    }
    const nextCategory =
      categories.find((category) => (
        item.title.includes(category.label) ||
        category.label.includes(item.title.replace(/\s*기록$/, '')) ||
        category.color.toLowerCase() === item.color.toLowerCase()
      )) ?? selectedCategory

    setEditingHistoryId(item.id)
    setAddTitle(item.detail)
    setSelectedCategoryId(nextCategory.id)
    setDraftCategoryId(nextCategory.id)
    setAddDate(nextDate)
    setDraftAddDate(nextDate)
    setIsCategoryPickerOpen(false)
    setIsCategoryAddOpen(false)
    setIsCategoryEditOpen(false)
    setIsPeriodPickerOpen(false)
    setIsPeriodDatePickerOpen(false)
    setIsFabOpen(true)
  }

  const openCategoryEdit = () => {
    const category = categories.find((item) => item.id === draftCategoryId) ?? selectedCategory
    setEditCategoryName(category.label)
    setEditCategoryColor(category.color)
    setIsCategoryEditOpen(true)
  }

  const saveCategoryEdit = () => {
    if (!canEditCategory) return

    setCategories((prev) =>
      prev.map((category) =>
        category.id === draftCategoryId
          ? { ...category, label: editCategoryName.trim(), color: editCategoryColor }
          : category
      )
    )
    setIsCategoryEditOpen(false)
    setEditCategoryName('')
    setEditCategoryColor('')
  }

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
    const section = calendarRef.current
    const dock = dockRef.current
    if (!section || !dock) return

    let startX = 0
    let startY = 0

    const handleSectionTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX
      startY = e.touches[0].clientY
    }

    const handleSectionTouchEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - startX
      const dy = e.changedTouches[0].clientY - startY
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) >= 40) {
        moveMonth(dx < 0 ? 'next' : 'prev')
      }
    }

    const handleDockTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX
      startY = e.touches[0].clientY
    }

    const handleDockTouchMove = (e: TouchEvent) => {
      e.preventDefault()
    }

    const handleDockTouchEnd = (e: TouchEvent) => {
      const dy = e.changedTouches[0].clientY - startY
      const absDy = Math.abs(dy)
      if (absDy >= 30) {
        if (dy < 0 && calendarViewRef.current === '월간') setCalendarView('주간')
        else if (dy > 0 && calendarViewRef.current === '주간') setCalendarView('월간')
      }
    }

    section.addEventListener('touchstart', handleSectionTouchStart, { passive: true })
    section.addEventListener('touchend', handleSectionTouchEnd, { passive: true })
    dock.addEventListener('touchstart', handleDockTouchStart, { passive: true })
    dock.addEventListener('touchmove', handleDockTouchMove, { passive: false })
    dock.addEventListener('touchend', handleDockTouchEnd, { passive: true })

    return () => {
      section.removeEventListener('touchstart', handleSectionTouchStart)
      section.removeEventListener('touchend', handleSectionTouchEnd)
      dock.removeEventListener('touchstart', handleDockTouchStart)
      dock.removeEventListener('touchmove', handleDockTouchMove)
      dock.removeEventListener('touchend', handleDockTouchEnd)
    }
  }, [moveMonth])

  return (
    <>
      <PageHeader
        title="건강 히스토리"
        leftContent={<BackButton />}
      />
      <main className="page mission_page">
        <section className="mission_calendar_section" ref={calendarRef}>
        <div className="mission_month_bar" ref={monthBarRef}>
          <div className="mission_month_bar_left">
            <button type="button" className="mission_month_bar_date" onClick={openDatePicker}>
              {calendarYear}.{String(calendarMonth).padStart(2, '0')}.{String(Number(selectedDay.label)).padStart(2, '0')}
              <i className={`bx bx-chevron-${isDatePickerOpen ? 'up' : 'down'}`} />
            </button>
          </div>
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
                    className={view === calendarView ? 'mission_view_sort_option active' : 'mission_view_sort_option'}
                    onClick={() => { setCalendarView(view); setIsViewSortOpen(false) }}
                  >
                    {view}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <div className="mission_weekdays" ref={weekdaysRef} aria-hidden="true">
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
            (() => {
              const dayDateKey = getDateKey(day.year, day.month, Number(day.label))
              const dayRecordColors = recordedDateColors.get(dayDateKey) ?? []

              return (
                <button
                  key={day.id}
                  type="button"
                  className={`mission_day ${day.muted ? 'muted' : ''} ${
                    day.id === selectedDayId ? 'selected' : ''
                  } ${recordedDateKeys.has(dayDateKey) ? 'has_record' : ''}`}
                  aria-pressed={day.id === selectedDayId}
                  onClick={() => setSelectedDayId(day.id)}
                >
                  <span>{day.label}</span>
                  {dayRecordColors.length > 0 && (
                    <span className="mission_day_record_dots" aria-hidden="true">
                      {dayRecordColors.slice(0, 3).map((color) => (
                        <span
                          key={color}
                          className="mission_day_record_dot"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </span>
                  )}
                </button>
              )
            })()
          ))}
        </div>
        </div>

        <div className="mission_calendar_dock" ref={dockRef}>
          <span />
        </div>

      </section>

      <section className="mission_history_section">
        <h2>{selectedDateLabel}</h2>
        <div className="mission_history_list">
          {selectedHistoryItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className="mission_history_item"
              onClick={() => openHistoryEdit(item)}
            >
              <span
                className="mission_history_thumb"
                style={{ backgroundColor: getHistoryColor(item.title, item.color) }}
                aria-hidden="true"
              />
              <div className="mission_history_body">
                <strong>{item.title}</strong>
                <p>{item.detail}</p>
              </div>
              <time>{item.time}</time>
            </button>
          ))}
        </div>
      </section>

        <FloatingWriteButton onClick={() => setIsFabOpen(true)} />
      </main>

      {isDatePickerOpen && (
        <DatePicker
          year={calendarYear}
          month={calendarMonth}
          day={Number(selectedDay.label)}
          dropdownTop={pickerTop}
          onConfirm={(y, m, d) => {
            setCalendarYear(y)
            setCalendarMonth(m)
            setSelectedDayId(`c-${d}`)
            setIsDatePickerOpen(false)
          }}
          onCancel={() => setIsDatePickerOpen(false)}
        />
      )}

      {isFabOpen && (
        <AddSheet
          onClose={closeMissionSheet}
          onScrollCapture={(event) => {
            if (!isPeriodDatePickerOpen) return
            if ((event.target as HTMLElement).closest('.date_picker_column')) return
            setIsPeriodDatePickerOpen(false)
          }}
          onWheelCapture={(event) => {
            if (!isPeriodDatePickerOpen) return
            if ((event.target as HTMLElement).closest('.date_picker_column')) return
            setIsPeriodDatePickerOpen(false)
          }}
          onTouchMoveCapture={(event) => {
            if (!isPeriodDatePickerOpen) return
            if ((event.target as HTMLElement).closest('.date_picker_column')) return
            setIsPeriodDatePickerOpen(false)
          }}
          onMouseDownCapture={(event) => {
            if (!isPeriodDatePickerOpen) return
            if ((event.target as HTMLElement).closest('.date_picker')) return
            setIsPeriodDatePickerOpen(false)
          }}
        >
            {isPeriodPickerOpen ? (
              <div className="mission_period_picker">
                <div className="mission_period_tabs" role="tablist" aria-label="기간 선택 방식">
                  <button type="button" className="active">일반</button>
                  <button type="button">기간</button>
                  <button type="button">반복</button>
                </div>
                <div className="mission_period_month">
                  <button
                    type="button"
                    className="mission_month_bar_date mission_period_month_title"
                    onClick={togglePeriodDatePicker}
                  >
                    {draftAddDate.year}.{String(draftAddDate.month).padStart(2, '0')}.{String(draftAddDate.day).padStart(2, '0')}
                    <i className={`bx bx-chevron-${isPeriodDatePickerOpen ? 'up' : 'down'}`} />
                  </button>
                  {isPeriodDatePickerOpen && (
                    <div className="mission_period_date_dropdown">
                      <DatePicker
                        year={draftAddDate.year}
                        month={draftAddDate.month}
                        day={draftAddDate.day}
                        inline
                        flat
                        onConfirm={(year, month, day) => {
                          setDraftAddDate({ year, month, day })
                          setIsPeriodDatePickerOpen(false)
                        }}
                        onCancel={() => setIsPeriodDatePickerOpen(false)}
                      />
                    </div>
                  )}
                </div>
                <div className={isPeriodDatePickerOpen ? 'mission_period_dimmed' : ''}>
                  <button
                    type="button"
                    className="mission_period_dim_close"
                    aria-label="날짜 선택 닫기"
                    onClick={() => setIsPeriodDatePickerOpen(false)}
                  />
                  <div className="mission_period_weekdays" aria-hidden="true">
                    {weekLabels.map((label) => (
                      <span key={label}>{label}</span>
                    ))}
                  </div>
                  <div className="mission_period_grid">
                    {addCalendarDays.map((day) => {
                      const dateNumber = Number(day.label)
                      const isSelected =
                        day.year === draftAddDate.year &&
                        day.month === draftAddDate.month &&
                        dateNumber === draftAddDate.day

                      return (
                        <button
                          key={`${day.year}-${day.month}-${day.id}`}
                          type="button"
                          className={`mission_period_day${day.muted ? ' muted' : ''}${isSelected ? ' selected' : ''}`}
                          onClick={() => setDraftAddDate({
                            year: day.year,
                            month: day.month,
                            day: dateNumber,
                          })}
                        >
                          {day.label}
                        </button>
                      )
                    })}
                  </div>
                  <div className="mission_category_actions mission_period_actions">
                    <button
                      type="button"
                      className="mission_category_prev white_btn"
                      onClick={() => {
                        setDraftAddDate(addDate)
                        setIsPeriodPickerOpen(false)
                        setIsPeriodDatePickerOpen(false)
                      }}
                    >
                      이전
                    </button>
                    <button
                      type="button"
                      className="mission_category_confirm"
                      onClick={() => {
                        setAddDate(draftAddDate)
                        setIsPeriodPickerOpen(false)
                        setIsPeriodDatePickerOpen(false)
                      }}
                    >
                      확인
                    </button>
                  </div>
                </div>
              </div>
            ) : isCategoryEditOpen ? (
              <div className="mission_category_add">
                <h2>카테고리 수정</h2>
                <input
                  type="text"
                  value={editCategoryName}
                  onChange={(e) => setEditCategoryName(e.target.value)}
                  placeholder="카테고리를 입력하세요."
                  maxLength={12}
                  autoFocus
                />
                <div className="mission_category_color_grid">
                  {categoryColorOptions.map((color) => {
                    const isUsed = categories.some(
                      (category) =>
                        category.id !== draftCategoryId &&
                        category.color.toLowerCase() === color.toLowerCase()
                    )
                    const isSelected = color === editCategoryColor

                    return (
                      <button
                        key={color}
                        type="button"
                        className={
                          isUsed
                            ? 'mission_category_color used'
                            : isSelected
                              ? 'mission_category_color selected'
                              : 'mission_category_color'
                        }
                        style={{ backgroundColor: color }}
                        disabled={isUsed}
                        aria-label={`${color} 색상`}
                        onClick={() => setEditCategoryColor(color)}
                      >
                        {(isUsed || isSelected) && <i className="bx bx-check" aria-hidden="true" />}
                      </button>
                    )
                  })}
                </div>
                <div className="mission_category_actions">
                  <button
                    type="button"
                    className="mission_category_prev white_btn"
                    onClick={() => {
                      setIsCategoryEditOpen(false)
                      setEditCategoryName('')
                      setEditCategoryColor('')
                    }}
                  >
                    이전
                  </button>
                  <button
                    type="button"
                    className="mission_category_confirm"
                    disabled={!canEditCategory}
                    onClick={saveCategoryEdit}
                  >
                    확인
                  </button>
                </div>
              </div>
            ) : isCategoryAddOpen ? (
              <div className="mission_category_add">
                <h2>카테고리 추가</h2>
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="카테고리를 입력하세요."
                  maxLength={12}
                  autoFocus
                />
                <div className="mission_category_color_grid">
                  {categoryColorOptions.map((color) => {
                    const isUsed = usedCategoryColors.has(color.toLowerCase())
                    const isSelected = color === newCategoryColor

                    return (
                      <button
                        key={color}
                        type="button"
                        className={
                          isUsed
                            ? 'mission_category_color used'
                            : isSelected
                              ? 'mission_category_color selected'
                              : 'mission_category_color'
                        }
                        style={{ backgroundColor: color }}
                        disabled={isUsed}
                        aria-label={`${color} 색상`}
                        onClick={() => setNewCategoryColor(color)}
                      >
                        {(isUsed || isSelected) && <i className="bx bx-check" aria-hidden="true" />}
                      </button>
                    )
                  })}
                </div>
                <div className="mission_category_actions">
                  <button
                    type="button"
                    className="mission_category_prev white_btn"
                    onClick={() => {
                      setIsCategoryAddOpen(false)
                      setNewCategoryName('')
                      setNewCategoryColor('')
                    }}
                  >
                    이전
                  </button>
                  <button
                    type="button"
                    className="mission_category_confirm"
                    disabled={!canAddCategory}
                    onClick={() => {
                      if (!canAddCategory) return
                      const category = {
                        id: `custom-${Date.now()}`,
                        label: newCategoryName.trim(),
                        color: newCategoryColor,
                      }
                      setCategories((prev) => [...prev, category])
                      setSelectedCategoryId(category.id)
                      setDraftCategoryId(category.id)
                      setNewCategoryName('')
                      setNewCategoryColor('')
                      setIsCategoryAddOpen(false)
                      setIsCategoryPickerOpen(false)
                    }}
                  >
                    확인
                  </button>
                </div>
              </div>
            ) : isCategoryPickerOpen ? (
              <div className="mission_category_picker">
                <div className="mission_category_picker_top">
                  <span aria-hidden="true" />
                  <button type="button" onClick={openCategoryEdit}>수정</button>
                </div>
                <div className="mission_category_grid">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      className={
                        category.id === draftCategory.id
                          ? 'mission_category_option active'
                          : 'mission_category_option'
                      }
                      onClick={() => setDraftCategoryId(category.id)}
                    >
                      <span
                        className="mission_category_dot"
                        style={{ backgroundColor: category.color }}
                        aria-hidden="true"
                      />
                      <span>{category.label}</span>
                    </button>
                  ))}
                  <button
                    type="button"
                    className="mission_category_option mission_category_add_tile"
                    onClick={() => {
                      setNewCategoryName('')
                      setNewCategoryColor(firstAvailableCategoryColor)
                      setIsCategoryEditOpen(false)
                      setIsCategoryAddOpen(true)
                    }}
                  >
                    <span className="mission_category_plus" aria-hidden="true">+</span>
                  </button>
                </div>
                <div className="mission_category_actions">
                  <button
                    type="button"
                    className="mission_category_prev white_btn"
                    onClick={() => {
                      setDraftCategoryId(selectedCategoryId)
                      setIsCategoryPickerOpen(false)
                    }}
                  >
                    이전
                  </button>
                  <button
                    type="button"
                    className="mission_category_confirm"
                    onClick={() => {
                      setSelectedCategoryId(draftCategoryId)
                      setIsCategoryPickerOpen(false)
                    }}
                  >
                    확인
                  </button>
                </div>
              </div>
            ) : (
              <>
                <textarea
                  className="mission_add_title"
                  placeholder="할 일을 입력해주세요."
                  rows={2}
                  value={addTitle}
                  onChange={(e) => {
                    const lines = e.target.value.split('\n')
                    if (lines.length > 2) return
                    setAddTitle(e.target.value)
                  }}
                  autoFocus
                />
                <div className="mission_add_rows">
                  <div className="mission_add_row">
                    <span className="mission_add_row_label">기간</span>
                    <button
                      type="button"
                      className="mission_add_row_value"
                      onClick={() => {
                        setDraftAddDate(addDate)
                        setIsPeriodPickerOpen(true)
                      }}
                    >
                      {addDate.month}월 {addDate.day}일
                      <ChevronIcon direction="right" size="md" />
                    </button>
                  </div>
                  <div className="mission_add_row">
                    <span className="mission_add_row_label">카테고리</span>
                    <button
                      type="button"
                      className="mission_add_row_value"
                      onClick={() => {
                        setDraftCategoryId(selectedCategoryId)
                        setIsCategoryEditOpen(false)
                        setIsCategoryPickerOpen(true)
                      }}
                    >
                      <span
                        className="mission_add_category_dot"
                        style={{ backgroundColor: selectedCategory.color }}
                        aria-hidden="true"
                      />
                      {selectedCategory.label}
                      <ChevronIcon direction="right" size="md" />
                    </button>
                  </div>
                  <div className="mission_add_row">
                    <span className="mission_add_row_label">알림</span>
                    <button type="button" className="mission_add_row_value">
                      없음
                      <ChevronIcon direction="right" size="md" />
                    </button>
                  </div>
                </div>
                <div className="mission_add_save_wrap">
                  <Button
                    type="button"
                    className="purple_btn"
                    disabled={!canSaveMission}
                    onClick={saveMission}
                  >
                    {isEditingHistory ? '수정하기' : '저장하기'}
                  </Button>
                </div>
              </>
            )}
        </AddSheet>
      )}

    </>
  )
}

export default Mission
