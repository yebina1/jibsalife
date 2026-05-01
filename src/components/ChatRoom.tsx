import { useState } from 'react'
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
            <p>{chatMessage.text}</p>
            {chatMessage.sender === 'bot' && (
              <span className="chat_message_help">{helpText}</span>
            )}
          </div>
        ))}
      </div>

      <form className="chat_room_form" onSubmit={handleSubmit}>
        <input
          aria-label={inputAriaLabel}
          placeholder={placeholder}
          type="text"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />
        <button type="submit">{submitLabel}</button>
      </form>
    </section>
  )
}

export default ChatRoom
