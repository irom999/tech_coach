-- チャットログテーブル
create table chat_logs (
  id uuid default gen_random_uuid() primary key,
  user_message text not null,
  assistant_message text not null,
  provider text not null,
  model text not null,
  topics text[] default '{}',
  created_at timestamp with time zone default now()
);

-- 設定テーブル（AIプロバイダー・モデルの選択のみ。APIキーはサーバー環境変数で管理）
create table settings (
  id uuid default gen_random_uuid() primary key,
  preferred_provider text default 'openai',
  preferred_model text default 'gpt-4o',
  updated_at timestamp with time zone default now()
);
