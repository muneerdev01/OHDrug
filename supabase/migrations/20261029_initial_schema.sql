-- ==============================================================================
-- OHDrug.com — A product of MuneerDataAI
-- Migration: Initial Database Schema, Row Level Security (RLS), & Storage
-- Platform: Registered Pharmacist & Automation Architect (Muneer)
-- ==============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Profiles Table (Linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('admin', 'client')),
    full_name TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

COMMENT ON TABLE public.profiles IS 'User profiles with role-based access control (admin or client).';

-- 3. Create Blogs Table (Markdown Clinical & Automation Articles)
CREATE TABLE IF NOT EXISTS public.blogs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT NOT NULL,
    cover_image_url TEXT,
    category TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    published BOOLEAN NOT NULL DEFAULT false,
    author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

COMMENT ON TABLE public.blogs IS 'Clinical pharmacy, healthcare data extraction, and automation articles.';

-- 4. Create Automations Table (Portfolio Architectures & B2B Solutions)
CREATE TABLE IF NOT EXISTS public.automations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    demo_url TEXT,
    tech_stack TEXT[] DEFAULT '{}',
    metrics JSONB DEFAULT '{}'::jsonb,
    featured BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

COMMENT ON TABLE public.automations IS 'Enterprise automation pipelines, scraper architectures, and clinical dashboards.';

-- 5. Create Leads Table (Consultation & Service Inquiries)
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    company TEXT,
    service_needed TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'in_progress', 'closed', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

COMMENT ON TABLE public.leads IS 'Inbound client leads and enterprise consultation requests for MuneerDataAI.';

-- 6. Create Analytics Logs Table (Dataset Telemetry & Extraction Metrics)
CREATE TABLE IF NOT EXISTS public.analytics_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_dataset TEXT NOT NULL,
    query_params JSONB DEFAULT '{}'::jsonb,
    execution_time_ms INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

COMMENT ON TABLE public.analytics_logs IS 'Real-time extraction execution metrics and dataset query logs.';

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS across all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ------------------------------------------------------------------------------
-- Profiles Policies
-- ------------------------------------------------------------------------------
CREATE POLICY "Profiles viewable by self and admins"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile; admins can update any"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id OR public.is_admin())
    WITH CHECK (auth.uid() = id OR public.is_admin());

-- ------------------------------------------------------------------------------
-- Blogs Policies
-- Public SELECT for published records; Admins have full access
-- ------------------------------------------------------------------------------
CREATE POLICY "Public can view published blogs"
    ON public.blogs FOR SELECT
    USING (published = true OR public.is_admin());

CREATE POLICY "Only admins can insert blogs"
    ON public.blogs FOR INSERT
    WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update blogs"
    ON public.blogs FOR UPDATE
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can delete blogs"
    ON public.blogs FOR DELETE
    USING (public.is_admin());

-- ------------------------------------------------------------------------------
-- Automations Policies
-- Public SELECT; Admins have full write access
-- ------------------------------------------------------------------------------
CREATE POLICY "Public can view featured or published automations"
    ON public.automations FOR SELECT
    USING (true);

CREATE POLICY "Only admins can insert automations"
    ON public.automations FOR INSERT
    WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update automations"
    ON public.automations FOR UPDATE
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can delete automations"
    ON public.automations FOR DELETE
    USING (public.is_admin());

-- ------------------------------------------------------------------------------
-- Leads Policies
-- Public can INSERT; Admins can SELECT and UPDATE
-- ------------------------------------------------------------------------------
CREATE POLICY "Public can insert leads"
    ON public.leads FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Only admins can view leads"
    ON public.leads FOR SELECT
    USING (public.is_admin());

CREATE POLICY "Only admins can update leads"
    ON public.leads FOR UPDATE
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can delete leads"
    ON public.leads FOR DELETE
    USING (public.is_admin());

-- ------------------------------------------------------------------------------
-- Analytics Logs Policies
-- Public can INSERT; Admins can SELECT
-- ------------------------------------------------------------------------------
CREATE POLICY "Public can insert analytics logs"
    ON public.analytics_logs FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Only admins can view analytics logs"
    ON public.analytics_logs FOR SELECT
    USING (public.is_admin());

-- ==============================================================================
-- STORAGE CONFIGURATION
-- Bucket: blog-images (Public reads, admin-only writes, max 2MB, jpg/png/webp)
-- ==============================================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'blog-images',
    'blog-images',
    true,
    2097152, -- 2MB in bytes
    ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 2097152,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];

-- Storage Policies:
-- 1. Public can view objects
CREATE POLICY "Public Access to Blog Images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'blog-images');

-- 2. Only authenticated admins can upload
CREATE POLICY "Admins can upload blog images"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'blog-images'
        AND public.is_admin()
    );

-- 3. Only authenticated admins can update
CREATE POLICY "Admins can update blog images"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'blog-images'
        AND public.is_admin()
    );

-- 4. Only authenticated admins can delete
CREATE POLICY "Admins can delete blog images"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'blog-images'
        AND public.is_admin()
    );
