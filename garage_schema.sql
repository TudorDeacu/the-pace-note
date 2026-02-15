-- Create Projects Table for Garage
create table public.projects (
  id uuid default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  content jsonb, -- For the block editor content
  excerpt text,
  image_url text,
  gallery text[], -- Array of additional image URLs
  published boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  primary key (id)
);

alter table public.projects enable row level security;

-- Policy: Everyone can read published projects
create policy "Public projects are viewable by everyone."
  on projects for select
  using ( published = true );

-- Policy: Admins can see all projects
create policy "Admins can see all projects."
  on projects for select
  using ( 
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can insert projects."
  on projects for insert
  with check ( 
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can update projects."
  on projects for update
  using ( 
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can delete projects."
  on projects for delete
  using ( 
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );
