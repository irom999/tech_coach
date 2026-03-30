import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { getSupabase } from '@/lib/supabase'
import { Message } from '@/types'

const techKeywords = [
  'React', 'Next.js', 'TypeScript', 'JavaScript', 'Python', 'Docker', 'Kubernetes',
  'AWS', 'GCP', 'Azure', 'SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis',
  'Git', 'CI/CD', 'REST', 'GraphQL', 'API', 'Node.js', 'Express', 'FastAPI',
  'CSS', 'Tailwind', 'HTML', 'Linux', 'Bash', 'Terraform', 'Rust', 'Go',
  'Java', 'C++', 'C#', '.NET', 'Vue', 'Angular', 'Svelte', 'WebSocket',
  '認証', 'セキュリティ', 'パフォーマンス', 'テスト', 'デプロイ', 'インフラ',
]

function extractTopics(text: string): string[] {
  return techKeywords.filter((kw) => text.toLowerCase().includes(kw.toLowerCase()))
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json() as { messages: Message[] }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) return NextResponse.json({ error: 'OpenAI APIキーが設定されていません' }, { status: 500 })

    const model = process.env.OPENAI_MODEL ?? 'gpt-4o'
    const openai = new OpenAI({ apiKey })

    const response = await openai.chat.completions.create({
      model,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    })

    const assistantMessage = response.choices[0].message.content ?? ''
    const userMessage = messages[messages.length - 1].content
    const topics = extractTopics(userMessage)

    const { error: dbError } = await getSupabase().from('chat_logs').insert({
      user_message: userMessage,
      assistant_message: assistantMessage,
      provider: 'openai',
      model,
      topics,
    })
    if (dbError) console.error('Supabase insert error:', dbError)

    return NextResponse.json({ message: assistantMessage })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'エラーが発生しました' }, { status: 500 })
  }
}
