-- Photo submissions table
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

-- Anyone authenticated can view their own submissions
create policy "Users can view own submissions"
  on public.photo_submissions for select
  to authenticated
  using (user_id = auth.uid() or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- Anyone authenticated can insert submissions
create policy "Users can insert submissions"
  on public.photo_submissions for insert
  to authenticated
  with check (user_id = auth.uid());

-- Only admins can update submissions (for review)
create policy "Admins can update submissions"
  on public.photo_submissions for update
  to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- Only admins can delete submissions
create policy "Admins can delete submissions"
  on public.photo_submissions for delete
  to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
