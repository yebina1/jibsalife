import './mypage.css'
import calendarIcon from '../svg/calendar.svg'
import notificationIcon from '../svg/notification.svg'

const topShortcuts = [
  { id: 1, label: '활동 내역', icon: 'bars' },
  { id: 2, label: 'AI', icon: 'spark' },
  { id: 3, label: '가족 정보', icon: 'pet' },
  { id: 4, label: '인스타그램', icon: 'camera' },
]

const counters = [
  { id: 1, label: '구독' },
  { id: 2, label: '쿠폰' },
  { id: 3, label: '포인트' },
  { id: 4, label: '게시글' },
]

const sections = [
  {
    title: '활동내역',
    items: ['미션 수행 내역', '뱃지 획득 내역'],
  },
  {
    title: '북마크',
    items: ['장소', '게시글', '제품저장', '커뮤니티 북마크 내역'],
  },
  {
    title: '설정',
    items: ['알림 설정', '개인정보 설정', '앱 환경 설정'],
  },
  {
    title: '고객센터',
    items: ['FAQ', '문의하기', '공지사항'],
  },
  {
    title: '회사소개',
    items: ['서비스 소개', '개인정보처리방침', '이용약관'],
  },
]

function ShortcutIcon({ type }: { type: string }) {
  if (type === 'bars') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 18h16v2H4Zm2-5h3v4H6Zm5-7h3v11h-3Zm5 3h3v8h-3Z" />
      </svg>
    )
  }

  if (type === 'spark') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m12 2 1.3 3.7L17 7l-3.7 1.3L12 12l-1.3-3.7L7 7l3.7-1.3Zm-6.5 9 1 2.5L9 14.5 6.5 15.5 5.5 18l-1-2.5L2 14.5l2.5-1ZM18.5 11l1 2.5 2.5 1-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1ZM12 13c-2.8 0-5 2.2-5 5v1h2v-1c0-1.7 1.3-3 3-3s3 1.3 3 3v1h2v-1c0-2.8-2.2-5-5-5Z" />
      </svg>
    )
  }

  if (type === 'pet') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 10a2 2 0 1 0-2-2 2 2 0 0 0 2 2Zm10 0a2 2 0 1 0-2-2 2 2 0 0 0 2 2ZM5 15a2 2 0 1 0-2-2 2 2 0 0 0 2 2Zm14 0a2 2 0 1 0-2-2 2 2 0 0 0 2 2Zm-7-3c-3 0-5 2.1-5 4.6 0 1.5 1.2 2.4 2.7 2.4 1 0 1.6-.4 2.3-.9.7.5 1.3.9 2.3.9 1.5 0 2.7-.9 2.7-2.4C17 14.1 15 12 12 12Z" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm5 5.5A4.5 4.5 0 1 0 16.5 12 4.5 4.5 0 0 0 12 7.5Zm5.2-.9a1.1 1.1 0 1 0 1.1 1.1 1.1 1.1 0 0 0-1.1-1.1Z" />
    </svg>
  )
}

function SettingIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m19.4 13 .1-1-.1-1 2-1.6-2-3.4-2.4 1a7.8 7.8 0 0 0-1.7-1l-.4-2.6h-4l-.4 2.6a7.8 7.8 0 0 0-1.7 1l-2.4-1-2 3.4 2 1.6-.1 1 .1 1-2 1.6 2 3.4 2.4-1a7.8 7.8 0 0 0 1.7 1l.4 2.6h4l.4-2.6a7.8 7.8 0 0 0 1.7-1l2.4 1 2-3.4ZM12 15.5A3.5 3.5 0 1 1 15.5 12 3.5 3.5 0 0 1 12 15.5Z" />
    </svg>
  )
}

function MyPage() {
  return (
    <main className="page mypage_page">
      <section className="mypage_topbar" aria-label="마이페이지 상단">
        <button type="button" aria-label="calendar" className="mypage_icon_button">
          <img src={calendarIcon} alt="" />
        </button>
        <button type="button" aria-label="notification" className="mypage_icon_button mypage_notification">
          <img src={notificationIcon} alt="" />
        </button>
      </section>

      <section className="mypage_profile_card">
        <div className="mypage_profile_header">
          <h1>뿍지뿍지</h1>
          <button type="button">정보수정</button>
        </div>

        <div className="mypage_profile_body">
          <div className="mypage_avatar" aria-hidden="true" />

          <div className="mypage_stats">
            <div>
              <strong>0</strong>
              <span>게시글</span>
            </div>
            <div>
              <strong>0</strong>
              <span>댓글</span>
            </div>
            <div>
              <strong>0</strong>
              <span>댓글등급</span>
            </div>
            <div>
              <strong>0</strong>
              <span>뱃지</span>
            </div>
          </div>
        </div>

        <div className="mypage_location_card">
          <p>
            위치 정보를 등록하고
            <br />
            맞춤 서비스를 받아 보세요
          </p>
          <button type="button" className="mypage_location_button">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 14.5 9 2.5 2.5 0 0 1 12 11.5Z" />
            </svg>
            위치설정
          </button>
        </div>
      </section>

      <section className="mypage_shortcuts" aria-label="바로가기">
        {topShortcuts.map((item) => (
          <button type="button" key={item.id} className="mypage_round_menu">
            <span className="mypage_round_icon">
              <ShortcutIcon type={item.icon} />
            </span>
            <span>{item.label}</span>
          </button>
        ))}
      </section>

      <section className="mypage_counters" aria-label="카운터">
        {counters.map((item) => (
          <div key={item.id} className="mypage_counter_item">
            <span className="mypage_counter_dot" aria-hidden="true" />
            <span>{item.label}</span>
          </div>
        ))}
      </section>

      <div className="mypage_sections">
        {sections.map((section) => (
          <section key={section.title} className="mypage_section_block">
            <h2>{section.title}</h2>
            <ul>
              {section.items.map((item) => (
                <li key={item}>
                  <button type="button" className="mypage_list_button">
                    <span className="mypage_list_left">
                      <span className="mypage_list_icon">
                        <SettingIcon />
                      </span>
                      <span>{item}</span>
                    </span>
                    <span className="mypage_list_arrow" aria-hidden="true">
                      ›
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  )
}

export default MyPage
