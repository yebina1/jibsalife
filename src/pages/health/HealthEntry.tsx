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
import { showStateBarMessage } from '../../utils/stateBarMessage'

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
  { id: 'walk', label: '산책 기록', color: '#a4ce95' },
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
  const [feedAmount, setFeedAmount] = useState(0)

  const addDate = {
    year: today.getFullYear(),
    month: today.getMonth() + 1,
    day: today.getDate(),
  }

  const selectedCategory = categoryOptions.find((c) => c.id === selectedCategoryId) ?? categoryOptions[0]
  const selectedQuickMessages = categoryQuickMessageOptions[selectedCategory.id] ?? []
  const isAmountInputCategory = selectedCategory.id === 'meal' || selectedCategory.id === 'walk'
  const amountInputLabel = selectedCategory.id === 'walk' ? '산책 시간' : '사료량'
  const amountUnit = selectedCategory.id === 'walk' ? '분' : 'g'
  const canSave = isAmountInputCategory || addTitle.trim().length > 0 || selectedQuickMessage !== ''
  const handleRepeatInfoClick = () => {
    showStateBarMessage('설정한 주기에 맞춰 기록이 자동 등록돼요.\n(ex. 매일, 매주)', 3000, {
      placement: 'sheet',
    })
  }
  const addContentLabel =
    selectedCategory.id === 'poop'
      ? '배변·배뇨 기록'
      : selectedCategory.id === 'symptom'
        ? '증상 기록'
        : selectedCategory.label

  const handleSave = () => {
    const memo = addTitle.trim()
    const primaryDetail =
      selectedCategory.id === 'meal'
        ? `사료 ${feedAmount}g`
        : selectedCategory.id === 'walk'
          ? `산책 ${feedAmount}분`
          : selectedQuickMessage
    const detail = [primaryDetail, memo].filter(Boolean).join('\n')
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
    showStateBarMessage('우리 아이의 기록이 저장되었어요.')
    setSelectedQuickMessage('')
    setAddTitle('')
    if (selectedCategory.id === 'walk') {
      setFeedAmount(30)
    } else if (selectedCategory.id === 'meal') {
      setFeedAmount(0)
    }
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
      if (draftCategoryId === 'walk') {
        setFeedAmount(30)
      } else if (draftCategoryId === 'meal') {
        setFeedAmount(0)
      }
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
              <span>{`${addDate.month}월 ${addDate.day}일`}</span>
              <ChevronIcon direction="right" size="md" />
            </button>
          </div>
          <div className="health_entry_row">
            <span className="health_entry_row_label">
              반복
              <button
                type="button"
                className="health_entry_info_button"
                aria-label="반복 설정 안내"
                onClick={handleRepeatInfoClick}
              >
                <span className="health_entry_info" aria-hidden="true">
                  i
                </span>
              </button>
            </span>
            <button type="button" className="health_entry_row_value">
              반복 안 함
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

        <section className={`health_entry_content${isAmountInputCategory ? ' has_amount' : ''}`}>
          <h2>{isAmountInputCategory ? amountInputLabel : addContentLabel}</h2>
          {isAmountInputCategory ? (
            <div className="health_entry_amount_control" aria-label={amountInputLabel}>
              <button
                type="button"
                aria-label={`${amountInputLabel} ${selectedCategory.id === 'walk' ? '5분' : '5g'} 줄이기`}
                onClick={() => setFeedAmount(Math.max(0, feedAmount - 5))}
              >
                -
              </button>
              <span className={`health_entry_amount_value${feedAmount === 0 ? ' is_zero' : ''}`}>
                <input
                  type="number"
                  inputMode="numeric"
                  min="0"
                  step="5"
                  value={feedAmount}
                  onChange={(event) => {
                    const nextAmount = Number(event.target.value)
                    setFeedAmount(Number.isFinite(nextAmount) ? Math.max(0, nextAmount) : 0)
                  }}
                  aria-label={amountInputLabel}
                />
                <span>{amountUnit}</span>
              </span>
              <button
                type="button"
                aria-label={`${amountInputLabel} ${selectedCategory.id === 'walk' ? '5분' : '5g'} 늘리기`}
                onClick={() => setFeedAmount(feedAmount + 5)}
              >
                +
              </button>
            </div>
          ) : (
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
          )}
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
