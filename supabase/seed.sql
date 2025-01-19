-- Insert sample projects
INSERT INTO public.projects (title, description, tags, featured, published, user_id)
VALUES
  (
    'Portfolio Website',
    'A modern portfolio website built with Next.js and Supabase',
    ARRAY['nextjs', 'typescript', 'supabase', 'tailwind'],
    true,
    true,
    auth.uid()
  ),
  (
    'Task Manager',
    'A full-stack task management application with real-time updates',
    ARRAY['react', 'node', 'postgresql', 'websockets'],
    false,
    true,
    auth.uid()
  );

-- Insert sample profile
INSERT INTO public.profiles (id, full_name, bio)
VALUES (
  auth.uid(),
  'John Doe',
  'Full-stack developer passionate about building great user experiences'
);

-- Reset RLS
alter table public.projects disable row level security;
alter table public.projects enable row level security;

-- Recreate policies
drop policy if exists "Enable all access for authenticated users" on public.projects;
drop policy if exists "Allow public read access for published projects" on public.projects;

create policy "Enable all access for authenticated users"
    on public.projects
    to authenticated
    using (true)  -- Allow reading all projects
    with check (auth.uid() = user_id);  -- But only modify own projects

create policy "Allow public read access for published projects"
    on public.projects
    for select
    to public
    using (published = true);

-- Verify auth.users exists
create table if not exists auth.users (
    id uuid not null primary key,
    email text,
    created_at timestamp with time zone
); 