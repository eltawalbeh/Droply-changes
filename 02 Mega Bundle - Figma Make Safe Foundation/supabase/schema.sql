create extension if not exists pgcrypto;

do $$ begin
  create type public.user_role as enum ('platform_admin','station_admin','station_staff','driver','customer');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.order_status as enum ('new','accepted','out_for_delivery','delivered','closed','cancelled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.payment_method as enum ('cash','cliq','coupon');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.payment_status as enum ('pending','paid');
exception when duplicate_object then null; end $$;

create table if not exists public.stations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  logo_url text,
  brand_color text,
  currency text not null default 'JOD',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.station_locations (
  id uuid primary key default gen_random_uuid(),
  station_id uuid not null references public.stations(id) on delete cascade,
  name text not null,
  phone text,
  address_text text,
  cliq_alias text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.service_areas (
  id uuid primary key default gen_random_uuid(),
  station_location_id uuid not null references public.station_locations(id) on delete cascade,
  name text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.staff_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  station_id uuid references public.stations(id) on delete cascade,
  full_name text not null,
  phone text,
  role public.user_role not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.drivers (
  id uuid primary key default gen_random_uuid(),
  station_id uuid not null references public.stations(id) on delete cascade,
  staff_user_id uuid unique references public.staff_profiles(id) on delete set null,
  full_name text not null,
  phone text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.service_areas add column if not exists driver_id uuid references public.drivers(id) on delete set null;

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  station_id uuid not null references public.stations(id) on delete cascade,
  phone text not null,
  full_name text not null,
  pin_hash text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique(station_id, phone)
);

comment on column public.customers.pin_hash is 'Server-side hash only. Never store or expose a raw customer PIN.';

create table if not exists public.customer_addresses (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  service_area_id uuid references public.service_areas(id) on delete set null,
  label text not null default 'Home',
  address_text text not null,
  latitude numeric(9,6),
  longitude numeric(9,6),
  notes text,
  is_default boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.container_types (
  id uuid primary key default gen_random_uuid(),
  station_id uuid not null references public.stations(id) on delete cascade,
  name text not null,
  size_liters numeric(7,2),
  price numeric(10,3) not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.customer_containers (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  container_type_id uuid not null references public.container_types(id) on delete cascade,
  quantity integer not null default 0 check (quantity >= 0),
  unique(customer_id, container_type_id)
);

create table if not exists public.qr_codes (
  id uuid primary key default gen_random_uuid(),
  station_location_id uuid not null references public.station_locations(id) on delete cascade,
  code text unique not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  station_id uuid not null references public.stations(id) on delete cascade,
  station_location_id uuid not null references public.station_locations(id) on delete restrict,
  customer_id uuid not null references public.customers(id) on delete restrict,
  customer_address_id uuid not null references public.customer_addresses(id) on delete restrict,
  driver_id uuid references public.drivers(id) on delete set null,
  status public.order_status not null default 'new',
  total_amount numeric(10,3) not null default 0,
  payment_method public.payment_method,
  payment_status public.payment_status not null default 'pending',
  customer_note text,
  accepted_at timestamptz,
  out_for_delivery_at timestamptz,
  delivered_at timestamptz,
  closed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  container_type_id uuid not null references public.container_types(id) on delete restrict,
  quantity integer not null check (quantity > 0),
  unit_price numeric(10,3) not null,
  line_total numeric(10,3) generated always as (quantity * unit_price) stored
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  method public.payment_method not null,
  amount numeric(10,3) not null check (amount >= 0),
  status public.payment_status not null default 'pending',
  reference text,
  confirmed_by uuid references public.staff_profiles(id) on delete set null,
  confirmed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_locations_station on public.station_locations(station_id);
create index if not exists idx_customers_station_phone on public.customers(station_id, phone);
create index if not exists idx_orders_station_created on public.orders(station_id, created_at desc);
create index if not exists idx_orders_driver_status on public.orders(driver_id, status);
create index if not exists idx_addresses_area on public.customer_addresses(service_area_id);

alter table public.stations enable row level security;
alter table public.station_locations enable row level security;
alter table public.service_areas enable row level security;
alter table public.staff_profiles enable row level security;
alter table public.drivers enable row level security;
alter table public.customers enable row level security;
alter table public.customer_addresses enable row level security;
alter table public.container_types enable row level security;
alter table public.customer_containers enable row level security;
alter table public.qr_codes enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payments enable row level security;

-- Add strict RLS policies together with the authenticated backend implementation.
-- Do not create permissive demo policies.
