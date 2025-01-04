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

-- Enable RLS
alter table public.projects enable row level security;

-- Create policies
create policy "Users can view all projects"
    on public.projects for select
    to authenticated
    using (true);

create policy "Users can create their own projects"
    on public.projects for insert
    to authenticated
    with check (auth.uid() = user_id);

create policy "Users can update their own projects"
    on public.projects for update
    to authenticated
    using (auth.uid() = user_id);

create policy "Users can delete their own projects"
    on public.projects for delete
    to authenticated
    using (auth.uid() = user_id);

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