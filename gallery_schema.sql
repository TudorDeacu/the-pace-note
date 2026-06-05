-- Create Galleries Table
create table public.galleries (
  id uuid default gen_random_uuid(),
  title text not null,
  event_date date not null,
  cover_image text,
  media jsonb default '[]'::jsonb, -- Array of { url: string, type: 'image' | 'video', name: string }
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  primary key (id)
);

alter table public.galleries enable row level security;

-- Policy: Everyone can read galleries
create policy "Galleries are viewable by everyone."
  on galleries for select
  using ( true );

-- Policy: Admins can manage galleries
create policy "Admins can insert galleries."
  on galleries for insert
  with check ( 
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can update galleries."
  on galleries for update
  using ( 
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can delete galleries."
  on galleries for delete
  using ( 
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Storage Buckets
insert into storage.buckets (id, name, public)
values 
  ('galleries', 'galleries', true)
on conflict (id) do nothing;

create policy "Public Access Galleries" on storage.objects for select using ( bucket_id = 'galleries' );

create policy "Authenticated Upload Galleries"
  on storage.objects for insert
  with check ( 
    bucket_id = 'galleries'
    and auth.role() = 'authenticated'
  );
