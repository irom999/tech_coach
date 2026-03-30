'use client'

import { useEffect, useState } from 'react'
import { ChatLog } from '@/types'

export default function HistoryPage() {
  const [logs, setLogs] = useState<ChatLog[]>([])
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/logs')
      .then((r) => r.json())
      .then(setLogs)
  }, [])

  if (logs.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500">
        まだ会話ログがありません
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">会話履歴</h1>
      {logs.map((log) => (
        <div
          key={log.id}
          className="bg-gray-900 rounded-xl p-4 cursor-pointer hover:bg-gray-800 transition-colors"
          onClick={() => setExpanded(expanded === log.id ? null : log.id)}
        >
          <div className="flex items-start justify-between gap-4">
            <p className="text-sm text-gray-100 line-clamp-2">{log.user_message}</p>
            <span className="text-xs text-gray-500 shrink-0">
              {new Date(log.created_at).toLocaleDateString('ja-JP')}
            </span>
          </div>
          {log.topics.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {log.topics.map((t) => (
                <span key={t} className="text-xs bg-blue-900 text-blue-300 px-2 py-0.5 rounded-full">
                  {t}
                </span>
              ))}
            </div>
          )}
          {expanded === log.id && (
            <div className="mt-4 space-y-3 border-t border-gray-700 pt-3">
              <div>
                <p className="text-xs text-gray-500 mb-1">あなた</p>
                <p className="text-sm text-gray-200 whitespace-pre-wrap">{log.user_message}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">AI ({log.model})</p>
                <p className="text-sm text-gray-300 whitespace-pre-wrap">{log.assistant_message}</p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
