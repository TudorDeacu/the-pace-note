-- Create Profiles Table
create table public.profiles (
  id uuid not null references auth.users on delete cascade,
  first_name text,
  last_name text,
  username text unique,
  email text,
  role text default 'user', -- 'user' or 'admin'
  phone_number text,
  address_line1 text,
  address_line2 text,
  city text,
  state text,
  postal_code text,
  country text,
  
  primary key (id)
);

alter table public.profiles enable row level security;

-- Create Policies for Profiles
create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Create Articles Table
create table public.articles (
  id uuid default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  content jsonb, -- For the block editor content
  published boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  primary key (id)
);

alter table public.articles enable row level security;

-- Policy: Everyone can read published articles
create policy "Public articles are viewable by everyone."
  on articles for select
  using ( published = true );

-- Policy: Admins can see all articles
create policy "Admins can see all articles."
  on articles for select
  using ( 
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can insert articles."
  on articles for insert
  with check ( 
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can update articles."
  on articles for update
  using ( 
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can delete articles."
  on articles for delete
  using ( 
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Create Products Table
create table public.products (
  id uuid default gen_random_uuid(),
  name text not null,
  description text,
  price numeric,
  stock integer,
  dimensions text,
  images text[], -- Array of image URLs
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  primary key (id)
);

alter table public.products enable row level security;

-- Policy: Everyone can read products
create policy "Products are viewable by everyone."
  on products for select
  using ( true );

-- Policy: Admins can manage products
create policy "Admins can insert products."
  on products for insert
  with check ( 
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can update products."
  on products for update
  using ( 
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can delete products."
  on products for delete
  using ( 
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Storage Buckets
insert into storage.buckets (id, name, public)
values 
  ('blogs', 'blogs', true),
  ('products', 'products', true),
  ('projects', 'projects', true),
  ('other', 'other', true)
on conflict (id) do nothing;

create policy "Public Access Blogs" on storage.objects for select using ( bucket_id = 'blogs' );
create policy "Public Access Products" on storage.objects for select using ( bucket_id = 'products' );
create policy "Public Access Projects" on storage.objects for select using ( bucket_id = 'projects' );
create policy "Public Access Other" on storage.objects for select using ( bucket_id = 'other' );

create policy "Authenticated Upload"
  on storage.objects for insert
  with check ( 
    bucket_id in ('blogs', 'products', 'projects', 'other')
    and auth.role() = 'authenticated'
  );
