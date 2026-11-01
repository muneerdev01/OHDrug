# OHDrug.com Database - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Apply the SQL Migration (2 minutes)

1. Open your Supabase project dashboard
2. Go to **SQL Editor** → **New Query**
3. Open this file: `supabase/migrations/20261031_init.sql`
4. Copy all the SQL code
5. Paste it into the Supabase SQL editor
6. Click **Run**
7. ✅ Tables are created!

### Step 2: Verify in Supabase Dashboard (1 minute)

1. Go to **Table Editor**
2. You should see:
   - ✅ `profiles`
   - ✅ `blogs`
   - ✅ `leads`
3. Check each table has sample data

### Step 3: Import Types in Your React App (2 minutes)

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

export const supabase = createClient<Database>(
  process.env.REACT_APP_SUPABASE_URL!,
  process.env.REACT_APP_SUPABASE_ANON_KEY!
);
```

```typescript
// components/BlogList.tsx
import { supabase } from '@/lib/supabase';
import type { Blog } from '@/types/database';

export async function getBlogPosts() {
  // Fully typed! ✨
  const { data: blogs } = await supabase
    .from('blogs')
    .select('*')
    .eq('is_published', true);
  
  return blogs; // Type: Blog[] | null
}
```

## 📊 Database Tables

### profiles
```
id           UUID    (generated)
full_name    text    (nullable)
role         text    ('admin' | 'operator' | 'client')
created_at   timestamp
```

### blogs
```
id               UUID    (generated)
title            text    (required)
slug             text    (unique, required)
category         text    (required)
excerpt          text    (nullable)
content          text    (required)
video_url        text    (nullable)
cover_image_url  text    (nullable)
reading_time     text    (nullable)
is_published     boolean (default: false)
created_at       timestamp
```

### leads
```
id       UUID    (generated)
name     text    (required)
email    text    (required)
company  text    (nullable)
service  text    (nullable)
message  text    (nullable)
status   text    ('New' | 'Contacted' | 'Qualified' | 'Converted' | 'Closed')
created_at timestamp
```

## 🔐 Security (RLS)

- ✅ Public can read **published** blogs
- ✅ Public can **submit** leads
- ✅ Admin can **manage** everything
- ✅ All data is isolated by role

## 📁 Files Created

```
d:\ohdrug.com\
├── supabase/migrations/20261031_init.sql     ← SQL Schema
├── src/types/database.ts                     ← TypeScript Types
├── DATABASE_SETUP_GUIDE.md                   ← Full Documentation
├── DELIVERABLES_CHECKLIST.md                 ← Checklist
└── QUICK_START.md                            ← This file
```

## 💡 Common Patterns

### Get Published Blogs
```typescript
const { data: blogs } = await supabase
  .from('blogs')
  .select('*')
  .eq('is_published', true)
  .order('created_at', { ascending: false });
```

### Submit a Lead
```typescript
const { data: lead } = await supabase
  .from('leads')
  .insert([{
    name: 'John',
    email: 'john@example.com',
    service: 'Consultation'
  }])
  .select()
  .single();
```

### Get Blog by Slug
```typescript
const { data: blog } = await supabase
  .from('blogs')
  .select('*')
  .eq('slug', 'my-blog-post')
  .eq('is_published', true)
  .single();
```

### Update Lead Status (Admin)
```typescript
const { data: updated } = await supabase
  .from('leads')
  .update({ status: 'Contacted' })
  .eq('id', leadId)
  .select()
  .single();
```

## ✅ Verification Checklist

- [ ] SQL migration ran successfully
- [ ] All tables appear in Supabase dashboard
- [ ] Sample data is visible
- [ ] TypeScript file has no errors
- [ ] Types imported in your React app
- [ ] Supabase client created with types
- [ ] Query autocomplete working

## 🆘 Troubleshooting

**"Tables don't appear?"**
→ Check Supabase SQL Editor for error messages

**"TypeScript errors?"**
→ Make sure `Database` type is imported in Supabase client

**"RLS policies blocking queries?"**
→ Ensure you're using `anon key` for public access

**"Slug constraint error?"**
→ Use unique slugs for each blog post

## 📚 Learn More

See `DATABASE_SETUP_GUIDE.md` for:
- Complete setup instructions
- Detailed RLS explanations
- More code examples
- Troubleshooting guide
- Best practices

## 🎯 Next Steps

1. ✅ Apply SQL migration
2. ✅ Import types in your app
3. ✅ Create API service layer
4. ✅ Build React components
5. ✅ Deploy to production

---

**Questions?** Check `DATABASE_SETUP_GUIDE.md` for comprehensive documentation.
