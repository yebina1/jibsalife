import './CommunityWrite.css'
import './VoteWrite.css'
import { useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import PageHeader from '../../components/PageHeader'
import BackButton from '../../components/html/BackButton'
import Button from '../../components/html/Button'
import Input from '../../components/html/Input'
import ConfirmDialog from '../../components/ConfirmDialog'
import communityWriteBg from '../../svg/community_write_bg.svg'
import imageIcon from '../../svg/Image.svg'
import peopleIcon from '../../svg/people.svg'
import voteOIcon from '../../svg/vote_o.svg'
import voteXIcon from '../../svg/vote_x.svg'
import { saveUserVote } from '../../utils/savedVotes'

const VOTE_DURATION_OPTIONS = [3, 7, 10] as const
type VoteDuration = (typeof VOTE_DURATION_OPTIONS)[number]

const VOTE_TYPE_OPTIONS = ['사진 투표', 'OX'] as const
type VoteType = (typeof VOTE_TYPE_OPTIONS)[number] | ''

type VoteItem = { id: number; image: string | null; label: string }

function VoteWrite() {
  const navigate = useNavigate()

  const [voteType, setVoteType] = useState<VoteType>('')
  const [isVoteTypeOpen, setIsVoteTypeOpen] = useState(false)
  const [voteTitle, setVoteTitle] = useState('')
  const [voteContent, setVoteContent] = useState('')
  const [voteDuration, setVoteDuration] = useState<VoteDuration>(3)
  const [voteItems, setVoteItems] = useState<VoteItem[]>([
    { id: 1, image: null, label: '' },
    { id: 2, image: null, label: '' },
  ])
  const [isVoteConfirmOpen, setIsVoteConfirmOpen] = useState(false)
  const voteItemFileRefs = useRef<(HTMLInputElement | null)[]>([])

  const isVoteReady =
    voteType !== '' &&
    voteTitle.trim() !== '' &&
    (voteType === 'OX' || voteItems.every((it) => it.image !== null || it.label.trim() !== ''))

  const handleVoteItemImageChange = (idx: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setVoteItems((prev) => prev.map((it, i) => i === idx ? { ...it, image: url } : it))
    e.target.value = ''
  }

  const handleVoteConfirm = () => {
    saveUserVote({
      id: Date.now(),
      title: voteTitle,
      content: voteContent,
      voteType: voteType as '사진 투표' | 'OX',
      voteDuration,
      voteItems,
      createdAt: new Date().toISOString(),
    })
    setIsVoteConfirmOpen(false)
    navigate('/community/vote')
  }

  return (
    <>
      <PageHeader
        title="집사 투표 글쓰기"
        leftContent={<BackButton />}
        rightContent={
          <Button
            type="button"
            className={`s_purple_btn${!isVoteReady ? ' is_disabled' : ''}`}
            disabled={!isVoteReady}
            onClick={() => setIsVoteConfirmOpen(true)}
          >
            등록
          </Button>
        }
      />

      <main className="page cw_page cw_page_vote">
        <div className="cw_form">

          {/* 투표 방식 선택 */}
          <div className="cw_section cw_section_no_bottom_space cw_board_section">
            <div className="cw_board_select">
              <button
                type="button"
                className="cw_board_toggle"
                onClick={() => setIsVoteTypeOpen((p) => !p)}
                aria-haspopup="listbox"
                aria-expanded={isVoteTypeOpen}
              >
                <span className={voteType ? '' : 'cw_placeholder'}>
                  {voteType || '투표 방식을 선택해주세요'}
                </span>
                <i className="bx bx-chevron-down cw_chevron_icon" aria-hidden="true" />
              </button>
              {isVoteTypeOpen && (
                <div className="cw_board_menu" role="listbox">
                  {VOTE_TYPE_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      className={`cw_board_option${voteType === opt ? ' active' : ''}`}
                      role="option"
                      aria-selected={voteType === opt}
                      onClick={() => { setVoteType(opt); setIsVoteTypeOpen(false) }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 투표 제목 */}
          <div className="cw_section cw_section_no_bottom_space">
            <Input
              className="cw_title_input"
              value={voteTitle}
              onChange={setVoteTitle}
              placeholder="투표 제목을 입력해 주세요."
            />
          </div>

          {/* 투표 내용 */}
          <div
            className="cw_section cw_section_no_bottom_space cw_content_section"
            style={{ backgroundImage: `url(${communityWriteBg})` }}
          >
            <Input
              className="cw_content_textarea"
              value={voteContent}
              onChange={setVoteContent}
              placeholder={'사소한 고민부터 진지한 고민까지, 무엇이든 남겨보세요.\n예) 목줄끼고 산책 하시나요, 안 하시나요?'}
              multiline
              rows={4}
            />
          </div>

          {/* 투표 기간 */}
          <div className="vw_duration_row">
            <span className="vw_duration_label">투표 기간</span>
            {VOTE_DURATION_OPTIONS.map((day) => (
              <button
                key={day}
                type="button"
                className={`vw_duration_btn${voteDuration === day ? ' active' : ''}`}
                onClick={() => setVoteDuration(day)}
              >
                <i
                  className={`bx ${voteDuration === day ? 'bxs-check-circle' : 'bx-check-circle'} vw_duration_check_icon`}
                  aria-hidden="true"
                />
                {day}일
              </button>
            ))}
          </div>

          {/* 투표 항목 — 사진 투표 */}
          {voteType === '사진 투표' && (
            <div className="vw_items_section">
              <strong className="vw_items_title">투표 항목</strong>
              {voteItems.map((item, i) => (
                <div key={item.id} className="vw_item">
                  <button
                    type="button"
                    className="vw_item_image_btn"
                    onClick={() => voteItemFileRefs.current[i]?.click()}
                  >
                    {item.image
                      ? <img src={item.image} alt="" className="vw_item_image_preview" />
                      : <span className="vw_item_image_plus">+</span>}
                  </button>
                  <input
                    ref={(el) => { voteItemFileRefs.current[i] = el }}
                    type="file"
                    accept="image/*"
                    className="cw_hidden_input"
                    onChange={handleVoteItemImageChange(i)}
                  />
                  <div className="vw_item_label_row">
                    <Input
                      className="vw_item_label_input"
                      value={item.label}
                      onChange={(v) => setVoteItems((prev) => prev.map((it, j) => j === i ? { ...it, label: v } : it))}
                      placeholder="내용을 입력해 주세요."
                    />
                    <button
                      type="button"
                      className="vw_item_clear_btn"
                      onClick={() => setVoteItems((prev) => prev.map((it, j) => j === i ? { ...it, label: '' } : it))}
                      aria-label="내용 지우기"
                    >
                      <i className="bx bxs-x-circle" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 투표 항목 — OX */}
          {voteType === 'OX' && (
            <div className="vw_items_section">
              <strong className="vw_items_title">투표 항목</strong>
              <div className="vw_ox_grid">
                <div className="vw_ox_item">
                  <img src={voteOIcon} alt="O" className="vw_ox_icon" />
                </div>
                <div className="vw_ox_item">
                  <img src={voteXIcon} alt="X" className="vw_ox_icon" />
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      <footer>
        <div className="cw_action_row">
          <button type="button" className="p_regular">
            <img src={imageIcon} className="cw_action_icon" alt="" />
            사진
          </button>
          <button type="button" className="p_regular">
            <img src={peopleIcon} className="cw_action_icon" alt="" />
            투표
          </button>
        </div>
      </footer>

      {isVoteConfirmOpen && (
        <ConfirmDialog
          message="투표를 등록할까요?"
          description="투표 게시글은 작성 후 수정할 수 없고 삭제만 가능해요."
          cancelLabel="취소"
          confirmLabel="확인"
          onCancel={() => setIsVoteConfirmOpen(false)}
          onConfirm={handleVoteConfirm}
        />
      )}
    </>
  )
}

export default VoteWrite
