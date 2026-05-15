import './CommunityWrite.css'
import { useLayoutEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import PageHeader from '../../components/PageHeader'
import BackButton from '../../components/html/BackButton'
import Button from '../../components/html/Button'
import Input from '../../components/html/Input'
import { MY_PROFILE_NAME } from '../../utils/myProfile'
import communityWriteBg from '../../svg/community_write_bg.svg'
import imageIcon from '../../svg/Image.svg'
import tagsIcon from '../../svg/tags.svg'
import PostMoreSheet from '../../components/PostMoreSheet'

const createdPostsStorageKey = 'jibsalife.community.createdPosts'

const boardOptions = ['일상'] as const
type BoardOption = (typeof boardOptions)[number]

type EditPost = {
  id: number
  tag: string
  title: string
  content?: string
  image: string | null
  images?: string[]
  tags?: string[]
  author?: string
  likes?: number
  comments?: number
  shares?: number
  createdAt?: string
  date?: string
  place?: { name: string; address: string }
}

type TextBlock = { type: 'text'; id: number; value: string }
type ImageBlock = { type: 'image'; id: number; url: string }
type ContentBlock = TextBlock | ImageBlock

function AutoGrowTextarea({
  value,
  onChange,
  onFocus,
  placeholder,
  className,
}: {
  value: string
  onChange: (v: string) => void
  onFocus?: () => void
  placeholder?: string
  className?: string
}) {
  const ref = useRef<HTMLTextAreaElement>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [value])

  return (
    <textarea
      ref={ref}
      className={['input_field', className].filter(Boolean).join(' ')}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onFocus={onFocus}
      placeholder={placeholder}
      rows={1}
      style={{ overflow: 'hidden' }}
    />
  )
}

function CommunityWrite() {
  const navigate = useNavigate()
  const location = useLocation()
  const editPost = (location.state as { editPost?: EditPost } | null)?.editPost

  const [board, setBoard] = useState<BoardOption | ''>(
    editPost && boardOptions.includes(editPost.tag as BoardOption) ? (editPost.tag as BoardOption) : '일상'
  )
  const [isBoardOpen, setIsBoardOpen] = useState(false)
  const [title, setTitle] = useState(editPost?.title ?? '')
  const [blocks, setBlocks] = useState<ContentBlock[]>(() => {
    if (editPost) {
      const textBlock: TextBlock = { type: 'text', id: 1, value: editPost.content ?? '' }
      if (editPost.images?.length) {
        const imgBlocks: ImageBlock[] = editPost.images.map((url, i) => ({
          type: 'image',
          id: i + 2,
          url,
        }))
        return [textBlock, ...imgBlocks, { type: 'text', id: editPost.images.length + 2, value: '' }]
      }
      return [textBlock]
    }
    return [{ type: 'text', id: Date.now(), value: '' }]
  })
  const [focusedBlockId, setFocusedBlockId] = useState<number | null>(null)
  const [isPhotoSheetOpen, setIsPhotoSheetOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const derivedContent = blocks
    .filter((b): b is TextBlock => b.type === 'text')
    .map((b) => b.value)
    .join('\n')
    .trim()
  const derivedImages = blocks
    .filter((b): b is ImageBlock => b.type === 'image')
    .map((b) => b.url)

  const handleAlbum = () => { setIsPhotoSheetOpen(false); fileInputRef.current?.click() }
  const handleCamera = () => { setIsPhotoSheetOpen(false); cameraInputRef.current?.click() }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    const urls = files.map((f) => URL.createObjectURL(f))
    e.target.value = ''
    if (!urls.length) return

    setBlocks((prev) => {
      const insertAfterIdx =
        focusedBlockId !== null
          ? prev.findIndex((b) => b.id === focusedBlockId)
          : prev.length - 1
      const idx = insertAfterIdx >= 0 ? insertAfterIdx : prev.length - 1

      const imageBlocks: ImageBlock[] = urls.map((url, i) => ({
        type: 'image',
        id: Date.now() + i,
        url,
      }))
      const newTextBlock: TextBlock = {
        type: 'text',
        id: Date.now() + urls.length,
        value: '',
      }

      const next = [...prev]
      next.splice(idx + 1, 0, ...imageBlocks, newTextBlock)
      return next
    })
  }

  const updateTextBlock = (id: number, value: string) => {
    setBlocks((prev) => prev.map((b) => b.type === 'text' && b.id === id ? { ...b, value } : b))
  }

  const removeImageBlock = (id: number) => {
    setBlocks((prev) => {
      const next = prev.filter((b) => b.id !== id)
      if (next.length === 0) return [{ type: 'text', id: Date.now(), value: '' }]
      return next
    })
  }

  const handleAddTag = () => {
    const targetId =
      focusedBlockId ??
      blocks.filter((b): b is TextBlock => b.type === 'text').at(-1)?.id
    if (targetId === undefined) return
    setBlocks((prev) =>
      prev.map((b) =>
        b.type === 'text' && b.id === targetId
          ? { ...b, value: b.value ? `${b.value} #` : '#' }
          : b
      )
    )
  }

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault()
    const trimmedTitle = title.trim()
    const trimmedContent = derivedContent
    if (!trimmedTitle || !trimmedContent || !board) return

    if (editPost) {
      const updatedPost = {
        ...editPost,
        tag: board,
        title: trimmedTitle,
        content: trimmedContent,
        image: derivedImages[0] ?? null,
        images: derivedImages,
        tags: [],
      }
      try {
        const saved = window.localStorage.getItem(createdPostsStorageKey)
        const existing = saved ? JSON.parse(saved) : []
        const updated = Array.isArray(existing)
          ? existing.map((p: { id: number }) => (p.id === editPost.id ? updatedPost : p))
          : [updatedPost]
        window.localStorage.setItem(createdPostsStorageKey, JSON.stringify(updated))
      } catch { /* noop */ }
      navigate(`/community/petstory/detail/${editPost.id}`, { state: { post: updatedPost } })
      return
    }

    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')

    const newPost = {
      id: Date.now(),
      tag: board,
      title: trimmedTitle,
      content: trimmedContent,
      author: MY_PROFILE_NAME,
      date: `${year}.${month}.${day}`,
      likes: 0,
      comments: 0,
      shares: 0,
      createdAt: now.toISOString(),
      image: derivedImages[0] ?? null,
      images: derivedImages,
      tags: [],
    }

    try {
      const saved = window.localStorage.getItem(createdPostsStorageKey)
      const existing = saved ? JSON.parse(saved) : []
      const updated = Array.isArray(existing) ? [newPost, ...existing] : [newPost]
      window.localStorage.setItem(createdPostsStorageKey, JSON.stringify(updated))
    } catch { /* noop */ }

    navigate('/community/petstory')
  }

  return (
    <>
      <PageHeader
        title={editPost ? '글수정' : '글작성'}
        leftContent={<BackButton />}
        rightContent={
          <Button
            type="submit"
            form="cw_form"
            className="s_purple_btn"
            disabled={!title.trim() || !derivedContent || !board}
          >
            {editPost ? '수정' : '등록'}
          </Button>
        }
      />

      <main className="page cw_page">
        <form id="cw_form" className="cw_form" onSubmit={handleSubmit}>

          <div className="cw_section cw_section_no_bottom_space cw_board_section">
            <div className="cw_board_select">
              <button
                type="button"
                className="cw_board_toggle"
                onClick={() => setIsBoardOpen((p) => !p)}
                aria-haspopup="listbox"
                aria-expanded={isBoardOpen}
              >
                <span className={board ? '' : 'cw_placeholder'}>{board || '주제를 선택하세요'}</span>
                <i className="bx bx-chevron-down cw_chevron_icon" aria-hidden="true" />
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

          <div className="cw_section cw_section_no_bottom_space">
            <Input
              className="cw_title_input"
              value={title}
              onChange={setTitle}
              placeholder="제목을 입력해주세요"
              maxLength={40}
            />
          </div>

          <div
            className="cw_section cw_section_no_bottom_space cw_content_section"
            style={{ backgroundImage: `url(${communityWriteBg})` }}
          >
            <div className="cw_content_blocks">
              {blocks.map((block) =>
                block.type === 'image' ? (
                  <div key={block.id} className="cw_inline_image_wrap">
                    <img src={block.url} alt="" className="cw_inline_image" />
                    <button
                      type="button"
                      className="cw_inline_image_remove"
                      onClick={() => removeImageBlock(block.id)}
                      aria-label="사진 삭제"
                    >
                      <i className="bx bxs-x-circle" aria-hidden="true" />
                    </button>
                  </div>
                ) : (
                  <AutoGrowTextarea
                    key={block.id}
                    className="cw_content_textarea"
                    value={block.value}
                    onChange={(v) => updateTextBlock(block.id, v)}
                    onFocus={() => setFocusedBlockId(block.id)}
                    placeholder={
                      block === blocks[0]
                        ? '오늘의 펫스토리 내용을 작성해 보세요\n#투표 #반려동물 #일상...'
                        : undefined
                    }
                  />
                )
              )}
            </div>
          </div>

        </form>
      </main>

      <footer>
        <div className="cw_action_row">
          <button type="button" className="p_regular" onClick={() => setIsPhotoSheetOpen(true)}>
            <img src={imageIcon} className="cw_action_icon" alt="" />
            사진
          </button>
          <button type="button" className="p_regular" onClick={handleAddTag}>
            <img src={tagsIcon} className="cw_action_icon" alt="" />
            태그
          </button>
        </div>
      </footer>

      <input ref={fileInputRef} type="file" accept="image/*" multiple className="cw_hidden_input" onChange={handleFileChange} />
      <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="cw_hidden_input" onChange={handleFileChange} />

      {isPhotoSheetOpen && (
        <PostMoreSheet
          type="photo"
          onClose={() => setIsPhotoSheetOpen(false)}
          onCamera={handleCamera}
          onAlbum={handleAlbum}
        />
      )}
    </>
  )
}

export default CommunityWrite
