'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Loader2 } from 'lucide-react'
import { Message } from '@/types'

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async () => {
    if (!input.trim() || loading) return

    const userMsg: Message = { role: 'user', content: input }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setMessages([...newMessages, { role: 'assistant', content: data.message }])
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'エラーが発生しました'
      setMessages([...newMessages, { role: 'assistant', content: `エラー: ${msg}` }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex-1 overflow-y-auto space-y-4 pb-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 py-20">
            技術的な質問をしてみましょう
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] rounded-xl px-4 py-3 text-sm whitespace-pre-wrap ${
                m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-100'
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 rounded-xl px-4 py-3">
              <Loader2 size={16} className="animate-spin text-gray-400" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2 pt-4 border-t border-gray-800">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              send()
            }
          }}
          placeholder="技術的な質問を入力... (Enterで送信)"
          rows={2}
          className="flex-1 bg-gray-800 text-gray-100 rounded-xl px-4 py-3 text-sm resize-none outline-none focus:ring-1 focus:ring-blue-500"
        />
        <button
          onClick={send}
          disabled={loading || !input.trim()}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl px-4 transition-colors"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  )
}
