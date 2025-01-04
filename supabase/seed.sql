-- Insert dummy projects
INSERT INTO public.projects (title, description, image_url, github_url, live_url, tags, user_id)
SELECT
  title,
  description,
  image_url,
  github_url,
  live_url,
  tags,
  auth.uid()
FROM (
  VALUES
    (
      'AI-Powered Task Manager',
      'A smart task management application that uses AI to prioritize and categorize tasks. Built with Next.js, OpenAI API, and Tailwind CSS.',
      'https://images.unsplash.com/photo-1661961112951-f2bfd1f253ce?q=80&w=2072&auto=format&fit=crop',
      'https://github.com/yourusername/ai-task-manager',
      'https://ai-task-manager.demo.com',
      ARRAY['Next.js', 'AI', 'Tailwind CSS', 'TypeScript']
    )
    -- Add more projects as needed...
) AS t(title, description, image_url, github_url, live_url, tags)
WHERE EXISTS (SELECT 1 FROM auth.users LIMIT 1);

-- Insert dummy testimonials
INSERT INTO public.testimonials (name, role, company, content, image_url, user_id)
SELECT
  name,
  role,
  company,
  content,
  image_url,
  auth.uid()
FROM (
  VALUES
    (
      'John Doe',
      'CTO',
      'Tech Corp',
      'Amazing developer! Delivered the project on time and with excellent quality.',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop',
      auth.uid()
    )
    -- Add more testimonials as needed...
) AS t(name, role, company, content, image_url)
WHERE EXISTS (SELECT 1 FROM auth.users LIMIT 1); 