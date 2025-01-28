import { createServerFn } from '@tanstack/start';

import { getSupabaseServerClient } from '@/domains/shared/utils/supabase/server';

export const fetchUser = createServerFn()
  .validator((jwt: string | undefined) => jwt)
  .handler(async ({ data: jwt }) => {
    const supabase = getSupabaseServerClient();
    const { data, error: _error } = await supabase.auth.getUser(jwt);

    if (!data.user?.email) {
      return { user: undefined };
    }

    return {
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata.name,
      },
    };
  });
