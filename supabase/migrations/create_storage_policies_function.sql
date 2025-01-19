create or replace function setup_storage_policies(bucket_id text)
returns void
language plpgsql
security definer
as $$
begin
  execute format('
    create policy if not exists "Authenticated users can upload images"
    on storage.objects for insert 
    to authenticated 
    with check (bucket_id = %L);

    create policy if not exists "Images are publicly accessible"
    on storage.objects for select
    to public
    using (bucket_id = %L);

    create policy if not exists "Users can delete their own images"
    on storage.objects for delete
    to authenticated
    using (bucket_id = %L and auth.uid() = owner);
  ', bucket_id, bucket_id, bucket_id);
end;
$$; 