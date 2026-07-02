-- Add wholesale_price to products (buying/cost price is master_price, wholesale is new, shop_price is retail)
alter table public.products add column if not exists wholesale_price numeric(10,2);

-- Create photo_submissions table if not exists
create table if not exists public.photo_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  image_url text not null,
  message text,
  status text not null default 'pending' check (status in ('pending','reviewed','rejected')),
  admin_notes text,
  created_at timestamptz default now(),
  reviewed_at timestamptz
);

-- Enable RLS
alter table public.photo_submissions enable row level security;

-- Drop existing policies if they exist (safe re-run)
drop policy if exists "Users can view own submissions" on public.photo_submissions;
drop policy if exists "Users can insert submissions" on public.photo_submissions;
drop policy if exists "Admins can update submissions" on public.photo_submissions;
drop policy if exists "Admins can delete submissions" on public.photo_submissions;

-- Recreate policies
create policy "Users can view own submissions"
  on public.photo_submissions for select to authenticated
  using (user_id = auth.uid() or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "Users can insert submissions"
  on public.photo_submissions for insert to authenticated
  with check (user_id = auth.uid());

create policy "Admins can update submissions"
  on public.photo_submissions for update to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "Admins can delete submissions"
  on public.photo_submissions for delete to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- Storage policies for price-photos bucket
-- Allow authenticated users to upload
insert into storage.policies (bucket_id, name, definition, operation)
select 'price-photos', 'Allow authenticated uploads', '(auth.role() = ''authenticated'')', 'INSERT'
where not exists (select 1 from storage.policies where bucket_id = 'price-photos' and name = 'Allow authenticated uploads');

-- Allow public read
insert into storage.policies (bucket_id, name, definition, operation)
select 'price-photos', 'Allow public read', '(true)', 'SELECT'
where not exists (select 1 from storage.policies where bucket_id = 'price-photos' and name = 'Allow public read');
