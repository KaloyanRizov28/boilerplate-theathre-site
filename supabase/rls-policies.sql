-- Enable RLS and restrict mutations to admins only
alter table public.shows enable row level security;
create policy "Shows admin mutations" on public.shows
  for all
  using (auth.jwt() -> 'app_metadata' ->> 'is_admin' = 'true')
  with check (auth.jwt() -> 'app_metadata' ->> 'is_admin' = 'true');

alter table public.employees enable row level security;
create policy "Employees admin mutations" on public.employees
  for all
  using (auth.jwt() -> 'app_metadata' ->> 'is_admin' = 'true')
  with check (auth.jwt() -> 'app_metadata' ->> 'is_admin' = 'true');

alter table public.performances enable row level security;
create policy "Performances admin mutations" on public.performances
  for all
  using (auth.jwt() -> 'app_metadata' ->> 'is_admin' = 'true')
  with check (auth.jwt() -> 'app_metadata' ->> 'is_admin' = 'true');

alter table public.cast_members enable row level security;
create policy "Cast members admin mutations" on public.cast_members
  for all
  using (auth.jwt() -> 'app_metadata' ->> 'is_admin' = 'true')
  with check (auth.jwt() -> 'app_metadata' ->> 'is_admin' = 'true');
