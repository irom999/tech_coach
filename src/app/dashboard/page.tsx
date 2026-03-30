'use client'

import { useEffect, useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid,
} from 'recharts'
import { ChatLog } from '@/types'

export default function DashboardPage() {
  const [logs, setLogs] = useState<ChatLog[]>([])

  useEffect(() => {
    fetch('/api/logs')
      .then((r) => r.json())
      .then(setLogs)
  }, [])

  // トピック別の質問数集計
  const topicCounts: Record<string, number> = {}
  logs.forEach((log) => {
    log.topics.forEach((t) => {
      topicCounts[t] = (topicCounts[t] ?? 0) + 1
    })
  })
  const topicData = Object.entries(topicCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([topic, count]) => ({ topic, count }))

  // 日別の質問数集計
  const dailyCounts: Record<string, number> = {}
  logs.forEach((log) => {
    const date = new Date(log.created_at).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })
    dailyCounts[date] = (dailyCounts[date] ?? 0) + 1
  })
  const dailyData = Object.entries(dailyCounts)
    .slice(-14)
    .map(([date, count]) => ({ date, count }))

  if (logs.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500">
        まだデータがありません。チャットで質問してみましょう。
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <h1 className="text-xl font-semibold">学習ダッシュボード</h1>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-900 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-blue-400">{logs.length}</p>
          <p className="text-sm text-gray-400 mt-1">総質問数</p>
        </div>
        <div className="bg-gray-900 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-green-400">{Object.keys(topicCounts).length}</p>
          <p className="text-sm text-gray-400 mt-1">学習トピック数</p>
        </div>
        <div className="bg-gray-900 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-purple-400">
            {new Set(logs.map((l) => new Date(l.created_at).toDateString())).size}
          </p>
          <p className="text-sm text-gray-400 mt-1">学習日数</p>
        </div>
      </div>

      {topicData.length > 0 && (
        <div className="bg-gray-900 rounded-xl p-6">
          <h2 className="text-sm font-medium text-gray-400 mb-4">よく聞いたトピック</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={topicData} layout="vertical">
              <XAxis type="number" tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <YAxis dataKey="topic" type="category" width={100} tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <Tooltip
                contentStyle={{ background: '#1f2937', border: 'none', borderRadius: 8, color: '#f3f4f6' }}
              />
              <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {dailyData.length > 0 && (
        <div className="bg-gray-900 rounded-xl p-6">
          <h2 className="text-sm font-medium text-gray-400 mb-4">直近の学習量（日別）</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" tick={{ fill: '#9ca3af', fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <Tooltip
                contentStyle={{ background: '#1f2937', border: 'none', borderRadius: 8, color: '#f3f4f6' }}
              />
              <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="bg-gray-900 rounded-xl p-6">
        <h2 className="text-sm font-medium text-gray-400 mb-4">学習済みトピック</h2>
        <div className="flex flex-wrap gap-2">
          {Object.entries(topicCounts)
            .sort((a, b) => b[1] - a[1])
            .map(([topic, count]) => (
              <span
                key={topic}
                className="bg-blue-900 text-blue-300 px-3 py-1 rounded-full text-sm"
              >
                {topic} <span className="text-blue-500">{count}</span>
              </span>
            ))}
        </div>
      </div>
    </div>
  )
}
