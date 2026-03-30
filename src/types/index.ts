export interface Message {
  role: 'user' | 'assistant'
  content: string
}

export interface ChatLog {
  id: string
  user_message: string
  assistant_message: string
  model: string
  topics: string[]
  created_at: string
}
