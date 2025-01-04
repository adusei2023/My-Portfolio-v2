-- Create projects table
create table public.projects (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  description text,
  image_url text,
  github_url text,
  live_url text,
  tags text[],
  user_id uuid references auth.users(id) on delete cascade not null
);

-- Enable RLS
alter table public.projects enable row level security;

-- Create policies
create policy "Users can view all projects" 
  on public.projects for select 
  using (true);

create policy "Users can insert their own projects" 
  on public.projects for insert 
  with check (auth.uid() = user_id);

create policy "Users can update their own projects" 
  on public.projects for update 
  using (auth.uid() = user_id);

create policy "Users can delete their own projects" 
  on public.projects for delete 
  using (auth.uid() = user_id); 