-- Drop existing tables if they exist
drop table if exists public.projects cascade;
drop table if exists public.testimonials cascade;

-- Create projects table
create table public.projects (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    title text not null,
    description text,
    image_url text,
    github_url text,
    live_url text,
    tags text[],
    user_id uuid references auth.users(id) on delete cascade not null
);

-- Enable RLS for projects
alter table public.projects enable row level security;

-- Create projects policies
create policy "Public can view projects" 
    on public.projects for select 
    using (true);

create policy "Authenticated users can create projects" 
    on public.projects for insert 
    to authenticated 
    with check (auth.uid() = user_id);

create policy "Users can update own projects" 
    on public.projects for update 
    using (auth.uid() = user_id);

create policy "Users can delete own projects" 
    on public.projects for delete 
    using (auth.uid() = user_id);

-- Create testimonials table
create table public.testimonials (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    name text not null,
    role text,
    company text,
    content text not null,
    image_url text,
    user_id uuid references auth.users(id) on delete cascade not null
);

-- Enable RLS for testimonials
alter table public.testimonials enable row level security;

-- Create testimonials policies
create policy "Public can view testimonials" 
    on public.testimonials for select 
    using (true);

create policy "Authenticated users can create testimonials" 
    on public.testimonials for insert 
    to authenticated 
    with check (auth.uid() = user_id);

create policy "Users can update own testimonials" 
    on public.testimonials for update 
    using (auth.uid() = user_id);

create policy "Users can delete own testimonials" 
    on public.testimonials for delete 
    using (auth.uid() = user_id);

-- Create or replace the updated_at trigger function
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

-- Create triggers
drop trigger if exists handle_projects_updated_at on public.projects;
create trigger handle_projects_updated_at
    before update on public.projects
    for each row
    execute function public.handle_updated_at();

drop trigger if exists handle_testimonials_updated_at on public.testimonials;
create trigger handle_testimonials_updated_at
    before update on public.testimonials
    for each row
    execute function public.handle_updated_at(); 