-- Create Orders Table
create table public.orders (
  id uuid default gen_random_uuid(),
  user_id uuid references auth.users on delete set null, -- Nullable for guest checkout
  status text not null default 'pending', -- pending, processing, shipped, delivered, cancelled
  total_amount numeric not null,
  currency text default 'RON',
  customer_email text,
  customer_phone text,
  shipping_address jsonb, -- Stores full address object
  payment_intent_id text, -- For Stripe or other processors
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  primary key (id)
);

-- Create Order Items Table
create table public.order_items (
  id uuid default gen_random_uuid(),
  order_id uuid references public.orders on delete cascade not null,
  product_id uuid references public.products on delete set null, -- Keep record even if product deleted
  quantity integer not null default 1,
  price_at_purchase numeric not null, -- Snapshot of price at time of order
  product_name text, -- Snapshot of name in case product changes
  product_image text, -- Snapshot of image
  
  primary key (id)
);

-- Enable RLS
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Policies for Orders

-- Admins can view all orders
create policy "Admins can view all orders"
  on public.orders for select
  using ( 
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Admins can update orders
create policy "Admins can update orders"
  on public.orders for update
  using ( 
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Users can view their own orders
create policy "Users can view own orders"
  on public.orders for select
  using ( auth.uid() = user_id );

-- Public/Anon can insert orders (for checkout)
create policy "Public can create orders"
  on public.orders for insert
  with check ( true );


-- Policies for Order Items

-- Admins can view all order items
create policy "Admins can view all order items"
  on public.order_items for select
  using ( 
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Users can view their own order items (via order relation)
create policy "Users can view own order items"
  on public.order_items for select
  using ( 
    exists (select 1 from public.orders where id = order_items.order_id and user_id = auth.uid())
  );

-- Public/Anon can insert order items
create policy "Public can create order items"
  on public.order_items for insert
  with check ( true );
