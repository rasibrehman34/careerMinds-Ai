-- Create a table for chat history
create table chat_history (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null default 'New Conversation',
  first_message text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table chat_history enable row level security;

-- Policies
create policy "Users can view their own chat history." on chat_history
  for select using (auth.uid() = user_id);

create policy "Users can insert their own chat history." on chat_history
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own chat history." on chat_history
  for update using (auth.uid() = user_id);

create policy "Users can delete their own chat history." on chat_history
  for delete using (auth.uid() = user_id);

-- Optional: Create an index on user_id for faster lookups
create index idx_chat_history_user_id on chat_history(user_id);
