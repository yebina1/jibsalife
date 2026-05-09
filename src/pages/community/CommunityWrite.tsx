import './CommunityWrite.css'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import PageHeader from '../../components/PageHeader'
import BackButton from '../../components/html/BackButton'
import Button from '../../components/html/Button'
import { MY_PROFILE_NAME } from '../../utils/myProfile'

const createdPostsStorageKey = 'jibsalife.community.createdPosts'

const boardOptions = ['일상'] as const
type BoardOption = (typeof boardOptions)[number]

const allTags = [
  '#포메라니안', '#샴푸4개월', '#일상', '#강정',
  '#성질', '#집사소통', '#생일', '#돌봄',
  '#토도나산', '#미묘', '#아멍', '#생병일지',
  '#중성화', '#집사인성', '#이프지아', '#산책',
]

const MAX_PHOTOS = 4
const MAX_VIDEOS = 4
const MAX_PRODUCTS = 4
const MAX_TAGS = 4

function CommunityWrite() {
  const navigate = useNavigate()

  const [board, setBoard] = useState<BoardOption | ''>('')
  const [isBoardOpen, setIsBoardOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [photos, setPhotos] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const handlePhotoAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setPhotos((prev) => (prev.length < MAX_PHOTOS ? [...prev, reader.result as string] : prev))
        }
      }
      reader.readAsDataURL(file)
    })
    e.target.value = ''
  }

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index))
  }

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : prev.length < MAX_TAGS
          ? [...prev, tag]
          : prev
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedTitle = title.trim()
    if (!trimmedTitle || !board) return

    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')

    const newPost = {
      id: Date.now(),
      tag: board,
      title: trimmedTitle,
      content: content.trim(),
      author: MY_PROFILE_NAME,
      date: `${year}.${month}.${day}`,
      likes: 0,
      comments: 0,
      createdAt: now.toISOString(),
      image: photos[0] ?? null,
    }

    try {
      const saved = window.localStorage.getItem(createdPostsStorageKey)
      const existing = saved ? JSON.parse(saved) : []
      const updated = Array.isArray(existing) ? [newPost, ...existing] : [newPost]
      window.localStorage.setItem(createdPostsStorageKey, JSON.stringify(updated))
    } catch {}

    navigate('/community/petstory')
  }

  const emptyPhotoSlots = Math.min(3, MAX_PHOTOS - photos.length)

  return (
    <>
      <PageHeader title="글작성" leftContent={<BackButton />} />

      <main className="page cw_page">
        <form className="cw_form" onSubmit={handleSubmit}>

          {/* 게시판 선택 */}
          <div className="cw_section cw_board_section">
            <div className="cw_board_select">
              <button
                type="button"
                className="cw_board_toggle"
                onClick={() => setIsBoardOpen((p) => !p)}
                aria-haspopup="listbox"
                aria-expanded={isBoardOpen}
              >
                <span className={board ? '' : 'cw_placeholder'}>{board || '게시판을 선택하세요'}</span>
                <span className="cw_chevron_icon" aria-hidden="true" />
              </button>
              {isBoardOpen && (
                <div className="cw_board_menu" role="listbox">
                  {boardOptions.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      className={`cw_board_option${board === opt ? ' active' : ''}`}
                      role="option"
                      aria-selected={board === opt}
                      onClick={() => { setBoard(opt); setIsBoardOpen(false) }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 제목 */}
          <div className="cw_section">
            <input
              className="cw_title_input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목"
              maxLength={40}
            />
          </div>

          {/* 내용 */}
          <div className="cw_section">
            <textarea
              className="cw_content_textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="내용을 작성해 주세요"
              rows={4}
            />
          </div>

          {/* 사진 등록 */}
          <div className="cw_section">
            <div className="cw_media_header">
              <span className="cw_media_label">사진 등록</span>
              <span className="cw_media_count">최대 {photos.length}/{MAX_PHOTOS}</span>
            </div>
            <div className="cw_media_slots">
              {photos.map((src, i) => (
                <div key={i} className="cw_media_slot cw_media_filled">
                  <img src={src} alt="" />
                  <button type="button" className="cw_media_remove" onClick={() => removePhoto(i)} aria-label="사진 삭제">×</button>
                </div>
              ))}
              {Array.from({ length: emptyPhotoSlots }).map((_, i) => (
                <label key={i} className="cw_media_slot">
                  <input type="file" accept="image/*" multiple onChange={handlePhotoAdd} hidden />
                  <span className="cw_media_plus" aria-hidden="true">+</span>
                </label>
              ))}
            </div>
          </div>

          {/* 동영상 등록 */}
          <div className="cw_section">
            <div className="cw_media_header">
              <span className="cw_media_label">동영상 등록 <span className="cw_media_sub">(최대 60초)</span></span>
              <span className="cw_media_count">최대 0/{MAX_VIDEOS}</span>
            </div>
            <div className="cw_media_slots">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="cw_media_slot">
                  <span className="cw_media_plus" aria-hidden="true">+</span>
                </div>
              ))}
            </div>
          </div>

          {/* 사료/영양제/간식 정보 등록 */}
          <div className="cw_section">
            <div className="cw_media_header">
              <span className="cw_media_label">사료·영양제·간식 정보 등록</span>
              <span className="cw_media_count">최대 0/{MAX_PRODUCTS}</span>
            </div>
            <div className="cw_media_slots cw_product_slots">
              <div className="cw_media_slot">
                <span className="cw_media_plus" aria-hidden="true">+</span>
              </div>
            </div>
            <button type="button" className="cw_food_add_btn">
              <span className="cw_food_add_icon" aria-hidden="true">⊕</span>
              뚱뚱이가 먹고 있는 사료 추가하기
            </button>
          </div>

          {/* 태그 선택 */}
          <div className="cw_section">
            <div className="cw_media_header">
              <span className="cw_media_label">태그 선택</span>
              <span className="cw_media_count">최대 {selectedTags.length}/{MAX_TAGS}</span>
            </div>
            <div className="cw_tags_grid">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className={`cw_tag_btn${selectedTags.includes(tag) ? ' active' : ''}`}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            className="purple_btn square_btn cw_submit"
            disabled={!title.trim() || !board}
          >
            등록하기
          </Button>

        </form>
      </main>
    </>
  )
}

export default CommunityWrite
