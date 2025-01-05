-- Create projects table
create table projects (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  description text,
  image_url text,
  github_url text,
  live_url text,
  user_id uuid references auth.users not null,
  tags text[] default array[]::text[],
  featured boolean default false,
  published boolean default false
);

-- Enable RLS
alter table projects enable row level security;

-- Create RLS policies
create policy "Public projects are viewable by everyone"
on projects for select using (published = true);

create policy "Users can view all their own projects"
on projects for select using (auth.uid() = user_id);

create policy "Users can create their own projects"
on projects for insert with check (auth.uid() = user_id);

create policy "Users can update their own projects"
on projects for update using (auth.uid() = user_id);

create policy "Users can delete their own projects"
on projects for delete using (auth.uid() = user_id);

-- Create updated_at trigger
create function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_projects_updated_at
  before update on projects
  for each row
  execute function update_updated_at_column(); 