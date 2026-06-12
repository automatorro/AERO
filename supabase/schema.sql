-- Supabase schema for AERO
-- Run this in the Supabase SQL editor after creating the project.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  username text,
  name text,
  phone text,
  avatar_color text not null default '#00B86B',
  rating numeric(3,1) not null default 4.9,
  role text not null default 'passenger' check (role in ('passenger', 'driver')),
  driver_status text not null default 'none' check (driver_status in ('none', 'pending', 'approved')),
  trial_ends_at timestamptz,
  vehicle jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.safety_actions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('report', 'block')),
  target_name text not null,
  reason text,
  created_at timestamptz not null default now()
);

create table if not exists public.ride_requests (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  kind text not null default 'passenger_request' check (kind in ('passenger_request', 'driver_request')),
  passenger_name text,
  avatar_color text not null default '#00B86B',
  rating numeric(3,1) not null default 4.9,
  pickup jsonb not null,
  dropoff jsonb not null,
  distance_km numeric(6,2) not null,
  duration_min integer not null,
  offered_price numeric(10,2) not null,
  x numeric(6,3),
  y numeric(6,3),
  status text not null default 'searching' check (status in ('searching', 'accepted', 'cancelled', 'completed')),
  accepted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.rides (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  kind text not null default 'ride' check (kind in ('ride', 'driver')),
  pickup jsonb not null,
  dropoff jsonb not null,
  distance_km numeric(6,2) not null,
  duration_min integer not null,
  base_price numeric(10,2) not null,
  offered_price numeric(10,2) not null,
  final_price numeric(10,2),
  offer jsonb,
  status text not null default 'accepted' check (status in ('accepted', 'inprogress', 'completed', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists user_profiles_email_idx on public.user_profiles (email);
create index if not exists safety_actions_user_id_idx on public.safety_actions (user_id, created_at desc);
create index if not exists ride_requests_owner_id_idx on public.ride_requests (owner_id, created_at desc);
create index if not exists ride_requests_status_idx on public.ride_requests (kind, status, created_at desc);
create index if not exists rides_owner_id_idx on public.rides (owner_id, created_at desc);
create index if not exists rides_status_idx on public.rides (status, created_at desc);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_profiles (
    id,
    email,
    username,
    name,
    phone,
    avatar_color,
    rating,
    role,
    driver_status,
    trial_ends_at,
    vehicle,
    created_at,
    updated_at
  ) values (
    new.id,
    new.email,
    coalesce(nullif(new.raw_user_meta_data->>'username', ''), nullif(new.raw_user_meta_data->>'name', ''), split_part(new.email, '@', 1)),
    coalesce(nullif(new.raw_user_meta_data->>'name', ''), nullif(new.raw_user_meta_data->>'full_name', ''), split_part(new.email, '@', 1)),
    nullif(new.raw_user_meta_data->>'phone', ''),
    coalesce(nullif(new.raw_user_meta_data->>'avatarColor', ''), '#00B86B'),
    coalesce((new.raw_user_meta_data->>'rating')::numeric, 4.9),
    case
      when new.raw_user_meta_data->>'role' in ('driver', 'passenger') then new.raw_user_meta_data->>'role'
      else 'passenger'
    end,
    case
      when new.raw_user_meta_data->>'driverStatus' in ('none', 'pending', 'approved') then new.raw_user_meta_data->>'driverStatus'
      else 'none'
    end,
    nullif(new.raw_user_meta_data->>'trialEndsAt', '')::timestamptz,
    nullif(new.raw_user_meta_data->>'vehicle', '')::jsonb,
    now(),
    now()
  )
  on conflict (id) do update
    set email = excluded.email,
        username = excluded.username,
        name = excluded.name,
        phone = excluded.phone,
        avatar_color = excluded.avatar_color,
        rating = excluded.rating,
        role = excluded.role,
        driver_status = excluded.driver_status,
        trial_ends_at = excluded.trial_ends_at,
        vehicle = excluded.vehicle,
        updated_at = now();

  return new;
end;
$$;

create or replace function public.handle_updated_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.user_profiles
     set email = new.email,
         username = coalesce(nullif(new.raw_user_meta_data->>'username', ''), username),
         name = coalesce(nullif(new.raw_user_meta_data->>'name', ''), nullif(new.raw_user_meta_data->>'full_name', ''), name),
         phone = coalesce(nullif(new.raw_user_meta_data->>'phone', ''), phone),
         avatar_color = coalesce(nullif(new.raw_user_meta_data->>'avatarColor', ''), avatar_color),
         rating = coalesce((new.raw_user_meta_data->>'rating')::numeric, rating),
         role = case
           when new.raw_user_meta_data->>'role' in ('driver', 'passenger') then new.raw_user_meta_data->>'role'
           else role
         end,
         driver_status = case
           when new.raw_user_meta_data->>'driverStatus' in ('none', 'pending', 'approved') then new.raw_user_meta_data->>'driverStatus'
           else driver_status
         end,
         trial_ends_at = coalesce(nullif(new.raw_user_meta_data->>'trialEndsAt', '')::timestamptz, trial_ends_at),
         vehicle = coalesce(nullif(new.raw_user_meta_data->>'vehicle', '')::jsonb, vehicle),
         updated_at = now()
   where id = new.id;

  return new;
end;
$$;

-- Attach auth triggers only once.
do $$
begin
  if not exists (
    select 1
    from pg_trigger
    where tgname = 'on_auth_user_created'
  ) then
    create trigger on_auth_user_created
      after insert on auth.users
      for each row execute function public.handle_new_user();
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_trigger
    where tgname = 'on_auth_user_updated'
  ) then
    create trigger on_auth_user_updated
      after update of email, raw_user_meta_data on auth.users
      for each row execute function public.handle_updated_user();
  end if;
end $$;

-- updated_at triggers
drop trigger if exists set_user_profiles_updated_at on public.user_profiles;
create trigger set_user_profiles_updated_at
before update on public.user_profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_ride_requests_updated_at on public.ride_requests;
create trigger set_ride_requests_updated_at
before update on public.ride_requests
for each row execute function public.set_updated_at();

drop trigger if exists set_rides_updated_at on public.rides;
create trigger set_rides_updated_at
before update on public.rides
for each row execute function public.set_updated_at();

-- Row level security
alter table public.user_profiles enable row level security;
alter table public.safety_actions enable row level security;
alter table public.ride_requests enable row level security;
alter table public.rides enable row level security;

-- user_profiles
drop policy if exists "Profiles are viewable by owner" on public.user_profiles;
create policy "Profiles are viewable by owner"
  on public.user_profiles
  for select
  to authenticated
  using (id = auth.uid());

drop policy if exists "Profiles are insertable by owner" on public.user_profiles;
create policy "Profiles are insertable by owner"
  on public.user_profiles
  for insert
  to authenticated
  with check (id = auth.uid());

drop policy if exists "Profiles are updatable by owner" on public.user_profiles;
create policy "Profiles are updatable by owner"
  on public.user_profiles
  for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- safety_actions
drop policy if exists "Safety actions are viewable by owner" on public.safety_actions;
create policy "Safety actions are viewable by owner"
  on public.safety_actions
  for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "Safety actions are insertable by owner" on public.safety_actions;
create policy "Safety actions are insertable by owner"
  on public.safety_actions
  for insert
  to authenticated
  with check (user_id = auth.uid());

drop policy if exists "Safety actions are updatable by owner" on public.safety_actions;
create policy "Safety actions are updatable by owner"
  on public.safety_actions
  for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "Safety actions are deletable by owner" on public.safety_actions;
create policy "Safety actions are deletable by owner"
  on public.safety_actions
  for delete
  to authenticated
  using (user_id = auth.uid());

-- ride_requests
drop policy if exists "Ride requests are readable by authenticated users" on public.ride_requests;
create policy "Ride requests are readable by authenticated users"
  on public.ride_requests
  for select
  to authenticated
  using (true);

drop policy if exists "Ride requests are insertable by owner" on public.ride_requests;
create policy "Ride requests are insertable by owner"
  on public.ride_requests
  for insert
  to authenticated
  with check (owner_id = auth.uid());

drop policy if exists "Ride requests are updatable when searching or owned" on public.ride_requests;
create policy "Ride requests are updatable when searching or owned"
  on public.ride_requests
  for update
  to authenticated
  using (status = 'searching' or owner_id = auth.uid())
  with check (status in ('searching', 'accepted', 'cancelled', 'completed'));

drop policy if exists "Ride requests are deletable by owner" on public.ride_requests;
create policy "Ride requests are deletable by owner"
  on public.ride_requests
  for delete
  to authenticated
  using (owner_id = auth.uid());

-- rides
drop policy if exists "Rides are readable by owner" on public.rides;
create policy "Rides are readable by owner"
  on public.rides
  for select
  to authenticated
  using (owner_id = auth.uid());

drop policy if exists "Rides are insertable by owner" on public.rides;
create policy "Rides are insertable by owner"
  on public.rides
  for insert
  to authenticated
  with check (owner_id = auth.uid());

drop policy if exists "Rides are updatable by owner" on public.rides;
create policy "Rides are updatable by owner"
  on public.rides
  for update
  to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

drop policy if exists "Rides are deletable by owner" on public.rides;
create policy "Rides are deletable by owner"
  on public.rides
  for delete
  to authenticated
  using (owner_id = auth.uid());
