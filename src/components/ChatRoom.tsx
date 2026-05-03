import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import './ChatRoom.css'

export type ChatMessage = {
  id: number
  sender: 'user' | 'bot'
  text: string
}

type ChatRoomProps = {
  initialMessages: ChatMessage[]
  placeholder: string
  submitLabel: string
  helpText: string
  ariaLabel: string
  inputAriaLabel: string
}

function ChatRoom({
  initialMessages,
  placeholder,
  submitLabel,
  helpText,
  ariaLabel,
  inputAriaLabel,
}: ChatRoomProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [message, setMessage] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'instant' })
  }, [messages])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedMessage = message.trim()
    if (!trimmedMessage) return

    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: Date.now(),
        sender: 'user',
        text: trimmedMessage,
      },
    ])
    setMessage('')
  }

  return (
    <section className="chat_room" aria-label={ariaLabel}>
      <div className="chat_room_messages">
        {messages.map((chatMessage) => (
          <div
            className={`chat_message chat_message_${chatMessage.sender}`}
            key={chatMessage.id}
          >
            <div className="chat_message_avatar" aria-hidden="true">
              {chatMessage.sender === 'bot' ? '✦' : '🐾'}
            </div>
            <div className="chat_message_content">
              <span className="chat_message_name">
                {chatMessage.sender === 'bot' ? 'AI' : '나'}
              </span>
              <div className="chat_message_bubble">
                <p>{chatMessage.text}</p>
                {chatMessage.sender === 'bot' && (
                  <span className="chat_message_help">{helpText}</span>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form className="chat_room_form" onSubmit={handleSubmit}>
        <input
          aria-label={inputAriaLabel}
          placeholder={placeholder}
          type="text"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />
        <button type="submit" aria-label={submitLabel}>
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </form>
    </section>
  )
}

export default ChatRoom
