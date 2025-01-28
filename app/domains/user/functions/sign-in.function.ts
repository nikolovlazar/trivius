import { getSupabaseServerClient } from '@/domains/shared/utils/supabase/server';
import { createServerFn } from '@tanstack/start';

export const signinFn = createServerFn()
  .validator((d: any) => d as { email: string; password: string })
  .handler(async ({ data }) => {
    const { email, password } = data;

    const supabase = getSupabaseServerClient();

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      return {
        error: true,
        message: 'An error happened while signing in...',
      };
    }
  });
