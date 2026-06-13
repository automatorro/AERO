-- ============================================================
-- AERO — Schema Supabase completă v2
-- Rulează în Supabase SQL Editor: https://supabase.com/dashboard/project/uyjmabxpbfweskilvecr
-- ============================================================

create extension if not exists pgcrypto;

-- ---- Helper trigger ----
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

-- ============================================================
-- TABELE EXISTENTE (păstrate, doar extinse)
-- ============================================================

-- user_profiles — există deja, nu se suprascrie
create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  username text,
  name text,
  phone text,
  avatar_color text not null default '#111111',
  rating numeric(3,1) not null default 5.0,
  role text not null default 'passenger' check (role in ('passenger', 'driver')),
  driver_status text not null default 'none' check (driver_status in ('none', 'pending', 'approved')),
  trial_ends_at timestamptz,
  vehicle jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- safety_actions — există deja
create table if not exists public.safety_actions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('report', 'block')),
  target_name text not null,
  reason text,
  created_at timestamptz not null default now()
);

-- ride_requests — există deja
create table if not exists public.ride_requests (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  kind text not null default 'passenger_request' check (kind in ('passenger_request', 'driver_request')),
  passenger_name text,
  avatar_color text not null default '#111111',
  rating numeric(3,1) not null default 5.0,
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

-- rides — există deja
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

-- ============================================================
-- TABELE NOI — MVP complet
-- ============================================================

-- driver_profiles — profil detaliat șofer
create table if not exists public.driver_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  car_make text,
  car_model text,
  car_year integer,
  car_plate text,
  car_color text,
  car_photo_url text,
  profile_photo_url text,
  rating_avg numeric(3,1) not null default 5.0,
  total_rides integer not null default 0,
  is_verified boolean not null default false,
  stripe_account_id text,
  subscription_status text default 'none' check (subscription_status in ('none', 'trial', 'active', 'past_due', 'cancelled')),
  subscription_end_date timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- passenger_profiles — profil detaliat pasager
create table if not exists public.passenger_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  rating_avg numeric(3,1) not null default 5.0,
  total_rides integer not null default 0,
  stripe_customer_id text,
  emergency_contact_name text,
  emergency_contact_phone text,
  favorite_locations jsonb default '[]',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- country_documents — configurație documente per țară (setată de admin)
create table if not exists public.country_documents (
  id uuid primary key default gen_random_uuid(),
  country_code text not null,        -- 'RO', 'DE', 'FR', etc.
  doc_type text not null,            -- 'id_card', 'license', 'insurance', 'itp', 'custom'
  doc_label_i18n jsonb not null,     -- {"ro": "Permis auto", "en": "Driver license", ...}
  is_required boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- driver_documents — documentele uploadate de fiecare șofer
create table if not exists public.driver_documents (
  id uuid primary key default gen_random_uuid(),
  driver_id uuid not null references auth.users(id) on delete cascade,
  doc_type text not null,
  file_url text not null,
  country_code text not null default 'RO',
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  reject_reason text,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- driver_locations — locații live șoferi (actualizat la 3-4 secunde)
create table if not exists public.driver_locations (
  id uuid primary key default gen_random_uuid(),
  driver_id uuid not null unique references auth.users(id) on delete cascade,
  lat numeric(10,7) not null,
  lng numeric(10,7) not null,
  heading numeric(5,2),
  is_available boolean not null default false,
  updated_at timestamptz not null default now()
);

-- ride_offers — ofertele de negociere preț
create table if not exists public.ride_offers (
  id uuid primary key default gen_random_uuid(),
  ride_request_id uuid not null references public.ride_requests(id) on delete cascade,
  offered_by text not null check (offered_by in ('passenger', 'driver')),
  driver_id uuid references auth.users(id),
  amount numeric(10,2) not null,
  currency text not null default 'RON',
  status text not null default 'pending' check (status in ('pending', 'accepted', 'rejected', 'countered')),
  created_at timestamptz not null default now()
);

-- messages — chat în cursă (Supabase Realtime)
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  ride_id uuid not null,  -- referință la rides.id
  sender_id uuid not null references auth.users(id) on delete cascade,
  type text not null default 'text' check (type in ('text', 'image')),
  content text,
  image_url text,
  created_at timestamptz not null default now(),
  read_at timestamptz
);

-- ratings — evaluări bilaterale după cursă
create table if not exists public.ratings (
  id uuid primary key default gen_random_uuid(),
  ride_id uuid not null,
  rated_by uuid not null references auth.users(id) on delete cascade,
  rated_user uuid not null references auth.users(id) on delete cascade,
  score integer not null check (score between 1 and 5),
  comment text,
  created_at timestamptz not null default now()
);

-- subscriptions — abonamente șoferi
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  driver_id uuid not null references auth.users(id) on delete cascade,
  stripe_subscription_id text unique,
  status text not null default 'trial' check (status in ('trial', 'active', 'past_due', 'cancelled')),
  trial_end timestamptz,
  current_period_end timestamptz,
  amount numeric(10,2),
  currency text not null default 'RON',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- saved_locations — locații favorite pasageri
create table if not exists public.saved_locations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  label text not null check (label in ('home', 'work', 'custom')),
  label_custom text,
  address text not null,
  lat numeric(10,7),
  lng numeric(10,7),
  created_at timestamptz not null default now()
);

-- admin_actions — log acțiuni admin
create table if not exists public.admin_actions (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid not null references auth.users(id),
  action_type text not null,  -- 'approve_driver', 'reject_driver', 'deactivate_user', etc.
  target_user_id uuid references auth.users(id),
  notes text,
  created_at timestamptz not null default now()
);

-- driver_penalties — penalizări șoferi (deduse la prima cursă)
create table if not exists public.driver_penalties (
  id uuid primary key default gen_random_uuid(),
  driver_id uuid not null references auth.users(id) on delete cascade,
  ride_id uuid,
  amount numeric(10,2) not null default 1.00,  -- 1 EUR echivalent
  currency text not null default 'EUR',
  reason text not null check (reason in ('driver_cancelled', 'passenger_no_show', 'other')),
  status text not null default 'pending' check (status in ('pending', 'collected')),
  created_at timestamptz not null default now(),
  collected_at timestamptz
);

-- ============================================================
-- INDECȘI
-- ============================================================

create index if not exists driver_profiles_user_id_idx on public.driver_profiles (user_id);
create index if not exists passenger_profiles_user_id_idx on public.passenger_profiles (user_id);
create index if not exists country_documents_country_idx on public.country_documents (country_code, display_order);
create index if not exists driver_documents_driver_idx on public.driver_documents (driver_id, status);
create index if not exists driver_locations_driver_idx on public.driver_locations (driver_id);
create index if not exists driver_locations_available_idx on public.driver_locations (is_available, updated_at desc);
create index if not exists ride_offers_request_idx on public.ride_offers (ride_request_id, created_at desc);
create index if not exists messages_ride_idx on public.messages (ride_id, created_at asc);
create index if not exists ratings_ride_idx on public.ratings (ride_id);
create index if not exists saved_locations_user_idx on public.saved_locations (user_id);
create index if not exists driver_penalties_driver_idx on public.driver_penalties (driver_id, status);
create index if not exists user_profiles_email_idx on public.user_profiles (email);
create index if not exists ride_requests_owner_id_idx on public.ride_requests (owner_id, created_at desc);
create index if not exists ride_requests_status_idx on public.ride_requests (kind, status, created_at desc);
create index if not exists rides_owner_id_idx on public.rides (owner_id, created_at desc);

-- ============================================================
-- UPDATED_AT TRIGGERS
-- ============================================================

drop trigger if exists set_driver_profiles_updated_at on public.driver_profiles;
create trigger set_driver_profiles_updated_at before update on public.driver_profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_passenger_profiles_updated_at on public.passenger_profiles;
create trigger set_passenger_profiles_updated_at before update on public.passenger_profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_driver_documents_updated_at on public.driver_documents;
create trigger set_driver_documents_updated_at before update on public.driver_documents
for each row execute function public.set_updated_at();

drop trigger if exists set_subscriptions_updated_at on public.subscriptions;
create trigger set_subscriptions_updated_at before update on public.subscriptions
for each row execute function public.set_updated_at();

drop trigger if exists set_user_profiles_updated_at on public.user_profiles;
create trigger set_user_profiles_updated_at before update on public.user_profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_ride_requests_updated_at on public.ride_requests;
create trigger set_ride_requests_updated_at before update on public.ride_requests
for each row execute function public.set_updated_at();

drop trigger if exists set_rides_updated_at on public.rides;
create trigger set_rides_updated_at before update on public.rides
for each row execute function public.set_updated_at();

-- ============================================================
-- AUTH TRIGGERS — sync user_profiles la creare/update cont
-- ============================================================

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.user_profiles (
    id, email, username, name, phone, avatar_color, rating,
    role, driver_status, trial_ends_at, vehicle, created_at, updated_at
  ) values (
    new.id,
    new.email,
    coalesce(nullif(new.raw_user_meta_data->>'username', ''), nullif(new.raw_user_meta_data->>'name', ''), split_part(new.email, '@', 1)),
    coalesce(nullif(new.raw_user_meta_data->>'name', ''), nullif(new.raw_user_meta_data->>'full_name', ''), split_part(new.email, '@', 1)),
    nullif(new.raw_user_meta_data->>'phone', ''),
    coalesce(nullif(new.raw_user_meta_data->>'avatarColor', ''), '#111111'),
    coalesce((new.raw_user_meta_data->>'rating')::numeric, 5.0),
    case when new.raw_user_meta_data->>'role' in ('driver', 'passenger') then new.raw_user_meta_data->>'role' else 'passenger' end,
    case when new.raw_user_meta_data->>'driverStatus' in ('none', 'pending', 'approved') then new.raw_user_meta_data->>'driverStatus' else 'none' end,
    nullif(new.raw_user_meta_data->>'trialEndsAt', '')::timestamptz,
    nullif(new.raw_user_meta_data->>'vehicle', '')::jsonb,
    now(), now()
  )
  on conflict (id) do update set
    email = excluded.email, username = excluded.username, name = excluded.name,
    phone = excluded.phone, avatar_color = excluded.avatar_color, rating = excluded.rating,
    role = excluded.role, driver_status = excluded.driver_status,
    trial_ends_at = excluded.trial_ends_at, vehicle = excluded.vehicle, updated_at = now();
  return new;
end; $$;

create or replace function public.handle_updated_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  update public.user_profiles set
    email = new.email,
    name = coalesce(nullif(new.raw_user_meta_data->>'name', ''), nullif(new.raw_user_meta_data->>'full_name', ''), name),
    phone = coalesce(nullif(new.raw_user_meta_data->>'phone', ''), phone),
    avatar_color = coalesce(nullif(new.raw_user_meta_data->>'avatarColor', ''), avatar_color),
    role = case when new.raw_user_meta_data->>'role' in ('driver', 'passenger') then new.raw_user_meta_data->>'role' else role end,
    driver_status = case when new.raw_user_meta_data->>'driverStatus' in ('none', 'pending', 'approved') then new.raw_user_meta_data->>'driverStatus' else driver_status end,
    trial_ends_at = coalesce(nullif(new.raw_user_meta_data->>'trialEndsAt', '')::timestamptz, trial_ends_at),
    vehicle = coalesce(nullif(new.raw_user_meta_data->>'vehicle', '')::jsonb, vehicle),
    updated_at = now()
  where id = new.id;
  return new;
end; $$;

do $$ begin
  if not exists (select 1 from pg_trigger where tgname = 'on_auth_user_created') then
    create trigger on_auth_user_created after insert on auth.users
    for each row execute function public.handle_new_user();
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_trigger where tgname = 'on_auth_user_updated') then
    create trigger on_auth_user_updated after update of email, raw_user_meta_data on auth.users
    for each row execute function public.handle_updated_user();
  end if;
end $$;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.user_profiles enable row level security;
alter table public.safety_actions enable row level security;
alter table public.ride_requests enable row level security;
alter table public.rides enable row level security;
alter table public.driver_profiles enable row level security;
alter table public.passenger_profiles enable row level security;
alter table public.driver_documents enable row level security;
alter table public.driver_locations enable row level security;
alter table public.ride_offers enable row level security;
alter table public.messages enable row level security;
alter table public.ratings enable row level security;
alter table public.subscriptions enable row level security;
alter table public.saved_locations enable row level security;
alter table public.driver_penalties enable row level security;

-- user_profiles
drop policy if exists "Profiles are viewable by owner" on public.user_profiles;
create policy "Profiles are viewable by owner" on public.user_profiles for select to authenticated using (id = auth.uid());
drop policy if exists "Profiles are insertable by owner" on public.user_profiles;
create policy "Profiles are insertable by owner" on public.user_profiles for insert to authenticated with check (id = auth.uid());
drop policy if exists "Profiles are updatable by owner" on public.user_profiles;
create policy "Profiles are updatable by owner" on public.user_profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

-- driver_profiles: șoferul vede al lui, oricine poate vedea un profil de șofer (rating, vehicul)
drop policy if exists "Driver profiles viewable" on public.driver_profiles;
create policy "Driver profiles viewable" on public.driver_profiles for select to authenticated using (true);
drop policy if exists "Driver profiles owned" on public.driver_profiles;
create policy "Driver profiles owned" on public.driver_profiles for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- passenger_profiles: doar owner
drop policy if exists "Passenger profiles owned" on public.passenger_profiles;
create policy "Passenger profiles owned" on public.passenger_profiles for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- country_documents: publice (read), admin write (via service role)
drop policy if exists "Country docs readable" on public.country_documents;
create policy "Country docs readable" on public.country_documents for select to authenticated using (true);

-- driver_documents: șoferul vede ale lui, admin vede toate (via service role)
drop policy if exists "Driver docs viewable by owner" on public.driver_documents;
create policy "Driver docs viewable by owner" on public.driver_documents for select to authenticated using (driver_id = auth.uid());
drop policy if exists "Driver docs insertable by owner" on public.driver_documents;
create policy "Driver docs insertable by owner" on public.driver_documents for insert to authenticated with check (driver_id = auth.uid());

-- driver_locations: toți șoferii pot vedea (pentru pasageri să găsească șoferi), șoferul update al lui
drop policy if exists "Driver locations readable" on public.driver_locations;
create policy "Driver locations readable" on public.driver_locations for select to authenticated using (true);
drop policy if exists "Driver locations owned" on public.driver_locations;
create policy "Driver locations owned" on public.driver_locations for all to authenticated using (driver_id = auth.uid()) with check (driver_id = auth.uid());

-- ride_requests: toți pot citi (șoferii văd cererile pasagerilor), owner poate modifica
drop policy if exists "Ride requests readable" on public.ride_requests;
create policy "Ride requests readable" on public.ride_requests for select to authenticated using (true);
drop policy if exists "Ride requests insertable" on public.ride_requests;
create policy "Ride requests insertable" on public.ride_requests for insert to authenticated with check (owner_id = auth.uid());
drop policy if exists "Ride requests updatable" on public.ride_requests;
create policy "Ride requests updatable" on public.ride_requests for update to authenticated using (status = 'searching' or owner_id = auth.uid());

-- ride_offers: participanții la cursă pot vedea
drop policy if exists "Ride offers readable" on public.ride_offers;
create policy "Ride offers readable" on public.ride_offers for select to authenticated using (true);
drop policy if exists "Ride offers insertable" on public.ride_offers;
create policy "Ride offers insertable" on public.ride_offers for insert to authenticated with check (true);

-- rides: owner vede ale lui
drop policy if exists "Rides readable by owner" on public.rides;
create policy "Rides readable by owner" on public.rides for select to authenticated using (owner_id = auth.uid());
drop policy if exists "Rides insertable by owner" on public.rides;
create policy "Rides insertable by owner" on public.rides for insert to authenticated with check (owner_id = auth.uid());
drop policy if exists "Rides updatable by owner" on public.rides;
create policy "Rides updatable by owner" on public.rides for update to authenticated using (owner_id = auth.uid());

-- messages: participanții la cursă (șofer + pasager) pot vedea
drop policy if exists "Messages readable" on public.messages;
create policy "Messages readable" on public.messages for select to authenticated using (true);
drop policy if exists "Messages insertable" on public.messages;
create policy "Messages insertable" on public.messages for insert to authenticated with check (sender_id = auth.uid());

-- ratings
drop policy if exists "Ratings readable" on public.ratings;
create policy "Ratings readable" on public.ratings for select to authenticated using (true);
drop policy if exists "Ratings insertable" on public.ratings;
create policy "Ratings insertable" on public.ratings for insert to authenticated with check (rated_by = auth.uid());

-- safety_actions: owner
drop policy if exists "Safety actions owned" on public.safety_actions;
create policy "Safety actions owned" on public.safety_actions for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- subscriptions: owner
drop policy if exists "Subscriptions owned" on public.subscriptions;
create policy "Subscriptions owned" on public.subscriptions for all to authenticated using (driver_id = auth.uid()) with check (driver_id = auth.uid());

-- saved_locations: owner
drop policy if exists "Saved locations owned" on public.saved_locations;
create policy "Saved locations owned" on public.saved_locations for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- driver_penalties: driver vede ale lui
drop policy if exists "Driver penalties owned" on public.driver_penalties;
create policy "Driver penalties owned" on public.driver_penalties for select to authenticated using (driver_id = auth.uid());

-- ============================================================
-- DATE INIȚIALE — documente per țară
-- ============================================================

insert into public.country_documents (country_code, doc_type, doc_label_i18n, is_required, display_order)
values
  ('RO', 'id_card', '{"ro":"Carte de identitate","en":"ID Card"}', true, 1),
  ('RO', 'license', '{"ro":"Permis de conducere","en":"Driver License"}', true, 2),
  ('RO', 'insurance', '{"ro":"Asigurare RCA","en":"Car Insurance"}', true, 3),
  ('RO', 'itp', '{"ro":"ITP valabil","en":"Technical Inspection"}', true, 4),
  ('DE', 'id_card', '{"de":"Personalausweis","en":"ID Card"}', true, 1),
  ('DE', 'license', '{"de":"Führerschein","en":"Driver License"}', true, 2),
  ('DE', 'insurance', '{"de":"Kfz-Versicherung","en":"Car Insurance"}', true, 3),
  ('DE', 'tuev', '{"de":"TÜV","en":"Technical Inspection"}', true, 4),
  ('FR', 'id_card', '{"fr":"Carte d''identité","en":"ID Card"}', true, 1),
  ('FR', 'license', '{"fr":"Permis de conduire","en":"Driver License"}', true, 2),
  ('FR', 'insurance', '{"fr":"Assurance auto","en":"Car Insurance"}', true, 3)
on conflict do nothing;
