/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * OHDrug.com — A product of MuneerDataAI
 * Client-Side Supabase Client (Browser Context)
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/src/types/database';

// Support both Next.js App Router (NEXT_PUBLIC_*) and Vite (VITE_*) conventions
const supabaseUrl =
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_URL) ||
  (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_URL) ||
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_URL) ||
  'https://demo-ohdrug.supabase.co';

const supabaseAnonKey =
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY) ||
  (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_ANON_KEY) ||
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_ANON_KEY) ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy';

export const isSupabaseConfigured = Boolean(
  (typeof process !== 'undefined' && (process.env?.NEXT_PUBLIC_SUPABASE_URL || process.env?.VITE_SUPABASE_URL)) ||
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_URL)
);

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export function createBrowserSupabaseClient() {
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });
}
