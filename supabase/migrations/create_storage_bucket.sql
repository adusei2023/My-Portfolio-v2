-- Create storage bucket for project images
insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true);

-- Set up storage policies
create policy "Authenticated users can upload project images"
on storage.objects for insert
to authenticated
with check (
    bucket_id = 'project-images' AND
    auth.role() = 'authenticated'
);

create policy "Anyone can view project images"
on storage.objects for select
using (bucket_id = 'project-images');

create policy "Users can update their own project images"
on storage.objects for update
to authenticated
using (
    bucket_id = 'project-images' AND
    owner = auth.uid()
);

create policy "Users can delete their own project images"
on storage.objects for delete
to authenticated
using (
    bucket_id = 'project-images' AND
    owner = auth.uid()
); 