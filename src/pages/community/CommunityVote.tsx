import './Community.css'
import './CommunityVote.css'
import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import PageHeader from '../../components/PageHeader'
import HeaderIcon from '../../components/HeaderIcon'
import Title from '../../components/Title'
import Button from '../../components/html/Button'
import FloatingWriteButton from '../../components/FloatingWriteButton'
import VoteMissionBanner from '../../components/VoteMissionBanner'
import OxVoteOptions from '../../components/OxVoteOptions'
import crownIcon from '../../svg/crown.svg'
import timerIcon from '../../svg/timer.svg'
import timerClosedIcon from '../../svg/timer_closed.svg'
import { readVotedMissionIds } from '../../utils/communityVoteStatus'
import { missionVotes, regularVoteItems } from './CommunityVoteData'
import { readUserVotes, calcDeadlineText, type UserVote } from '../../utils/savedVotes'

const topTabs = ['전체', '펫스토리', '챌린지', '투표'] as const
const topTabRoutes: Record<string, string> = {
  전체: '/community/overview',
  펫스토리: '/community/petstory',
  챌린지: '/community/challenge',
  투표: '/community/vote',
}

type VoteSort = 'latest' | 'popular' | 'deadline'

function parseDeadline(deadline: string) {
  const match = deadline.match(/(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일/)
  if (!match) return Number.POSITIVE_INFINITY

  const [, year, month, day] = match
  return new Date(Number(year), Number(month) - 1, Number(day)).getTime()
}

function CommunityVote() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const sort = (searchParams.get('sort') ?? 'latest') as VoteSort
  const sub = searchParams.get('sub') ?? 'all'
  const showMission = sub === 'all' || sub === 'mission'
  const showRegular = sub === 'all' || sub === 'regular'
  const showResult = sub === 'all' || sub === 'result'
  const [votedIds] = useState(() => readVotedMissionIds())
  const [savedVotes] = useState<UserVote[]>(() => readUserVotes())
  const [voteSelections, setVoteSelections] = useState<Record<number, number>>({})
  const [localVotedIds, setLocalVotedIds] = useState<Set<number>>(new Set())
  const sortedRegularVoteItems = useMemo(() => {
    return [...regularVoteItems].sort((a, b) => {
      if (sort === 'popular') {
        return b.participants - a.participants || b.id - a.id
      }

      if (sort === 'deadline') {
        return parseDeadline(a.deadline) - parseDeadline(b.deadline) || b.id - a.id
      }

      return b.id - a.id
    })
  }, [sort])

  const activeMissionVotes = missionVotes.filter(v => v.buttonType !== 'result')
  const resultMissionVotes = missionVotes.filter(v => v.buttonType === 'result')
  const activeRegularItems = sortedRegularVoteItems.filter(item => !('resultOnly' in item && item.resultOnly))
  const resultRegularItems = sortedRegularVoteItems.filter(item => 'resultOnly' in item && item.resultOnly)

  const openMissionVote = (voteId: string) => {
    navigate(`/community/vote/detail?voteId=${voteId}`)
  }

  return (
    <>
      <PageHeader
        title="집사인생"
        rightContent={
          <>
            <Button type="button" aria-label="검색" className="community_header_search">
              <HeaderIcon type="search" />
            </Button>
            <Button type="button" aria-label="calendar" onClick={() => navigate('/mission')}>
              <HeaderIcon type="calendar" />
            </Button>
            <Button type="button" aria-label="notification" onClick={() => navigate('/notification')}>
              <HeaderIcon type="notification" />
            </Button>
          </>
        }
      />

      <main className="page cv2_page">
        <VoteMissionBanner
          className="cps_vote_banner"
          backgroundColor="#FFD6D9"
          timerColor="#E03C3C"
          timeText="02:18:35 남음"
          title={<>멍스타 모델 도전</>}
          description="내 반려동물을 스타로!"
        />
        {/* 탭 바 */}
        <section className="community_tab_bar" aria-label="커뮤니티 상위 카테고리">
          {topTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              className={tab === '투표' ? 'active' : ''}
              onClick={() => navigate(topTabRoutes[tab])}
            >
              {tab}
            </button>
          ))}
        </section>

        {showMission && <section className="cv2_section">
          <Title
            as="h4"
            className="cv2_section_title"
            beforeTitle={<img src={crownIcon} alt="" className="cv2_crown" aria-hidden="true" />}
            title={missionVotes[0].sectionTitle}
          />
          <div className="cv2_mission_cards">
          {activeMissionVotes.map((vote) => (
            <div key={vote.id} className="cv2_mission_card">
              <Title
                as="h5"
                className="cv2_mission_card_body"
                beforeTitle={
                  <span className={`cv2_timer ${vote.buttonType === 'notify' ? 'cv2_timer_closed' : 'cv2_timer_active'}`}>
                    <img src={vote.buttonType === 'notify' ? timerClosedIcon : timerIcon} alt="" aria-hidden="true" />
                    {vote.timeText}
                  </span>
                }
                title={vote.title}
              >
                <p>
                  {vote.organizer} <span className="cv2_divider">|</span>{' '}
                  {vote.subText ?? `참여자 수 ${vote.participants}명`}
                </p>
              </Title>
              {vote.buttonType === 'notify' ? (
                <button type="button" className="cv2_outline_btn">
                  알림받기
                </button>
              ) : (
                <button
                  type="button"
                  className={votedIds.includes(vote.id) ? 'cv2_outline_btn' : 'cv2_vote_btn'}
                  onClick={() => openMissionVote(vote.id)}
                >
                  {votedIds.includes(vote.id) ? '수정하기' : '투표하기'}
                </button>
              )}
            </div>
          ))}
          </div>
        </section>}

        {showResult && <section className="cv2_section cv2_past_section">
          <Title as="h4" className="cv2_section_title" title="투표 결과" />
          <div className="cv2_past_cards">
          <div className="cv2_mission_card">
            <Title
              as="h5"
              className="cv2_mission_card_body"
              beforeTitle={
                <span className="cv2_timer cv2_timer_closed">
                  <img src={timerIcon} alt="" aria-hidden="true" />
                  투표 종료
                </span>
              }
              title="밥 먹는 사진 중 BEST를 골라주세요!"
            >
              <p>운영자 <span className="cv2_divider">|</span> 참여자 수 22명</p>
            </Title>
            <button type="button" className="cv2_result_btn" onClick={() => navigate('/community/vote/result')}>
              결과보기
            </button>
          </div>
          {resultMissionVotes.map((vote) => (
            <div key={vote.id} className="cv2_mission_card">
              <Title
                as="h5"
                className="cv2_mission_card_body"
                beforeTitle={
                  <span className="cv2_timer cv2_timer_closed">
                    <img src={timerIcon} alt="" aria-hidden="true" />
                    {vote.timeText}
                  </span>
                }
                title={vote.title}
              >
                <p>
                  {vote.organizer} <span className="cv2_divider">|</span>{' '}
                  {vote.subText ?? `참여자 수 ${vote.participants}명`}
                </p>
              </Title>
              <button type="button" className="cv2_result_btn">결과보기</button>
            </div>
          ))}
          <div className="cv2_regular_list">
            {resultRegularItems.map((item) => (
              <div key={item.id} className="cv2_regular_item">
                <Title as="h5" className="cv2_regular_body" title={item.title}>
                  <p>{item.description}</p>
                  <p className="cv2_regular_meta">
                    {item.deadline} <span className="cv2_divider">|</span> 참여자 수 {item.participants}명
                  </p>
                </Title>
                <button type="button" className="cv2_result_btn" disabled>
                  결과보기
                </button>
              </div>
            ))}
          </div>
          </div>
        </section>}

        {showRegular && <section className="cv2_section">
          <Title as="h4" className="cv2_section_title" title="일반 투표" />
          <div className="cv2_regular_list">
            {savedVotes.map((vote) => {
              const sel = voteSelections[vote.id]
              const voted = localVotedIds.has(vote.id)
              const deadline = calcDeadlineText(vote.createdAt, vote.voteDuration)
              const hasImages = vote.voteItems.some(it => it.image !== null)
              const hasLabels = vote.voteType === '사진 투표' && vote.voteItems.some(it => it.label.trim() !== '')

              const handleSelect = (itemId: number) => setVoteSelections(prev => ({ ...prev, [vote.id]: itemId }))
              const handleSubmit = () => { if (sel !== undefined) setLocalVotedIds(prev => new Set([...prev, vote.id])) }
              const handleDirectVote = (itemId: number) => {
                setVoteSelections(prev => ({ ...prev, [vote.id]: itemId }))
                setLocalVotedIds(prev => new Set([...prev, vote.id]))
              }

              return (
                <div key={vote.id} className="uvote_card">
                  <div className="uvote_card_header">
                    <p className="uvote_card_title">{vote.title}</p>
                    {vote.content && <p className="uvote_card_desc">{vote.content}</p>}
                  </div>

                  {/* 텍스트만 (이미지 없음) → 뼈다귀 카드 */}
                  {vote.voteType === '사진 투표' && !hasImages && (
                    <div className="uvote_bone_wrap">
                      <div className="uvote_bone_shape">
                        <div className="uvote_bone_cap" />
                        <div className="uvote_bone_bar" />
                        <div className="uvote_bone_cap" />
                      </div>
                      <div className="uvote_bone_labels">
                        <button
                          type="button"
                          className={`uvote_bone_option${sel === vote.voteItems[0]?.id ? ' selected' : ''}`}
                          onClick={() => handleDirectVote(vote.voteItems[0].id)}
                        >
                          {vote.voteItems[0]?.label}
                        </button>
                        <span className="uvote_bone_vs">vs</span>
                        <button
                          type="button"
                          className={`uvote_bone_option${sel === vote.voteItems[1]?.id ? ' selected' : ''}`}
                          onClick={() => handleDirectVote(vote.voteItems[1].id)}
                        >
                          {vote.voteItems[1]?.label}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* 이미지 있는 사진 투표 → 사진 그리드 */}
                  {vote.voteType === '사진 투표' && hasImages && (
                    <div className="uvote_photo_grid">
                      {vote.voteItems.map(item => {
                        const isSelected = sel === item.id
                        return (
                          <button
                            key={item.id}
                            type="button"
                            className={`uvote_photo_option${isSelected ? ' selected' : ''}`}
                            onClick={() => {
                              handleSelect(item.id)
                              if (!hasLabels) handleDirectVote(item.id)
                            }}
                          >
                            <img src={item.image!} alt={item.label} className="uvote_photo_img" />
                            {hasLabels && (
                              <span className="uvote_photo_label_row">
                                <span className="uvote_photo_label">{item.label}</span>
                                <span className={`uvote_photo_radio${isSelected ? ' checked' : ''}`} />
                              </span>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  )}

                  {vote.voteType === '사진 투표' && hasImages && hasLabels && (
                    <button type="button" className="uvote_submit_btn" disabled={sel === undefined} onClick={handleSubmit}>
                      {voted ? '수정하기' : '투표하기'}
                    </button>
                  )}

                  {vote.voteType === 'OX' && (
                    <OxVoteOptions
                      selectedId={sel === 1 || sel === 2 ? sel : null}
                      onSelect={(id) => {
                        handleSelect(id)
                        setLocalVotedIds(prev => new Set([...prev, vote.id]))
                      }}
                    />
                  )}


                  <p className="uvote_meta">{deadline} <span className="cv2_divider">|</span> 참여자 수 0명</p>
                </div>
              )
            })}

            {activeRegularItems.map((item) => (
              <div key={item.id} className="cv2_regular_item">
                <Title as="h5" className="cv2_regular_body" title={item.title}>
                  <p>{item.description}</p>
                  <p className="cv2_regular_meta">
                    {item.deadline} <span className="cv2_divider">|</span> 참여자 수 {item.participants}명
                  </p>
                </Title>
                <button
                  type="button"
                  className={
                    item.done
                      ? 'cv2_done_btn'
                      : 'modified' in item && item.modified
                        ? 'cv2_outline_btn'
                        : 'cv2_vote_btn'
                  }
                  disabled
                >
                  {item.done
                    ? '투표완료'
                    : 'modified' in item && item.modified
                      ? '수정하기'
                      : '투표하기'}
                </button>
              </div>
            ))}
          </div>
        </section>}
      </main>
      <FloatingWriteButton showMenu />
    </>
  )
}

export default CommunityVote
