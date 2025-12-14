
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
