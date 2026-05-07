import './Community.css'
import './CommunityVoteDetail.css'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import PageHeader from '../components/PageHeader'
import HeaderIcon from '../components/HeaderIcon'
import Alert from '../components/Alert'
import BackButton from '../components/html/BackButton'
import Button from '../components/html/Button'
import voting1 from '../img/voting/voting1.jpg'
import voting2 from '../img/voting/voting2.jpg'
import voting3 from '../img/voting/voting3.jpg'
import voting4 from '../img/voting/voting4.jpg'
import voting5 from '../img/voting/voting5.jpg'
import voting6 from '../img/voting/voting6.jpg'

const candidates = [
  { id: 1, name: '콩이', image: voting1 },
  { id: 2, name: '공심이', image: voting2 },
  { id: 3, name: '뽕뽕이', image: voting3 },
  { id: 4, name: '도라바라', image: voting4 },
  { id: 5, name: '봉봉이', image: voting5 },
  { id: 6, name: '훈민정음', image: voting6 },
  { id: 7, name: '콩이', image: voting1 },
  { id: 8, name: '콩이', image: voting2 },
  { id: 9, name: '콩이', image: voting3 },
  { id: 10, name: '콩이', image: voting4 },
] as const

function CommunityVoteDetail() {
  const navigate = useNavigate()
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [isVoteCompleteOpen, setIsVoteCompleteOpen] = useState(false)

  const handleVote = () => {
    if (selectedId === null) return
    setIsVoteCompleteOpen(true)
  }

  const goToResult = () => {
    setIsVoteCompleteOpen(false)
    navigate('/community/vote/result')
  }

  return (
    <>
      <PageHeader
        title="집사인생"
        leftContent={<BackButton />}
        rightContent={
          <>
            <Button type="button" aria-label="검색" className="community_header_search">
              <HeaderIcon type="search" />
            </Button>
            <Button type="button" aria-label="calendar" onClick={() => navigate('/mission')}>
              <HeaderIcon type="calendar" />
            </Button>
            <Button type="button" aria-label="notification" className="community_header_notification">
              <HeaderIcon type="notification" />
            </Button>
          </>
        }
      />

      <main className="page cvd_page">
        {/* 탭 바 */}
        <section className="community_tab_bar" aria-label="커뮤니티 상위 카테고리">
          {(['전체', '펫스토리', '챌린지', '투표'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              className={tab === '투표' ? 'active' : ''}
              onClick={() => {
                if (tab === '전체') navigate('/community/overview')
                else if (tab === '펫스토리') navigate('/community/pet-story')
                else if (tab === '챌린지') navigate('/community/challenge')
                else navigate('/community/vote')
              }}
            >
              {tab}
            </button>
          ))}
        </section>

        {/* 미션 헤더 배너 */}
        <div className="cvd_banner">
          <div className="cvd_banner_text">
            <span className="cvd_banner_timer">
              <i className="bx bx-time-five" aria-hidden="true" />
              7시간 남음
            </span>
            <h2 className="cvd_banner_title">
              5월 3주차 멍스타<br />미션 투표
            </h2>
            <p className="cvd_banner_desc">밥 먹는 사진 중 BEST를 골라주세요!</p>
          </div>
          <img src={voting1} alt="" className="cvd_banner_img" aria-hidden="true" />
        </div>

        {/* 투표 후보 목록 */}
        <section className="cvd_vote_section">
          <h2 className="cvd_vote_title">오늘의 Best 포즈는?</h2>
          <p className="cvd_vote_desc">가장 포즈가 돋보이는 것을 골라주세요.</p>

          <div className="cvd_grid">
            {candidates.map((item) => {
              const isSelected = selectedId === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`cvd_candidate${isSelected ? ' selected' : ''}`}
                  onClick={() => setSelectedId(item.id)}
                >
                  <div className="cvd_candidate_img_wrap">
                    <img src={item.image} alt={item.name} className="cvd_candidate_img" />
                  </div>
                  <div className="cvd_candidate_footer">
                    <span className="cvd_candidate_name">{item.name}</span>
                    <span className={`cvd_candidate_check${isSelected ? ' checked' : ''}`} aria-hidden="true">
                      <svg viewBox="0 0 20 20" fill="none">
                        <circle cx="10" cy="10" r="10" fill={isSelected ? '#6D59F8' : '#E5E5EC'} />
                        <path d="M6 10.5l3 3 5-5.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </section>

        {/* 투표하기 버튼 */}
        <div className="cvd_btn_wrap">
          <Button
            type="button"
            className="purple_btn"
            disabled={selectedId === null}
            onClick={handleVote}
          >
            투표하기
          </Button>
        </div>
      </main>

      {isVoteCompleteOpen ? (
        <Alert onClose={() => setIsVoteCompleteOpen(false)}>
          <div className="cvd_complete_alert">
            <div className="cvd_complete_icon" aria-hidden="true">
              <svg viewBox="0 0 48 48" focusable="false">
                <path d="M15 25.2 21.2 31.4 34 18.6" />
              </svg>
            </div>
            <div className="cvd_complete_copy">
              <strong>투표 완료!</strong>
              <p>결과 발표 페이지에서 순위를 확인해보세요.</p>
            </div>
            <Button type="button" className="purple_btn" onClick={goToResult}>
              확인
            </Button>
          </div>
        </Alert>
      ) : null}
    </>
  )
}

export default CommunityVoteDetail
