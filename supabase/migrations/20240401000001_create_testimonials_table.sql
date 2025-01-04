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

-- Enable RLS
alter table public.testimonials enable row level security;

-- Create policies
create policy "Users can view all testimonials"
    on public.testimonials for select
    to authenticated
    using (true);

create policy "Users can create their own testimonials"
    on public.testimonials for insert
    to authenticated
    with check (auth.uid() = user_id);

create policy "Users can update their own testimonials"
    on public.testimonials for update
    to authenticated
    using (auth.uid() = user_id);

create policy "Users can delete their own testimonials"
    on public.testimonials for delete
    to authenticated
    using (auth.uid() = user_id);

-- Create updated_at trigger
create trigger handle_testimonials_updated_at
    before update on public.testimonials
    for each row
    execute function public.handle_updated_at(); 