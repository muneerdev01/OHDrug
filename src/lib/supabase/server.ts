/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * OHDrug.com — A product of MuneerDataAI
 * Server-Side Supabase Client for Next.js App Router
 */

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import type { Database } from '@/src/types/database';

export async function createServerSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

  // Dynamically resolve next/headers cookies if running inside Next.js Server Components/Actions
  let cookieStore: any = null;
  try {
    // @ts-ignore
    const nextHeaders = await import('next/headers');
    cookieStore = await nextHeaders.cookies();
  } catch {
    // Fallback if imported outside Next.js runtime
  }

  return createServerClient<Database>(
    supabaseUrl || 'https://demo-ohdrug.supabase.co',
    supabaseAnonKey || 'dummy-key',
    {
      cookies: {
        getAll() {
          if (!cookieStore) return [];
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options: CookieOptions }>) {
          if (!cookieStore) return;
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing user sessions.
          }
        },
      },
    }
  );
}
