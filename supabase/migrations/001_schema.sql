-- Lakshmi Traders Price List App Schema
-- Run this in Supabase SQL Editor

-- Categories table
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  regular_discount_pct numeric(5,2) not null default 0,
  shop_owner_discount_pct numeric(5,2) not null default 0,
  created_at timestamptz default now()
);

-- Products table
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  name text not null,
  unit text,
  master_price numeric(10,2) not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Price list uploads log
create table if not exists public.price_list_uploads (
  id uuid primary key default gen_random_uuid(),
  filename text not null,
  uploaded_at timestamptz default now(),
  rows_added int default 0,
  rows_updated int default 0
);

-- Profiles for role management
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('admin','viewer')),
  created_at timestamptz default now()
);

-- Create index on products for faster lookups
create index if not exists idx_products_category on public.products(category_id);
create index if not exists idx_products_name on public.products using gin(to_tsvector('english', name));

-- Enable RLS on all tables
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.price_list_uploads enable row level security;
alter table public.profiles enable row level security;

-- RLS Policies for categories
create policy "Anyone authenticated can view categories"
  on public.categories for select
  to authenticated
  using (true);

create policy "Only admins can insert categories"
  on public.categories for insert
  to authenticated
  with check (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Only admins can update categories"
  on public.categories for update
  to authenticated
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Only admins can delete categories"
  on public.categories for delete
  to authenticated
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- RLS Policies for products
create policy "Anyone authenticated can view products"
  on public.products for select
  to authenticated
  using (true);

create policy "Only admins can insert products"
  on public.products for insert
  to authenticated
  with check (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Only admins can update products"
  on public.products for update
  to authenticated
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Only admins can delete products"
  on public.products for delete
  to authenticated
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- RLS Policies for price_list_uploads
create policy "Anyone authenticated can view uploads"
  on public.price_list_uploads for select
  to authenticated
  using (true);

create policy "Only admins can insert uploads"
  on public.price_list_uploads for insert
  to authenticated
  with check (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- RLS Policies for profiles
create policy "Users can view own profile"
  on public.profiles for select
  to authenticated
  using (true);

create policy "Only admins can insert profiles"
  on public.profiles for insert
  to authenticated
  with check (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
    or not exists (select 1 from public.profiles)
  );

-- Function to auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'role', 'viewer'));
  return new;
end;
$$;

-- Trigger for new user signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to update updated_at timestamp
create or replace function public.update_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger products_updated_at
  before update on public.products
  for each row execute procedure public.update_updated_at();
