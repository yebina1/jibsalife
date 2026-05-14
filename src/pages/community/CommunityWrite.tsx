import './CommunityWrite.css'
import { useRef, useState } from 'react'
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

function CommunityWrite() {
  const navigate = useNavigate()
  const location = useLocation()
  const editPost = (location.state as { editPost?: EditPost } | null)?.editPost

  const [board, setBoard] = useState<BoardOption | ''>(
    editPost && boardOptions.includes(editPost.tag as BoardOption) ? (editPost.tag as BoardOption) : '일상'
  )
  const [isBoardOpen, setIsBoardOpen] = useState(false)
  const [title, setTitle] = useState(editPost?.title ?? '')
  const [content, setContent] = useState(editPost?.content ?? '')

  const [images, setImages] = useState<string[]>(editPost?.images ?? [])
  const [isPhotoSheetOpen, setIsPhotoSheetOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const handleAlbum = () => {
    setIsPhotoSheetOpen(false)
    fileInputRef.current?.click()
  }

  const handleCamera = () => {
    setIsPhotoSheetOpen(false)
    cameraInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    const urls = files.map((f) => URL.createObjectURL(f))
    setImages((prev) => [...prev, ...urls])
    e.target.value = ''
  }

  const handleAddTag = () => setContent((c) => c ? `${c} #` : '#')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedTitle = title.trim()
    const trimmedContent = content.trim()
    if (!trimmedTitle || !trimmedContent || !board) return

    if (editPost) {
      const updatedPost = {
        ...editPost,
        tag: board,
        title: trimmedTitle,
        content: trimmedContent,
        image: images[0] ?? null,
        images,
        tags: [],
      }
      try {
        const saved = window.localStorage.getItem(createdPostsStorageKey)
        const existing = saved ? JSON.parse(saved) : []
        const updated = Array.isArray(existing)
          ? existing.map((p: { id: number }) => (p.id === editPost.id ? updatedPost : p))
          : [updatedPost]
        window.localStorage.setItem(createdPostsStorageKey, JSON.stringify(updated))
      } catch {
        // Ignore localStorage write failures.
      }
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
      image: images[0] ?? null,
      images,
      tags: [],
    }

    try {
      const saved = window.localStorage.getItem(createdPostsStorageKey)
      const existing = saved ? JSON.parse(saved) : []
      const updated = Array.isArray(existing) ? [newPost, ...existing] : [newPost]
      window.localStorage.setItem(createdPostsStorageKey, JSON.stringify(updated))
    } catch {
      // Ignore localStorage write failures; navigation still returns to the list.
    }

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
            disabled={!title.trim() || !content.trim() || !board}
          >
            {editPost ? '수정' : '등록'}
          </Button>
        }
      />

      <main className="page cw_page">
        <form id="cw_form" className="cw_form" onSubmit={handleSubmit}>

          {/* 게시판 선택 */}
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

          {/* 제목 */}
          <div className="cw_section cw_section_no_bottom_space">
            <Input
              className="cw_title_input"
              value={title}
              onChange={setTitle}
              placeholder="제목을 입력해주세요"
              maxLength={40}
            />
          </div>

          {/* 내용 */}
          <div
            className="cw_section cw_section_no_bottom_space cw_content_section"
            style={{ backgroundImage: `url(${communityWriteBg})` }}
          >
            <Input
              className="cw_content_textarea"
              value={content}
              onChange={setContent}
              placeholder={"오늘의 펫스토리 내용을 작성해 보세요\n#투표 #반려동물 #일상..."}
              multiline
              rows={4}
            />
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

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="cw_hidden_input"
        onChange={handleFileChange}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="cw_hidden_input"
        onChange={handleFileChange}
      />

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
