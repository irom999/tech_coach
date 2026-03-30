'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const login = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      router.push('/')
      router.refresh()
    } else {
      setError('パスワードが違います')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <Lock size={32} className="text-blue-400" />
          </div>
          <h1 className="text-xl font-semibold">TechCoach</h1>
          <p className="text-sm text-gray-400">パスワードを入力してください</p>
        </div>

        <form onSubmit={login} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="パスワード"
            autoFocus
            className="w-full bg-gray-800 rounded-lg px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-blue-500"
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading || !password}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : 'ログイン'}
          </button>
        </form>
      </div>
    </div>
  )
}
