
-- OHDrug.com Initial Database Schema
-- Created: 2026-10-31

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ==========================================
-- PROFILES TABLE
-- ==========================================

create table if not exists profiles (
  id uuid primary key default uuid_generate_v4(),
  full_name text,
  role text default 'client' check (role in ('admin', 'operator', 'client')),
  created_at timestamp with time zone default now()
);

-- Create index on id for faster lookups
create index if not exists idx_profiles_id on profiles(id);

-- ==========================================
-- BLOGS TABLE
-- ==========================================

create table if not exists blogs (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text unique not null,
  category text not null,
  excerpt text,
  content text not null,
  video_url text,
  cover_image_url text,
  reading_time text,
  is_published boolean default false,
  created_at timestamp with time zone default now()
);

-- Create indexes for common queries
create index if not exists idx_blogs_id on blogs(id);
create index if not exists idx_blogs_slug on blogs(slug);
create index if not exists idx_blogs_category on blogs(category);
create index if not exists idx_blogs_is_published on blogs(is_published);
create index if not exists idx_blogs_created_at on blogs(created_at desc);

-- ==========================================
-- LEADS TABLE
-- ==========================================

create table if not exists leads (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  company text,
  service text,
  message text,
  status text default 'New' check (status in ('New', 'Contacted', 'Qualified', 'Converted', 'Closed')),
  created_at timestamp with time zone default now()
);

-- Create indexes for common queries
create index if not exists idx_leads_id on leads(id);
create index if not exists idx_leads_email on leads(email);
create index if not exists idx_leads_status on leads(status);
create index if not exists idx_leads_created_at on leads(created_at desc);

-- ==========================================
-- ROW LEVEL SECURITY (RLS)
-- ==========================================

-- Enable RLS on all tables
alter table profiles enable row level security;
alter table blogs enable row level security;
alter table leads enable row level security;

-- Profiles policies
create policy "Profiles are publicly readable" on profiles
  for select using (true);

create policy "Users can insert their own profile" on profiles
  for insert with check (true);

create policy "Users can update their own profile" on profiles
  for update using (true);

-- Blogs policies - public read for published blogs
create policy "Published blogs are publicly readable" on blogs
  for select using (is_published = true);

create policy "Admins can read all blogs" on blogs
  for select using (auth.jwt() ->> 'role' = 'admin');

create policy "Admins can create blogs" on blogs
  for insert with check (auth.jwt() ->> 'role' = 'admin');

create policy "Admins can update blogs" on blogs
  for update using (auth.jwt() ->> 'role' = 'admin');

create policy "Admins can delete blogs" on blogs
  for delete using (auth.jwt() ->> 'role' = 'admin');

-- Leads policies - public insert, admin read/update
create policy "Anyone can insert leads" on leads
  for insert with check (true);

create policy "Admins can read leads" on leads
  for select using (auth.jwt() ->> 'role' = 'admin');

create policy "Admins can update leads" on leads
  for update using (auth.jwt() ->> 'role' = 'admin');

create policy "Admins can delete leads" on leads
  for delete using (auth.jwt() ->> 'role' = 'admin');

-- ==========================================
-- TRIGGERS (Optional - for audit logging)
-- ==========================================

-- Create function to update timestamps
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.created_at = now();
  return new;
end;
$$ language plpgsql;

-- Comment: Note that we're using created_at only. If you need updated_at,
-- add it to the table definitions and uncomment the triggers below.

-- Trigger for blogs (if updated_at added)
-- create trigger update_blogs_timestamp before update on blogs
--   for each row execute procedure update_updated_at_column();

-- ==========================================
-- SAMPLE DATA (Optional for development)
-- ==========================================

-- Insert sample profile
insert into profiles (id, full_name, role)
values ('550e8400-e29b-41d4-a716-446655440000', 'Admin User', 'admin')
on conflict do nothing;

-- Insert sample blog post
insert into blogs (title, slug, category, excerpt, content, reading_time, is_published)
values (
  'Understanding Generic vs. Brand Medicines in Pakistan',
  'understanding-generic-brands',
  'Pakistan Healthcare',
  'Learn the differences between generic and brand name medicines and how to make informed choices.',
  'In Pakistan, the pharmaceutical market comprises over 70,000 registered drug formulations...',
  '5 min read',
  true
)
on conflict (slug) do nothing;

-- ==========================================
-- GRANTS AND PERMISSIONS
-- ==========================================

-- Grant usage on schema
grant usage on schema public to anon, authenticated, service_role;

-- Grant select on published content to anonymous users
grant select on profiles to anon, authenticated;
grant select on blogs to anon, authenticated;
grant insert on leads to anon;
grant select, insert, update, delete on leads to authenticated;

-- Grant all permissions to service role
grant all on all tables in schema public to service_role;
grant all on all sequences in schema public to service_role;
