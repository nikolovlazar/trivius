import { createServerFn } from '@tanstack/start';

import { getSupabaseServerClient } from '@/domains/shared/utils/supabase/server';

export const signoutFn = createServerFn().handler(async () => {
  const supabase = getSupabaseServerClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    throw Error('An error happened while signing out...');
  }
});
