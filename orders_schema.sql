-- Create Orders Table
create table public.orders (
  id uuid default gen_random_uuid(),
  user_id uuid references auth.users on delete set null,
  status text default 'pending', -- pending, paid, shipped, completed, cancelled
  total_price numeric not null,
  currency text default 'RON',
  shipping_details jsonb, -- { "address": "...", "city": "...", "phone": "..." }
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  primary key (id)
);

alter table public.orders enable row level security;

-- Create Order Items Table
create table public.order_items (
  id uuid default gen_random_uuid(),
  order_id uuid references public.orders on delete cascade not null,
  product_id uuid references public.products on delete set null,
  quantity integer not null default 1,
  unit_price numeric not null, -- Snapshot of the price at purchase time
  
  primary key (id)
);

alter table public.order_items enable row level security;

-- Policies for Orders

-- Users can view their own orders
create policy "Users can view their own orders"
  on orders for select
  using ( auth.uid() = user_id );

-- Admins can view all orders
create policy "Admins can view all orders"
  on orders for select
  using ( 
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Users can insert their own orders (checkout)
create policy "Users can create orders"
  on orders for insert
  with check ( auth.uid() = user_id );

-- Admins can update orders (change status)
create policy "Admins can update orders"
  on orders for update
  using ( 
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Policies for Order Items

-- Users can view items of their own orders
create policy "Users can view their own order items"
  on order_items for select
  using ( 
    exists (select 1 from public.orders where id = order_items.order_id and user_id = auth.uid())
  );

-- Admins can view all order items
create policy "Admins can view all order items"
  on order_items for select
  using ( 
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Users can insert order items (checkout)
-- This might need a more complex check or generally be allowed if they can insert the parent order
-- A simple check is that the linked order belongs to them, but relying on the order insert to happen in the same transaction or checked logic.
create policy "Users can create order items"
  on order_items for insert
  with check (
    exists (select 1 from public.orders where id = order_items.order_id and user_id = auth.uid())
  );
