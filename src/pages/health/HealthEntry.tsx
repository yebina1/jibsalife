import { Dog } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import AddSheet from '../../components/AddSheet'
import ChevronIcon from '../../components/ChevronIcon'
import './HealthEntry.css'
import { readSelectedPetProfile } from '../../utils/petProfiles'
import {
  MISSION_HISTORY_RECORDS_CHANGE_EVENT,
  type MissionHistoryRecord,
  readMissionHistoryRecordsWithDefaults,
  writeStoredMissionHistoryRecords,
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

const categoryQuickMessageOptions: Record<string, string[]> = {
  meal: ['사료 30g', '사료 60g', '사료 90g', '사료 120g', '사료 150g', '기타'],
  poop: ['정상 변', '묽은 변', '딱딱한 변', '배변 못함', '소변 잦음', '실수 배뇨', '평소와 다름', '기타'],
  activity: ['활발함', '보통', '활동 적음', '무기력', '평소와 다름', '기타'],
  symptom: ['기침', '재채기', '구토', '설사', '헐떡', '무기력', '긁음', '기타'],
}

function getDateKey(year: number, month: number, day: number) {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function HealthEntry() {
  const navigate = useNavigate()
  const pet = readSelectedPetProfile()
  const [selectedCategoryId, setSelectedCategoryId] = useState(categoryOptions[0].id)
  const [draftCategoryId, setDraftCategoryId] = useState(categoryOptions[0].id)
  const [isCategoryPickerOpen, setIsCategoryPickerOpen] = useState(false)
  const [selectedQuickMessage, setSelectedQuickMessage] = useState('')
  const [addTitle, setAddTitle] = useState('')

  const addDate = {
    year: today.getFullYear(),
    month: today.getMonth() + 1,
    day: today.getDate(),
  }

  const selectedCategory = categoryOptions.find((c) => c.id === selectedCategoryId) ?? categoryOptions[0]
  const selectedQuickMessages = categoryQuickMessageOptions[selectedCategory.id] ?? []
  const canSave = addTitle.trim().length > 0 || selectedQuickMessage !== ''
  const addContentLabel =
    selectedCategory.id === 'poop'
      ? '배변·배뇨 기록'
      : selectedCategory.id === 'symptom'
        ? '증상 기록'
        : selectedCategory.label

  const handleSave = () => {
    const memo = addTitle.trim()
    const detail = [selectedQuickMessage, memo].filter(Boolean).join('\n')
    if (!detail) return

    const now = new Date()
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    const recordTitle = selectedCategory.id === 'symptom' ? '증상 기록' : selectedCategory.label
    const recordDate = getDateKey(addDate.year, addDate.month, addDate.day)

    const newItem: MissionHistoryRecord = {
      id: Date.now(),
      title: recordTitle,
      detail,
      time,
      color: selectedCategory.color,
      date: recordDate,
    }

    const existing = readMissionHistoryRecordsWithDefaults()
    writeStoredMissionHistoryRecords([newItem, ...existing])
    window.dispatchEvent(new CustomEvent(MISSION_HISTORY_RECORDS_CHANGE_EVENT, { detail: newItem }))
    setSelectedQuickMessage('')
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
    setDraftCategoryId(selectedCategoryId)
    setIsCategoryPickerOpen(true)
  }

  const handleCategoryConfirm = () => {
    if (draftCategoryId !== selectedCategoryId) {
      setSelectedQuickMessage('')
      setAddTitle('')
    }
    setSelectedCategoryId(draftCategoryId)
    setIsCategoryPickerOpen(false)
  }

  return (
    <main className="health_entry">
      <section className="health_entry_cam_view" aria-hidden="true">
        {pet.image ? (
          <img className="health_entry_cam_img" src={pet.image} alt={`${pet.name} 프로필 이미지`} />
        ) : (
          <div className="health_entry_cam_fallback">
            <Dog size={64} color="#ffffff" />
          </div>
        )}
        <div className="health_entry_cam_overlay" />
      </section>

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
              반복
              <span className="health_entry_info" aria-hidden="true">
                i
              </span>
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
          <h2>{addContentLabel}</h2>
          <div className="health_entry_quick_messages" aria-label="빠른 입력">
            {selectedQuickMessages.map((msg) => (
              <button
                key={msg}
                type="button"
                className={`health_entry_quick_message${selectedQuickMessage === msg ? ' active' : ''}`}
                onClick={() => setSelectedQuickMessage(msg)}
              >
                {msg}
              </button>
            ))}
          </div>
          <textarea
            className="health_entry_textarea"
            placeholder="추가로 기록할 내용을 입력해 주세요."
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
          <button type="button" className="health_entry_upload_btn" disabled={!canSave} onClick={handleUpload}>
            업로드하기
          </button>
        </div>
      </div>

      {isCategoryPickerOpen ? (
        <AddSheet onClose={() => setIsCategoryPickerOpen(false)}>
          <div className="health_entry_category_picker">
            <div className="health_entry_category_picker_top">
              <button
                type="button"
                className="health_entry_category_picker_text"
                onClick={() => setIsCategoryPickerOpen(false)}
              >
                이전
              </button>
              <h2>카테고리 선택</h2>
              <span aria-hidden="true" />
            </div>
            <div className="health_entry_category_grid">
              {categoryOptions.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  className={`health_entry_category_option${draftCategoryId === category.id ? ' active' : ''}`}
                  onClick={() => setDraftCategoryId(category.id)}
                >
                  <span
                    className="health_entry_category_dot"
                    style={{ backgroundColor: category.color }}
                    aria-hidden="true"
                  />
                  <span>{category.label}</span>
                </button>
              ))}
            </div>
            <div className="health_entry_category_actions">
              <button
                type="button"
                className="health_entry_category_prev"
                onClick={() => setIsCategoryPickerOpen(false)}
              >
                이전
              </button>
              <button type="button" className="health_entry_category_confirm" onClick={handleCategoryConfirm}>
                확인
              </button>
            </div>
          </div>
        </AddSheet>
      ) : null}
    </main>
  )
}

export default HealthEntry
