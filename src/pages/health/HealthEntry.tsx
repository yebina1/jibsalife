import { Dog } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import './HealthEntry.css'
import ChevronIcon from '../../components/ChevronIcon'
import { readSelectedPetProfile } from '../../utils/petProfiles'
import {
  readMissionHistoryRecordsWithDefaults,
  writeStoredMissionHistoryRecords,
  MISSION_HISTORY_RECORDS_CHANGE_EVENT,
  type MissionHistoryRecord,
} from '../../utils/missionHistoryRecords'

const today = new Date()

type CategoryOption = {
  id: string
  label: string
  color: string
}

const categoryOptions: CategoryOption[] = [
  { id: 'meal', label: '식사 기록', color: '#ffd1a8' },
  { id: 'poop', label: '배변 기록', color: '#527ca3' },
  { id: 'activity', label: '활동 기록', color: '#428fe6' },
  { id: 'symptom', label: '증상', color: '#b9dfe3' },
]

const quickMessages = [
  '사료 30g',
  '사료 60g',
  '사료 90g',
  '사료 120g',
  '사료 150g',
  '잔액조회 입니다?',
  '거래내역 입니다',
  '이체',
  '수익률',
]

function getDateKey(year: number, month: number, day: number) {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function HealthEntry() {
  const navigate = useNavigate()
  const pet = readSelectedPetProfile()
  const [selectedCategoryId, setSelectedCategoryId] = useState(categoryOptions[0].id)
  const [addTitle, setAddTitle] = useState('')

  const addDate = {
    year: today.getFullYear(),
    month: today.getMonth() + 1,
    day: today.getDate(),
  }

  const selectedCategory = categoryOptions.find((c) => c.id === selectedCategoryId) ?? categoryOptions[0]
  const canSave = addTitle.trim().length > 0

  const handleSave = () => {
    const title = addTitle.trim()
    if (!title) return

    const now = new Date()
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    const recordTitle = selectedCategory.label === '증상' ? '증상 기록' : selectedCategory.label
    const recordDate = getDateKey(addDate.year, addDate.month, addDate.day)

    const newItem: MissionHistoryRecord = {
      id: Date.now(),
      title: recordTitle,
      detail: title,
      time,
      color: selectedCategory.color,
      date: recordDate,
    }
    const existing = readMissionHistoryRecordsWithDefaults()
    writeStoredMissionHistoryRecords([newItem, ...existing])
    window.dispatchEvent(new CustomEvent(MISSION_HISTORY_RECORDS_CHANGE_EVENT, { detail: newItem }))
    setAddTitle('')
  }

  const handleSaveOnly = () => {
    handleSave()
    navigate('/health/cam')
  }

  const handleUpload = () => {
    handleSave()
    navigate('/health/check')
  }

  const handleCategoryClick = () => {
    const idx = categoryOptions.findIndex((c) => c.id === selectedCategoryId)
    setSelectedCategoryId(categoryOptions[(idx + 1) % categoryOptions.length].id)
  }

  return (
    <main className="health_entry">
      {/* 이미지 영역 (일반 흐름, height: 457px) */}
      <section className="health_entry_cam_view" aria-hidden="true">
        {pet.image ? (
          <img className="health_entry_cam_img" src={pet.image} alt="" />
        ) : (
          <div className="health_entry_cam_fallback">
            <Dog size={64} color="#ffffff" />
          </div>
        )}
        <div className="health_entry_cam_overlay" />
      </section>

      {/* 바텀시트 (position: absolute, top: 241px) */}
      <div className="health_entry_sheet">
        <div className="health_entry_handle" aria-hidden="true" />

        <div className="health_entry_rows">
          <div className="health_entry_row">
            <span className="health_entry_row_label">기간</span>
            <button type="button" className="health_entry_row_value">
              {addDate.month}월 {addDate.day}일
              <ChevronIcon direction="right" size="md" />
            </button>
          </div>
          <div className="health_entry_row">
            <span className="health_entry_row_label">
              자동 등록
              <span className="health_entry_info" aria-hidden="true">i</span>
            </span>
            <button type="button" className="health_entry_row_value">
              매일
              <ChevronIcon direction="right" size="md" />
            </button>
          </div>
          <div className="health_entry_row health_entry_row_category">
            <span className="health_entry_row_label">카테고리</span>
            <button type="button" className="health_entry_row_value" onClick={handleCategoryClick}>
              <span
                className="health_entry_category_dot"
                style={{ backgroundColor: selectedCategory.color }}
                aria-hidden="true"
              />
              {selectedCategory.label}
              <ChevronIcon direction="right" size="md" />
            </button>
          </div>
        </div>

        <section className="health_entry_content">
          <h2>내용입력</h2>
          <div className="health_entry_quick_messages" aria-label="빠른 입력">
            {quickMessages.map((msg) => (
              <button
                key={msg}
                type="button"
                className="health_entry_quick_message"
                onClick={() => setAddTitle(msg)}
              >
                {msg}
              </button>
            ))}
          </div>
          <textarea
            className="health_entry_textarea"
            placeholder="기타 입력사항을 자유롭게 작성해 주세요."
            rows={4}
            value={addTitle}
            onChange={(e) => setAddTitle(e.target.value)}
          />
        </section>

        <div className="health_entry_actions">
          <button
            type="button"
            className="health_entry_save_btn"
            disabled={!canSave}
            onClick={handleSaveOnly}
          >
            저장하기
          </button>
          <button
            type="button"
            className="health_entry_upload_btn"
            onClick={handleUpload}
          >
            업로드 하기
          </button>
        </div>

      </div>
    </main>
  )
}

export default HealthEntry
