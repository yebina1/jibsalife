import './CommunityWrite.css'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import PageHeader from '../../components/PageHeader'
import Title from '../../components/Title'
import BackButton from '../../components/html/BackButton'
import Button from '../../components/html/Button'
import Input from '../../components/html/Input'
import { MY_PROFILE_NAME } from '../../utils/myProfile'
import communityWriteBg from '../../svg/community_write_bg.svg'

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

const allTags = [
  '#포메라니안', '#생후4개월', '#일상', '#입양',
  '#성장', '#집사소통', '#생일', '#선물',
]

const MAX_TAGS = 4

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
  const [selectedTags, setSelectedTags] = useState<string[]>(editPost?.tags ?? [])

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
    const trimmedContent = content.trim()
    if (!trimmedTitle || !trimmedContent || !board) return

    if (editPost) {
      const updatedPost = {
        ...editPost,
        tag: board,
        title: trimmedTitle,
        content: trimmedContent,
        image: null,
        images: [],
        tags: selectedTags,
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
      image: null,
      images: [],
      tags: selectedTags,
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
              placeholder="제목"
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

          {/* 장소 선택 */}
          <div className="cw_section">
            <Title as="h5" title="장소선택" className="cw_media_header" />
            <button type="button" className="cw_place_btn">
              <i className="bx bx-map-pin cw_place_icon" aria-hidden="true" />
              <span>현재 위치를 설정해보세요</span>
              <i className="bx bx-chevron-right" aria-hidden="true" />
            </button>
          </div>

          {/* 태그 선택 */}
          <div className="cw_section">
            <Title as="h5" className="cw_media_header" title="#태그 선택">
              <p>최대 {selectedTags.length}/{MAX_TAGS}</p>
            </Title>
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

        </form>
      </main>

    </>
  )
}

export default CommunityWrite
