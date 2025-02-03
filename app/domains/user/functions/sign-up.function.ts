import { createServerFn } from '@tanstack/start';

import { getSupabaseServerClient } from '@/domains/shared/utils/supabase/server';

export const signupFn = createServerFn()
  .validator((d: any) => d as { email: string; password: string })
  .handler(async ({ data }) => {
    const { email, password } = data;

    const supabase = getSupabaseServerClient();

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      return {
        error: signUpError,
        message: 'An error happened while signing up...',
      };
    }
  });
