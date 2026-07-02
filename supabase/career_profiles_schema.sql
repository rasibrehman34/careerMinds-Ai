-- Create career_profiles table
create table if not exists public.career_profiles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null unique,
  education text,
  semester text,
  degree text,
  career_goal text,
  current_skills jsonb default '[]'::jsonb,
  interests jsonb default '[]'::jsonb,
  preferred_work jsonb default '[]'::jsonb,
  experience_level text,
  current_learning jsonb default '[]'::jsonb,
  bio text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.career_profiles enable row level security;

-- Create policies
create policy "Users can view their own career profile" 
on public.career_profiles for select 
using (auth.uid() = user_id);

create policy "Users can insert their own career profile" 
on public.career_profiles for insert 
with check (auth.uid() = user_id);

create policy "Users can update their own career profile" 
on public.career_profiles for update 
using (auth.uid() = user_id);

-- Create updated_at trigger function if it doesn't exist
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Add trigger for updated_at
drop trigger if exists set_career_profiles_updated_at on public.career_profiles;
create trigger set_career_profiles_updated_at
  before update on public.career_profiles
  for each row
  execute procedure public.handle_updated_at();
