import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TechCoach',
  description: 'AIとの会話から技術学習をトラッキング',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className={`${geist.className} bg-gray-950 text-gray-100 min-h-screen`}>
        <Navigation />
        <main className="max-w-4xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  )
}
