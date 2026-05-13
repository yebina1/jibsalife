import Button from './html/Button'
import ChevronIcon from './ChevronIcon'
import './MissionRecordSheet.css'

type MissionSheetDate = {
  month: number
  day: number
}

type MissionSheetCategory = {
  id: string
  label: string
  color: string
}

type Props = {
  addDate: MissionSheetDate
  selectedCategory: MissionSheetCategory
  repeatLabel: string
  addTitle: string
  feedAmount: number
  canSave: boolean
  isEditing: boolean
  quickMessageOptions: string[]
  selectedQuickMessage: string
  isPeriodPickerOpen?: boolean
  periodPickerContent?: React.ReactNode
  onOpenPeriodPicker: () => void
  onOpenRepeatPicker: () => void
  onOpenCategoryPicker: () => void
  onQuickMessageSelect: (message: string) => void
  onTitleChange: (title: string) => void
  onFeedAmountChange: (amount: number) => void
  onDelete: () => void
  onSave: () => void
}

function MissionRecordSheet({
  addDate,
  selectedCategory,
  repeatLabel,
  addTitle,
  feedAmount,
  canSave,
  isEditing,
  quickMessageOptions,
  selectedQuickMessage,
  isPeriodPickerOpen = false,
  periodPickerContent,
  onOpenPeriodPicker,
  onOpenRepeatPicker,
  onOpenCategoryPicker,
  onQuickMessageSelect,
  onTitleChange,
  onFeedAmountChange,
  onDelete,
  onSave,
}: Props) {
  const isAmountInputCategory =
    selectedCategory.id === 'meal' || selectedCategory.id === 'walk'
  const amountInputLabel = selectedCategory.id === 'walk' ? '산책 시간' : '사료량'
  const addContentLabel = selectedCategory.id === 'poop'
    ? '배변·배뇨 기록'
    : selectedCategory.id === 'activity'
      ? '활동기록'
      : selectedCategory.label

  return (
    <>
      <div className="mission_add_rows">
        {isPeriodPickerOpen && periodPickerContent ? (
          periodPickerContent
        ) : (
        <div className="mission_add_row">
          <span className="mission_add_row_label">기간</span>
          <button
            type="button"
            className="mission_add_row_value"
            onClick={onOpenPeriodPicker}
          >
            {addDate.month}월 {addDate.day}일
            <ChevronIcon direction="right" size="md" />
          </button>
        </div>
        )}
        <div className="mission_add_row">
          <span className="mission_add_row_label">
            반복
            <span className="mission_add_info" aria-hidden="true">i</span>
          </span>
          <button
            type="button"
            className="mission_add_row_value"
            onClick={onOpenRepeatPicker}
          >
            {repeatLabel}
            <ChevronIcon direction="right" size="md" />
          </button>
        </div>
        <div className="mission_add_row">
          <span className="mission_add_row_label">카테고리</span>
          <button
            type="button"
            className="mission_add_row_value mission_add_category_value"
            onClick={onOpenCategoryPicker}
          >
            <span className="mission_add_category_text">
              <span
                className="mission_add_category_dot"
                style={{ backgroundColor: selectedCategory.color }}
                aria-hidden="true"
              />
              <span className="mission_add_category_label">{selectedCategory.label}</span>
            </span>
            <ChevronIcon direction="right" size="md" />
          </button>
        </div>
      </div>

      <section className={`mission_add_content${isAmountInputCategory ? ' has_amount' : ''}`}>
        {isAmountInputCategory ? (
          <div className="mission_amount_frame">
            <h2>{amountInputLabel}</h2>
            <div className="mission_amount_control" aria-label={amountInputLabel}>
              {selectedCategory.id === 'meal' ? (
                <>
                  <button
                    type="button"
                    aria-label={`${amountInputLabel} 5g 줄이기`}
                    onClick={() => onFeedAmountChange(Math.max(0, feedAmount - 5))}
                  >
                    -
                  </button>
                  <span className={`mission_amount_value${feedAmount === 0 ? ' is_zero' : ''}`}>
                    <input
                      type="number"
                      inputMode="numeric"
                      min="0"
                      step="5"
                      value={feedAmount}
                      onChange={(event) => {
                        const nextAmount = Number(event.target.value)
                        onFeedAmountChange(Number.isFinite(nextAmount) ? Math.max(0, nextAmount) : 0)
                      }}
                      aria-label={amountInputLabel}
                    />
                    <span>g</span>
                  </span>
                  <button
                    type="button"
                    aria-label={`${amountInputLabel} 5g 올리기`}
                    onClick={() => onFeedAmountChange(feedAmount + 5)}
                  >
                    +
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    aria-label={`${amountInputLabel} 5분 줄이기`}
                    onClick={() => onFeedAmountChange(Math.max(0, feedAmount - 5))}
                  >
                    -
                  </button>
                  <strong>{feedAmount}분</strong>
                  <button
                    type="button"
                    aria-label={`${amountInputLabel} 5분 올리기`}
                    onClick={() => onFeedAmountChange(feedAmount + 5)}
                  >
                    +
                  </button>
                </>
              )}
            </div>
          </div>
        ) : (
          <>
            <h2>{addContentLabel}</h2>
            <div className="mission_quick_messages" aria-label="빠른 입력">
              {quickMessageOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`mission_quick_message${selectedQuickMessage === option ? ' active' : ''}`}
                  onClick={() => onQuickMessageSelect(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </>
        )}
        <textarea
          className="mission_add_title"
          placeholder="추가로 기록할 내용을 입력해 주세요."
          rows={4}
          value={addTitle}
          onChange={(event) => onTitleChange(event.target.value)}
        />
      </section>

      <div className={`mission_add_save_wrap${isEditing ? ' is_editing' : ''}`}>
        {isEditing && (
          <button
            type="button"
            className="mission_add_delete_btn"
            onClick={onDelete}
          >
            삭제하기
          </button>
        )}
        <Button
          type="button"
          className="purple_btn"
          disabled={!canSave}
          onClick={onSave}
        >
          {isEditing ? '수정하기' : '저장하기'}
        </Button>
      </div>
    </>
  )
}

export default MissionRecordSheet
