
-- Create site_settings table
create table if not exists site_settings (
  id bigint primary key default 1,
  about_us_content text,
  logo_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Insert initial row if not exists
insert into site_settings (id, about_us_content, logo_url)
values (1, '', null)
on conflict (id) do nothing;

-- Create payment_methods table
create table if not exists payment_methods (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  account_number text not null,
  qr_code_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS (Optional but recommended)
-- alter table site_settings enable row level security;
-- alter table payment_methods enable row level security;

-- Drop existing policies to avoid "policy already exists" errors
drop policy if exists "Public can view site settings" on site_settings;
drop policy if exists "Public can update site settings" on site_settings;
drop policy if exists "Public can view payment methods" on payment_methods;
drop policy if exists "Public can insert payment methods" on payment_methods;
drop policy if exists "Public can delete payment methods" on payment_methods;

-- Create policies
-- Policy for public read access to site_settings
create policy "Public can view site settings"
  on site_settings for select
  to public
  using (true);

-- Policy for admin write access to site_settings
create policy "Public can update site settings"
  on site_settings for update
  to public
  using (true);

-- Policy for public read access to payment_methods
create policy "Public can view payment methods"
  on payment_methods for select
  to public
  using (true);

-- Policy for admin write access to payment_methods
create policy "Public can insert payment methods"
  on payment_methods for insert
  to public
  with check (true);

create policy "Public can delete payment methods"
  on payment_methods for delete
  to public
  using (true);

-- Create freelancers table if not exists (inferred)
create table if not exists freelancers (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  role text,
  rate numeric,
  rate_unit text,
  availability text,
  location text,
  image_url text,
  bio text,
  skills text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS logic relative to freelancers if needed
-- For now, just ensuring the column exists
-- ALTER TABLE freelancers ADD COLUMN IF NOT EXISTS bio text;


-- ---------------------------------------------------------------
-- Categories (service categories shown on the site)
-- ---------------------------------------------------------------
create table if not exists categories (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Seed default categories (only the ones that don't exist yet)
insert into categories (name, slug)
select v.name, v.slug
from (values
  ('Hotel Services', 'hotel-services'),
  ('Restaurant Services', 'restaurant-services'),
  ('Health, Wellness & Beauty', 'health-wellness-beauty'),
  ('Transportation / Delivery', 'transportation-delivery'),
  ('Maintenance Services', 'maintenance-services'),
  ('Building / House Services', 'building-house-services'),
  ('Tutorial Services', 'tutorial-services'),
  ('Legal & Documentation', 'legal-documentation')
) as v(name, slug)
where not exists (select 1 from categories c where c.slug = v.slug);

-- ---------------------------------------------------------------
-- Bookings (created from the booking modal, managed in /admin/bookings)
-- ---------------------------------------------------------------
create table if not exists bookings (
  id uuid default gen_random_uuid() primary key,
  freelancer_id uuid,
  freelancer_name text not null,
  category text,
  client_name text not null,
  client_phone text not null,
  description text,
  preferred_date date,
  amount numeric,
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS so policies below take effect
alter table bookings enable row level security;

-- Drop existing policies (safe to re-run)
drop policy if exists "Public can view bookings" on bookings;
drop policy if exists "Public can insert bookings" on bookings;
drop policy if exists "Public can update bookings" on bookings;
drop policy if exists "Public can delete bookings" on bookings;

-- Anyone (client) can submit a booking
create policy "Public can insert bookings"
  on bookings for insert
  to public
  with check (true);

-- Anyone (admin dashboard) can read bookings
create policy "Public can view bookings"
  on bookings for select
  to public
  using (true);

-- Admin can update booking status
create policy "Public can update bookings"
  on bookings for update
  to public
  using (true);

-- Admin can delete bookings
create policy "Public can delete bookings"
  on bookings for delete
  to public
  using (true);

-- ---------------------------------------------------------------
-- Bookings: upgrade an older bookings table that is missing columns
-- (safe to re-run; does nothing for columns that already exist)
-- ---------------------------------------------------------------
alter table bookings add column if not exists freelancer_id uuid;
alter table bookings add column if not exists freelancer_name text;
alter table bookings add column if not exists category text;
alter table bookings add column if not exists client_name text;
alter table bookings add column if not exists client_phone text;
alter table bookings add column if not exists description text;
alter table bookings add column if not exists preferred_date date;
alter table bookings add column if not exists amount numeric;
alter table bookings add column if not exists status text not null default 'pending';
alter table bookings add column if not exists created_at timestamp with time zone default timezone('utc'::text, now()) not null;

-- Make Supabase's API pick up the new columns immediately
notify pgrst, 'reload schema';
