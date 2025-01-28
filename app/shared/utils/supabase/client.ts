import { createBrowserClient } from '@supabase/ssr';

import { AUTH_COOKIE_NAME } from '@/config';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: { name: AUTH_COOKIE_NAME },
    }
  );
}
