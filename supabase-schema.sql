-- Execute no SQL Editor do Supabase
create table if not exists public.app_state (
  user_id uuid not null references auth.users(id) on delete cascade,
  state_key text not null,
  state_value jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by text,
  primary key (user_id, state_key)
);
alter table public.app_state enable row level security;
drop policy if exists "Users manage own BMCenter state" on public.app_state;
create policy "Users manage own BMCenter state" on public.app_state
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
alter publication supabase_realtime add table public.app_state;
