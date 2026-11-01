/**
 * Database Type Definitions for OHDrug.com
 * Generated from Supabase schema
 * 
 * This file contains all TypeScript interfaces for database tables
 * and the complete Supabase Database schema definition.
 */

// ==========================================
// PROFILES TABLE
// ==========================================

export interface Profile {
  id: string;
  full_name: string | null;
  role: 'admin' | 'operator' | 'client';
  created_at: string;
}

export type ProfileCreate = Omit<Profile, 'id' | 'created_at'>;
export type ProfileUpdate = Partial<Omit<Profile, 'id' | 'created_at'>>;

// ==========================================
// BLOGS TABLE
// ==========================================

export interface Blog {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string | null;
  content: string;
  video_url: string | null;
  cover_image_url: string | null;
  reading_time: string | null;
  is_published: boolean;
  published?: boolean;
  created_at: string;
  updated_at?: string;
  tags?: string[];
  author_id?: string;
}

export type BlogCreate = Omit<Blog, 'id' | 'created_at'>;
export type BlogUpdate = Partial<Omit<Blog, 'id' | 'created_at'>>;

export interface BlogListResponse {
  blogs: Blog[];
  total: number;
  page: number;
  page_size: number;
}

// ==========================================
// LEADS TABLE
// ==========================================

export type LeadStatus = 'New' | 'Contacted' | 'In Progress' | 'Archived' | 'new' | 'contacted' | 'in_progress' | 'archived' | 'closed';

export interface Lead {
  id: string;
  name: string;
  email: string;
  company?: string | null;
  service?: string | null;
  service_needed?: string;
  message: string | null;
  status: LeadStatus;
  created_at: string;
}

export type LeadCreate = Omit<Lead, 'id' | 'created_at' | 'status'> & {
  status?: LeadStatus;
};

export type LeadUpdate = Partial<Omit<Lead, 'id' | 'created_at'>>;

// ==========================================
// SUPABASE DATABASE SCHEMA
// ==========================================

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: ProfileCreate;
        Update: ProfileUpdate;
        Relationships: [];
      };
      blogs: {
        Row: Blog;
        Insert: BlogCreate;
        Update: BlogUpdate;
        Relationships: [];
      };
      leads: {
        Row: Lead;
        Insert: LeadCreate;
        Update: LeadUpdate;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: 'admin' | 'operator' | 'client';
      lead_status: LeadStatus;
    };
  };
}

// ==========================================
// QUERY RESPONSE TYPES
// ==========================================

export interface QueryResponse<T> {
  data: T | null;
  error: QueryError | null;
}

export interface QueryListResponse<T> {
  data: T[];
  error: QueryError | null;
  count: number;
}

export interface QueryError {
  message: string;
  details: string;
  hint: string;
  code: string;
}

// ==========================================
// API RESPONSE TYPES
// ==========================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationMeta {
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
  error?: string;
}

// ==========================================
// FILTER AND SORT TYPES
// ==========================================

export type SortOrder = 'asc' | 'desc';

export interface BlogFilters {
  category?: string;
  is_published?: boolean;
  search?: string;
  sort_by?: 'created_at' | 'title';
  sort_order?: SortOrder;
  page?: number;
  page_size?: number;
}

export interface LeadFilters {
  status?: LeadStatus;
  service?: string;
  search?: string;
  sort_by?: 'created_at' | 'name';
  sort_order?: SortOrder;
  page?: number;
  page_size?: number;
}

// ==========================================
// REQUEST BODY TYPES
// ==========================================

export interface CreateBlogRequest {
  title: string;
  slug: string;
  category: string;
  excerpt?: string;
  content: string;
  video_url?: string;
  cover_image_url?: string;
  reading_time?: string;
  is_published?: boolean;
}

export interface UpdateBlogRequest {
  title?: string;
  slug?: string;
  category?: string;
  excerpt?: string;
  content?: string;
  video_url?: string;
  cover_image_url?: string;
  reading_time?: string;
  is_published?: boolean;
}

export interface CreateLeadRequest {
  name: string;
  email: string;
  company?: string;
  service?: string;
  message?: string;
}

export interface UpdateLeadRequest {
  name?: string;
  email?: string;
  company?: string;
  service?: string;
  message?: string;
  status?: LeadStatus;
}

// ==========================================
// UTILITY TYPES
// ==========================================

/**
 * Type-safe way to access database columns
 */
export const DatabaseColumns = {
  profiles: {
    id: 'id',
    full_name: 'full_name',
    role: 'role',
    created_at: 'created_at',
  } as const,
  blogs: {
    id: 'id',
    title: 'title',
    slug: 'slug',
    category: 'category',
    excerpt: 'excerpt',
    content: 'content',
    video_url: 'video_url',
    cover_image_url: 'cover_image_url',
    reading_time: 'reading_time',
    is_published: 'is_published',
    created_at: 'created_at',
  } as const,
  leads: {
    id: 'id',
    name: 'name',
    email: 'email',
    company: 'company',
    service: 'service',
    message: 'message',
    status: 'status',
    created_at: 'created_at',
  } as const,
} as const;

/**
 * Helper type to extract column names
 */
export type ProfileColumn = keyof typeof DatabaseColumns.profiles;
export type BlogColumn = keyof typeof DatabaseColumns.blogs;
export type LeadColumn = keyof typeof DatabaseColumns.leads;

// ==========================================
// AGGREGATE TYPES
// ==========================================

export interface BlogStats {
  total_blogs: number;
  published_count: number;
  draft_count: number;
  categories: {
    category: string;
    count: number;
  }[];
}

export interface LeadStats {
  total_leads: number;
  new_count: number;
  contacted_count: number;
  qualified_count: number;
  converted_count: number;
  closed_count: number;
  services: {
    service: string;
    count: number;
  }[];
}

// ==========================================
// UNION TYPES
// ==========================================

export type DatabaseTable = Profile | Blog | Lead;
export type DatabaseTableKey = 'profiles' | 'blogs' | 'leads';
