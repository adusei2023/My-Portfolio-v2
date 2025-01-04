-- Create storage bucket for project images
insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true);

-- Allow authenticated users to upload images
create policy "Authenticated users can upload images"
on storage.objects for insert 
to authenticated 
with check (bucket_id = 'project-images');

-- Allow public access to view images
create policy "Images are publicly accessible"
on storage.objects for select
to public
using (bucket_id = 'project-images');

-- Allow users to delete their own images
create policy "Users can delete their own images"
on storage.objects for delete
to authenticated
using (bucket_id = 'project-images' and auth.uid() = owner); 