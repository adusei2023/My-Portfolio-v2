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