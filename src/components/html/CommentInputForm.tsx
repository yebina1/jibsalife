import { useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import './CommentInputForm.css'

const textareaMaxHeight = 102

type CommentInputFormProps = {
  className?: string
  iconButtonClassName?: string
  inputWrapClassName?: string
  placeholder?: string
  addIcon: string
  emojiIcon: string
  onSubmit?: (value: string) => void
}

function CommentInputForm({
  className,
  iconButtonClassName,
  inputWrapClassName,
  placeholder = '메시지를 입력해 주세요.',
  addIcon,
  emojiIcon,
  onSubmit,
}: CommentInputFormProps) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const resizeTextarea = () => {
    const textarea = textareaRef.current
    if (!textarea) return

    textarea.style.height = 'auto'
    textarea.style.height = `${Math.min(textarea.scrollHeight, textareaMaxHeight)}px`
    textarea.style.overflowY = textarea.scrollHeight > textareaMaxHeight ? 'auto' : 'hidden'
  }

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.target.value)
    requestAnimationFrame(resizeTextarea)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedValue = value.trim()
    if (!trimmedValue) return

    onSubmit?.(trimmedValue)
    setValue('')
    requestAnimationFrame(resizeTextarea)
  }

  return (
    <form className={className} onSubmit={handleSubmit}>
      <button type="button" aria-label="사진 추가" className={iconButtonClassName}>
        <img src={addIcon} alt="" />
      </button>

      <label className={inputWrapClassName}>
        <textarea
          ref={textareaRef}
          aria-label="댓글"
          className="comment_input_form_textarea"
          placeholder={placeholder}
          rows={1}
          value={value}
          onChange={handleChange}
        />
        <button type="submit" aria-label="댓글 등록" className="comment_input_form_submit">
          <span className="comment_input_form_submit_icon">
            <i className="bx bx-arrow-up-stroke" aria-hidden="true" />
          </span>
        </button>
      </label>

      <button type="button" aria-label="이모지" className="comment_input_form_emoji">
        <img src={emojiIcon} alt="" />
      </button>
    </form>
  )
}

export default CommentInputForm
