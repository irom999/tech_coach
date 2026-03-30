'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MessageSquare, History, BarChart2 } from 'lucide-react'

const links = [
  { href: '/', label: 'チャット', icon: MessageSquare },
  { href: '/history', label: '履歴', icon: History },
  { href: '/dashboard', label: 'ダッシュボード', icon: BarChart2 },
]

export default function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-4xl mx-auto px-4 flex items-center gap-1 h-14">
        <span className="font-bold text-blue-400 mr-6 text-lg">TechCoach</span>
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
              pathname === href
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <Icon size={16} />
            {label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
