-- 1. Subcategories table
create table if not exists public.subcategories (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete cascade,
  name text not null,
  created_at timestamptz default now(),
  unique(category_id, name)
);

alter table public.subcategories enable row level security;

create policy "Anyone authenticated can view subcategories"
  on public.subcategories for select to authenticated using (true);

create policy "Admins can insert subcategories"
  on public.subcategories for insert to authenticated
  with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "Admins can update subcategories"
  on public.subcategories for update to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "Admins can delete subcategories"
  on public.subcategories for delete to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- 2. Add subcategory_id to products
alter table public.products add column if not exists subcategory_id uuid references public.subcategories(id) on delete set null;

-- 3. Add status to profiles for approval flow
alter table public.profiles add column if not exists status text not null default 'active';
alter table public.profiles drop constraint if exists profiles_status_check;
alter table public.profiles add constraint profiles_status_check check (status in ('pending', 'active', 'rejected'));

-- 4. Update handle_new_user to set pending status for new signups
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, role, status)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'role', 'viewer'),
    case
      when new.raw_user_meta_data->>'role' = 'admin' then 'active'
      else 'pending'
    end
  );
  return new;
end;
$$;
