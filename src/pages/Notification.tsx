import { useState } from 'react'
import { useNavigate } from 'react-router'
import './Notification.css'
import BackButton from '../components/html/BackButton'
import HomeIndicator from '../components/HomeIndicator'
import bellIconImg from '../img/bell-icon.png'
import waitImg from '../img/wait-img.png'

const STORAGE_KEY = 'notification_read'

type NotificationItem = {
  id: number
  title: string
  content: string
  time: string
  isRead: boolean
  path: string
}

const notificationItems: NotificationItem[] = [
  {
    id: 1,
    title: '오늘의 챌린지 참여하고 포인트 받자!',
    content: '챌린지 참여 시 포인트를 받을 수 있어요.',
    time: '2시간 전',
    isRead: false,
    path: '/community/challenge',
  },
  {
    id: 2,
    title: '커뮤니티',
    content: '게시글에 댓글이 달렸어요.',
    time: '11시간 전',
    isRead: false,
    path: '/community',
  },
  {
    id: 3,
    title: '커뮤니티',
    content: '게시글에 댓글이 달렸어요.',
    time: '8시간 전',
    isRead: false,
    path: '/community',
  },
  {
    id: 4,
    title: '커뮤니티',
    content: '게시글에 댓글이 달렸어요.',
    time: '3일 전',
    isRead: true,
    path: '/community',
  },
]

function readInitialReadIds(): Set<number> {
  const initiallyRead = notificationItems
    .filter((item) => item.isRead)
    .map((item) => item.id)

  try {
    const stored = sessionStorage.getItem(STORAGE_KEY)
    const fromStorage: number[] = stored ? JSON.parse(stored) : []
    return new Set([...initiallyRead, ...fromStorage])
  } catch {
    return new Set(initiallyRead)
  }
}

function saveReadIds(ids: Set<number>) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]))
  } catch {
    // ignore storage errors
  }
}

function Notification() {
  const navigate = useNavigate()
  const [readIds, setReadIds] = useState<Set<number>>(readInitialReadIds)

  const handleItemClick = (item: NotificationItem) => {
    setReadIds((prev) => {
      if (prev.has(item.id)) return prev
      const next = new Set(prev)
      next.add(item.id)
      saveReadIds(next)
      return next
    })
    navigate(item.path)
  }

  return (
    <div className="notification_page">
      <div className="notification_header">
        <BackButton aria-label="뒤로가기" />
        <h1 className="notification_title">알림</h1>
      </div>

      <ul className="notification_list">
        {notificationItems.map((item) => (
          <li
            key={item.id}
            className={`notification_item${readIds.has(item.id) ? '' : ' is_unread'}`}
            onClick={() => handleItemClick(item)}
          >
            <img
              src={bellIconImg}
              alt=""
              aria-hidden="true"
              className="notification_icon"
            />
            <div className="notification_body">
              <p className="notification_item_title">{item.title}</p>
              <p className="notification_item_content">{item.content}</p>
            </div>
            <span className="notification_time">{item.time}</span>
          </li>
        ))}
      </ul>

      <div className="notification_empty">
        <p className="notification_empty_text">오늘도 반가운 소식을 기다리는 중!</p>
        <img
          src={waitImg}
          alt=""
          aria-hidden="true"
          className="notification_empty_img"
        />
      </div>

      <HomeIndicator />
    </div>
  )
}

export default Notification
