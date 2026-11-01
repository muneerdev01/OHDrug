# OHDrug.com Database Setup Guide

## Overview

This guide covers the complete database schema setup for OHDrug.com using Supabase PostgreSQL.

## Files Created

### 1. SQL Migration: `/supabase/migrations/20261031_init.sql`

Comprehensive PostgreSQL migration file that includes:

#### Tables Created:

**profiles** (User Profiles)
- `id` (UUID, Primary Key)
- `full_name` (text, nullable)
- `role` (text, default: 'client') - enum: admin, operator, client
- `created_at` (timestamp with timezone)

**blogs** (Blog Posts)
- `id` (UUID, Primary Key)
- `title` (text, required)
- `slug` (text, unique, required)
- `category` (text, required)
- `excerpt` (text, nullable)
- `content` (text, required)
- `video_url` (text, nullable)
- `cover_image_url` (text, nullable)
- `reading_time` (text, nullable)
- `is_published` (boolean, default: false)
- `created_at` (timestamp with timezone)

**leads** (Contact Form Submissions)
- `id` (UUID, Primary Key)
- `name` (text, required)
- `email` (text, required)
- `company` (text, nullable)
- `service` (text, nullable)
- `message` (text, nullable)
- `status` (text, default: 'New') - enum: New, Contacted, Qualified, Converted, Closed
- `created_at` (timestamp with timezone)

#### Features:

✅ UUID extension enabled
✅ Indexes on frequently queried columns
✅ Row Level Security (RLS) enabled on all tables
✅ Public read access for published blogs
✅ Public insert for leads (contact form)
✅ Admin-only access for blog management
✅ Admin-only read/update for leads
✅ Sample data for development
✅ Proper grants and permissions

### 2. TypeScript Definitions: `/src/types/database.ts`

Complete type definitions for the database schema:

#### Interfaces:

**Profile & Related Types**
- `Profile` - Full row type
- `ProfileCreate` - Insert request type
- `ProfileUpdate` - Update request type

**Blog & Related Types**
- `Blog` - Full row type
- `BlogCreate` - Insert request type
- `BlogUpdate` - Update request type
- `BlogListResponse` - Paginated response
- `BlogFilters` - Query filter options
- `CreateBlogRequest` - API request type
- `UpdateBlogRequest` - API request type
- `BlogStats` - Aggregate statistics
- `BlogColumn` - Type-safe column reference

**Lead & Related Types**
- `Lead` - Full row type
- `LeadCreate` - Insert request type
- `LeadUpdate` - Update request type
- `LeadStatus` - Union type for status enum
- `LeadFilters` - Query filter options
- `CreateLeadRequest` - API request type
- `UpdateLeadRequest` - API request type
- `LeadStats` - Aggregate statistics
- `LeadColumn` - Type-safe column reference

**Supabase Database Schema**
- `Database` - Complete schema definition for Supabase client typing

**Utility Types**
- `DatabaseColumns` - Type-safe column references
- `DatabaseTable` - Union of all table types
- `DatabaseTableKey` - Union of table names
- `QueryResponse<T>` - Query result wrapper
- `QueryListResponse<T>` - List query result wrapper
- `ApiResponse<T>` - API response wrapper
- `PaginatedResponse<T>` - Paginated API response
- `PaginationMeta` - Pagination metadata
- `SortOrder` - Sort direction type

## Setup Instructions

### Step 1: Run the SQL Migration

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Create a new query
4. Copy and paste the contents of `supabase/migrations/20261031_init.sql`
5. Click **Run**

Expected result: All tables created with indexes, RLS policies, and sample data.

### Step 2: Verify Tables in Supabase

In your Supabase dashboard:
1. Go to **Table Editor**
2. Verify these tables exist:
   - `profiles`
   - `blogs`
   - `leads`

3. Check the RLS policies under **Authentication** → **Policies**

### Step 3: Use TypeScript Types in Your Application

#### Example API Service:

```typescript
import { Database } from '@/types/database';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient<Database>(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

// Get published blogs
const { data: blogs } = await supabase
  .from('blogs')
  .select('*')
  .eq('is_published', true)
  .order('created_at', { ascending: false });

// Create a lead
const { data: lead, error } = await supabase
  .from('leads')
  .insert([
    {
      name: 'John Doe',
      email: 'john@example.com',
      service: 'Consultation',
      message: 'I would like to learn more...'
    }
  ])
  .select()
  .single();

// Update lead status (admin only)
const { data: updated } = await supabase
  .from('leads')
  .update({ status: 'Contacted' })
  .eq('id', leadId)
  .select()
  .single();
```

#### Example React Hook:

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Blog, Lead } from '@/types/database';

export function useBlogs(filters?: BlogFilters) {
  return useQuery({
    queryKey: ['blogs', filters],
    queryFn: async () => {
      let query = supabase
        .from('blogs')
        .select('*');

      if (filters?.is_published !== undefined) {
        query = query.eq('is_published', filters.is_published);
      }
      if (filters?.category) {
        query = query.eq('category', filters.category);
      }

      const { data, error } = await query
        .order(filters?.sort_by || 'created_at', {
          ascending: filters?.sort_order === 'asc'
        });

      if (error) throw error;
      return data as Blog[];
    }
  });
}

export function useCreateLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (lead: CreateLeadRequest) => {
      const { data, error } = await supabase
        .from('leads')
        .insert([lead])
        .select()
        .single();

      if (error) throw error;
      return data as Lead;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    }
  });
}
```

## Row Level Security (RLS) Policies

### Blogs Policies

- **Public SELECT**: Anyone can read published blogs (`is_published = true`)
- **Admin SELECT**: Admins can read all blogs (published and drafts)
- **Admin INSERT**: Only admins can create blogs
- **Admin UPDATE**: Only admins can modify blogs
- **Admin DELETE**: Only admins can delete blogs

### Leads Policies

- **Public INSERT**: Anyone can submit a lead (contact form)
- **Admin SELECT**: Only admins can view leads
- **Admin UPDATE**: Only admins can update lead status
- **Admin DELETE**: Only admins can delete leads

### Profiles Policies

- **Public SELECT**: Anyone can view profiles
- **Public INSERT**: Anyone can create a profile
- **Public UPDATE**: Users can update their own profile

## Indexes

Indexes are created on:
- `profiles.id` - Primary key lookup
- `blogs.id` - Primary key lookup
- `blogs.slug` - URL slug lookup
- `blogs.category` - Category filtering
- `blogs.is_published` - Published status filtering
- `blogs.created_at` - Date-based sorting
- `leads.id` - Primary key lookup
- `leads.email` - Email lookup
- `leads.status` - Status filtering
- `leads.created_at` - Date-based sorting

## Sample Data

The migration includes sample data for development:
- 1 admin profile
- 1 published blog post about generic vs. brand medicines

## TypeScript Compilation

All type definitions are fully typed and compile without errors:

```bash
# Verify TypeScript compilation
npx tsc --noEmit src/types/database.ts
```

Expected result: No errors

## Supabase Client Setup

### Installation:

```bash
npm install @supabase/supabase-js
```

### Create Supabase Client with Types:

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL!;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
```

### Environment Variables:

```env
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
```

## Database Diagram

```
┌─────────────────┐
│   profiles      │
├─────────────────┤
│ id (PK)         │
│ full_name       │
│ role            │
│ created_at      │
└─────────────────┘

┌─────────────────┐
│   blogs         │
├─────────────────┤
│ id (PK)         │
│ title           │
│ slug (UNIQUE)   │
│ category        │
│ excerpt         │
│ content         │
│ video_url       │
│ cover_image_url │
│ reading_time    │
│ is_published    │
│ created_at      │
└─────────────────┘

┌─────────────────┐
│   leads         │
├─────────────────┤
│ id (PK)         │
│ name            │
│ email           │
│ company         │
│ service         │
│ message         │
│ status          │
│ created_at      │
└─────────────────┘
```

## Common Queries

### Get All Published Blogs:

```sql
SELECT * FROM blogs 
WHERE is_published = true 
ORDER BY created_at DESC;
```

### Get Blog by Slug:

```sql
SELECT * FROM blogs 
WHERE slug = 'understanding-generic-brands' 
AND is_published = true;
```

### Get Leads by Status:

```sql
SELECT * FROM leads 
WHERE status = 'New' 
ORDER BY created_at DESC;
```

### Count Blogs by Category:

```sql
SELECT category, COUNT(*) as count 
FROM blogs 
WHERE is_published = true 
GROUP BY category;
```

## Troubleshooting

### Issue: RLS policies not working

**Solution**: Ensure Supabase JWT includes the `role` claim. Set it in the auth metadata.

### Issue: TypeScript errors with Supabase client

**Solution**: Ensure the `Database` type is imported correctly:

```typescript
import type { Database } from '@/types/database';

const supabase = createClient<Database>(url, key);
```

### Issue: Slug constraint violations

**Solution**: Slugs must be unique. Generate them from titles by:

```typescript
const slug = title
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/(^-|-$)/g, '');
```

## Next Steps

1. ✅ Run the SQL migration in Supabase
2. ✅ Import the TypeScript types in your application
3. ✅ Set up Supabase client with types
4. ✅ Create API service layer using the types
5. ✅ Implement React components using the hooks

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL UUID Type](https://www.postgresql.org/docs/current/datatype-uuid.html)
- [TypeScript with Supabase](https://supabase.com/docs/reference/typescript)
