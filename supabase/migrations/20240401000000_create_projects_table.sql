-- Drop existing table if it exists
drop table if exists public.projects cascade;

create table public.projects (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    title text not null,
    description text,
    image_url text,
    github_url text,
    live_url text,
    tags text[] default array[]::text[],
    featured boolean default false,
    published boolean default false,
    user_id uuid references auth.users(id) on delete cascade not null
);

-- Enable RLS
alter table public.projects enable row level security;

-- Drop existing policies if they exist
drop policy if exists "Users can create their own projects" on public.projects;
drop policy if exists "Users can view their own projects" on public.projects;
drop policy if exists "Anyone can view published projects" on public.projects;
drop policy if exists "Users can update their own projects" on public.projects;
drop policy if exists "Users can delete their own projects" on public.projects;

-- Create a default policy that allows authenticated users to manage their own data
create policy "Enable all access for authenticated users"
    on public.projects
    to authenticated
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

-- Create a separate policy for public read access
create policy "Allow public read access for published projects"
    on public.projects
    for select
    to public
    using (published = true);

-- Create updated_at trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

create trigger handle_projects_updated_at
    before update on public.projects
    for each row
    execute function public.handle_updated_at(); 